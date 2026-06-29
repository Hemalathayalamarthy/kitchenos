import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prepTime, setPrepTime] = useState(25);

  useEffect(() => { loadOrder(); }, [id]);

  const loadOrder = async () => {
    try {
      const orderData = await pb.collection('orders').getOne(id, { expand: 'items,items.menu_item_id', $autoCancel: false });
      setOrder(orderData);
    } catch (error) { toast.error('Failed to load order details'); }
    setLoading(false);
  };

  const acceptOrder = async () => {
    try {
      await pb.collection('orders').update(id, { status: 'assigned' }, { $autoCancel: false });
      toast.success(`Order accepted with ${prepTime}m prep time.`);
      navigate('/operations');
    } catch (error) { toast.error('Failed to accept order'); }
  };

  const rejectOrder = async () => {
    try {
      await pb.collection('orders').update(id, { status: 'cancelled' }, { $autoCancel: false });
      toast('Order rejected.');
      navigate('/operations');
    } catch (error) { toast.error('Failed to reject order'); }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const subtotal = order.expand?.items?.reduce((sum, item) => sum + (item.quantity * (item.expand?.menu_item_id?.price || 0)), 0) || 0;
  const timeReceived = new Date(order.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Helmet><title>Order #{order.id.slice(-6).toUpperCase()} - KitchenOS</title></Helmet>
      <div className="min-h-screen bg-secondary/30 pb-20">
        <Header />
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate('/operations')} className="mb-6 font-semibold -ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Incoming
          </Button>
          <Card className="border-none shadow-md overflow-hidden rounded-2xl">
            <div className="bg-card p-6 border-b">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h1 className="text-3xl font-extrabold font-mono-nums tracking-tight">#{order.id.slice(-6).toUpperCase()}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground font-medium">Received {timeReceived}</span>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="outline" className="font-bold">{order.source}</Badge>
                  </div>
                </div>
                <Badge className="bg-status-on-track">PAID</Badge>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="p-6 bg-muted/20 border-b">
                <div className="font-bold text-lg mb-1">{order.customer_name}</div>
                {order.address && (
                  <div className="flex items-start gap-2 text-muted-foreground font-medium text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{order.address}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-muted-foreground mb-4 uppercase tracking-wider text-xs">Order Items</h3>
                <div className="space-y-4">
                  {order.expand?.items?.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="bg-muted text-foreground font-bold px-2 py-1 rounded-md h-fit font-mono-nums">{item.quantity}×</div>
                        <div>
                          <div className="font-bold text-lg">{item.expand?.menu_item_id?.name || 'Unknown Item'}</div>
                          {item.notes && <div className="text-sm text-muted-foreground font-medium mt-1">{item.notes}</div>}
                        </div>
                      </div>
                      <div className="font-bold font-mono-nums">${(item.quantity * (item.expand?.menu_item_id?.price || 0)).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-muted-foreground">Subtotal</span>
                  <span className="font-extrabold font-mono-nums">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              {order.notes && (
                <div className="mx-6 mb-6">
                  <div className="border-2 border-[#fbc02d] bg-[#fff9c4]/30 rounded-xl p-4 relative">
                    <div className="absolute -top-3 left-3 bg-card px-2 text-[#f57f17] font-bold text-xs uppercase flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Note
                    </div>
                    <p className="font-semibold text-sm mt-1">{order.notes}</p>
                  </div>
                </div>
              )}
              <div className="bg-muted/30 p-6 border-t">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-bold text-sm">Set preparation time</label>
                    <span className="font-bold text-primary text-lg font-mono-nums">{prepTime} mins</span>
                  </div>
                  <Slider value={[prepTime]} onValueChange={(v) => setPrepTime(v[0])} max={90} min={5} step={5} className="py-4" />
                  <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
                    <span>5m</span><span>45m</span><span>90m</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="flex-1 font-bold h-14" onClick={rejectOrder}>Reject</Button>
                  <Button size="lg" className="flex-[2] font-bold h-14 text-lg shadow-lg shadow-primary/20" onClick={acceptOrder}>
                    <CheckCircle className="h-5 w-5 mr-2" /> Accept Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
