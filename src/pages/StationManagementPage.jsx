import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Flame, Beef, Layers, Package, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const StationManagementPage = () => {
  const [stations, setStations] = useState([]);
  const [activeTab, setActiveTab] = useState('preparing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStations();
    const interval = setInterval(loadStations, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStations = async () => {
    try {
      const data = await pb.collection('stations').getFullList({
        expand: 'items_in_queue,items_in_queue.menu_item_id',
        $autoCancel: false
      });
      setStations(data);
    } catch (error) {}
    setLoading(false);
  };

  const markItemComplete = async (itemId) => {
    try {
      await pb.collection('order_items').update(itemId, { status: 'ready' }, { $autoCancel: false });
      toast.success('Item marked ready');
      loadStations();
    } catch (error) { toast.error('Failed to update item'); }
  };

  const getStationIcon = (name) => {
    switch(name) {
      case 'Hot': return Flame;
      case 'Grill': return Beef;
      case 'Assembly': return Layers;
      default: return Package;
    }
  };

  const preparingCount = stations.reduce((acc, s) => acc + (s.expand?.items_in_queue?.filter(i => i.status !== 'ready').length || 0), 0);

  return (
    <>
      <Helmet><title>Kitchen Status - KitchenOS</title></Helmet>
      <div className="min-h-screen bg-secondary/30 pb-20">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Kitchen Status</h1>
              <p className="text-muted-foreground font-medium mt-1">Live station workloads and progress</p>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-muted/50 p-1">
              <TabsTrigger value="preparing" className="font-semibold px-6">Preparing ({preparingCount})</TabsTrigger>
              <TabsTrigger value="ready" className="font-semibold px-6">Ready (0)</TabsTrigger>
              <TabsTrigger value="pickedup" className="font-semibold px-6">Picked up (0)</TabsTrigger>
            </TabsList>
            <TabsContent value="preparing">
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                {stations.map((station, idx) => {
                  const Icon = getStationIcon(station.name);
                  const items = station.expand?.items_in_queue?.filter(i => i.status !== 'ready') || [];
                  const loadPercent = Math.min(100, Math.round((items.length / (station.capacity || 10)) * 100));
                  let statusColor = 'bg-status-on-track';
                  if (loadPercent > 80) statusColor = 'bg-status-urgent';
                  else if (loadPercent > 50) statusColor = 'bg-status-normal';

                  return (
                    <motion.div key={station.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <Card className="h-full border-none shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between bg-card relative overflow-hidden">
                          <div className={`${statusColor} absolute top-0 left-0 w-1 h-full`} />
                          <div className="flex items-center gap-3 pl-2">
                            <div className="p-2 rounded-lg bg-muted"><Icon className="h-5 w-5 text-foreground" /></div>
                            <div>
                              <CardTitle className="text-lg font-bold">{station.name}</CardTitle>
                              <div className="text-xs font-semibold text-muted-foreground">{items.length} items</div>
                            </div>
                          </div>
                          <div className={`text-sm font-bold ${loadPercent > 80 ? 'text-status-urgent' : 'text-muted-foreground'}`}>{loadPercent}%</div>
                        </div>
                        <div className="h-1.5 w-full bg-muted">
                          <div className={`h-full ${statusColor} transition-all duration-500`} style={{ width: `${loadPercent}%` }} />
                        </div>
                        <CardContent className="flex-1 p-0 bg-secondary/10">
                          <div className="divide-y divide-border/50">
                            {items.map(item => (
                              <div key={item.id} className="p-4 bg-card hover:bg-muted/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="font-bold text-sm pr-4 leading-tight">{item.quantity}× {item.expand?.menu_item_id?.name || 'Item'}</div>
                                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded-md"><Clock className="h-3 w-3" />12m</div>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                  <Badge variant="outline" className="text-[10px] font-bold">#ORD-921</Badge>
                                  <Button size="sm" variant="outline" className="h-7 text-xs font-bold px-3 hover:bg-status-on-track hover:text-white hover:border-status-on-track" onClick={() => markItemComplete(item.id)}>
                                    <Check className="h-3 w-3 mr-1" /> Ready
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {items.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm font-medium">Station idle</div>}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
                {stations.length === 0 && !loading && (
                  <div className="col-span-4 text-center py-20 text-muted-foreground font-medium border-2 border-dashed rounded-xl">No stations found.</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="ready"><div className="text-center py-20 text-muted-foreground font-medium">No items currently ready.</div></TabsContent>
            <TabsContent value="pickedup"><div className="text-center py-20 text-muted-foreground font-medium">History empty.</div></TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default StationManagementPage;
