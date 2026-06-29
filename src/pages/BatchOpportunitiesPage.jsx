import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Plus, Minus, Info } from 'lucide-react';
import { toast } from 'sonner';

const BatchOpportunitiesPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBatches(); }, []);

  const loadBatches = async () => {
    try {
      const data = await pb.collection('batch_suggestions').getFullList({
        expand: 'items,items.menu_item_id,items.order_id',
        filter: 'status != "rejected"',
        $autoCancel: false
      });
      setBatches(data);
    } catch (error) {}
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Batch Manager - KitchenOS</title></Helmet>
      <div className="min-h-screen bg-secondary/30 pb-20">
        <Header />
        <div className="container max-w-5xl mx-auto px-4 pt-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-status-on-track/20 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-status-on-track" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Batch Manager</h1>
              <p className="text-muted-foreground font-medium">AI-optimized groupings to save prep time</p>
            </div>
          </div>
          <div className="space-y-6">
            {batches.map(batch => {
              const isAccepted = batch.status === 'accepted';
              return (
                <Card key={batch.id} className={`border-2 ${isAccepted ? 'border-status-on-track/20 bg-card' : 'border-primary/20 bg-primary/5'} overflow-hidden shadow-sm`}>
                  <div className="p-6 md:flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono-nums font-bold text-xs uppercase tracking-wider bg-background">Batch B{batch.id.slice(-3)}</Badge>
                        {isAccepted ? <Badge className="bg-status-on-track font-bold text-[10px]">IN PROGRESS</Badge> : <Badge className="bg-primary font-bold text-[10px]">SUGGESTION</Badge>}
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{batch.dish_name || 'Mixed Items'} <span className="text-muted-foreground">×{batch.order_count || 3}</span></h3>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-6">
                        <Info className="h-4 w-4" />
                        <span>Just started — best time to add new orders</span>
                      </div>
                      <div className="space-y-3 bg-background/50 rounded-xl p-4 border border-border/50">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Orders in batch</div>
                        {batch.expand?.items?.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm font-semibold">
                            <span>#{item.expand?.order_id?.id?.slice(-6).toUpperCase() || 'ORD'} • {item.expand?.order_id?.customer_name}</span>
                            <div className="flex items-center gap-3">
                              <span>Qty: {item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"><Minus className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0 w-full md:w-64 flex flex-col justify-between shrink-0">
                      <div className="bg-background rounded-xl p-4 border text-center shadow-sm mb-4">
                        <div className="text-sm font-bold text-muted-foreground mb-1">Time Savings</div>
                        <div className="text-4xl font-extrabold text-status-on-track font-mono-nums tracking-tighter">{batch.time_savings_minutes || 15}%</div>
                      </div>
                      {isAccepted ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>Progress</span><span>40%</span></div>
                          <Progress value={40} className="h-2" />
                          <Button variant="outline" className="w-full mt-4 font-bold border-dashed border-2"><Plus className="h-4 w-4 mr-2" /> Add Order to Batch</Button>
                        </div>
                      ) : (
                        <Button className="w-full font-bold h-12 text-base shadow-md" onClick={() => toast.success('Batch accepted!')}>Accept Batch</Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            {batches.length === 0 && !loading && (
              <div className="text-center py-20 text-muted-foreground font-medium border-2 border-dashed rounded-xl">No active batch suggestions at the moment.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BatchOpportunitiesPage;
