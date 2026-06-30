import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, Flame, CookingPot, Utensils, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';

const BATCH_META = {
  'B15': { name: 'Chicken Biryani', station: 'Main Hot Station', icon: Flame, timeSaved: '14 mins' },
  'G02': { name: 'Smash Burger', station: 'Fry & Grill Station', icon: CookingPot, timeSaved: '11 mins' },
  'H01': { name: 'Quinoa Power Bowl', station: 'Assembly Station', icon: Utensils, timeSaved: '6 mins' }
};

export const BatchManager = ({ orders = [] }) => {
  const dynamicBatches = useMemo(() => {
    const cookingOrders = orders.filter(o => o.lifecycle === 'Cooking' && o.batchMatch);
    const groups = {};
    
    cookingOrders.forEach(o => {
      if (!groups[o.batchMatch]) {
        groups[o.batchMatch] = [];
      }
      groups[o.batchMatch].push(o);
    });

    return Object.entries(groups).map(([batchId, batchOrders]) => {
      const meta = BATCH_META[batchId] || { name: 'Custom Batch', station: 'Prep Station', icon: Flame, timeSaved: '5 mins' };
      
      // Calculate total portions for the primary item in this batch
      let totalQuantity = 0;
      batchOrders.forEach(o => {
        // Just sum all quantities roughly, or find the specific item
        const item = o.items.find(i => i.name.includes(meta.name.split(' ')[1] || meta.name));
        totalQuantity += item ? item.quantity : 1;
      });

      return {
        id: batchId,
        name: meta.name,
        station: meta.station,
        icon: meta.icon,
        totalQuantity,
        orders: batchOrders.map(o => o.id),
        status: 'cooking',
        progress: 60, // Mock progress for demo
        startedAt: batchOrders[0].time, // Just using the time string
        timeSaved: meta.timeSaved
      };
    });
  }, [orders]);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50/50 p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Batch Manager</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Group identical items across orders to maximize kitchen efficiency.</p>
        </div>
        <Button className="bg-[#0f8b72] hover:bg-[#0a5c4b] text-white font-bold h-10 px-6">
          <Layers className="w-4 h-4 mr-2" /> Auto-Group New Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {dynamicBatches.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
             <Inbox className="w-12 h-12 mb-4 text-slate-300" />
             <p className="font-bold text-slate-500">No active batches running</p>
             <p className="text-sm">Accept orders and group them to see them here.</p>
          </div>
        ) : (
          dynamicBatches.map((batch) => {
            const Icon = batch.icon;
            
            return (
              <div key={batch.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm">{batch.id}</Badge>
                      <Badge variant="outline" className="bg-white text-slate-700 font-bold uppercase text-[10px] flex items-center gap-1 shadow-sm">
                        <Icon className="w-3 h-3 text-slate-500" /> {batch.station}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{batch.name}</h3>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Efficiency Gain</div>
                    <div className="text-sm font-bold text-slate-800 flex items-center justify-end gap-1">
                      Saves {batch.timeSaved}
                    </div>
                  </div>
                </div>
                
                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Quantity to Cook</span>
                    <span className="text-xl font-black text-slate-800">{batch.totalQuantity} <span className="text-sm font-semibold text-slate-400">portions</span></span>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Combined from {batch.orders.length} orders:</span>
                    <div className="flex flex-wrap gap-2">
                      {batch.orders.map(orderId => (
                        <Badge key={orderId} variant="secondary" className="font-mono bg-white text-slate-700 border border-slate-200">
                          #{orderId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-5 pt-0 mt-auto border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  {batch.status === 'cooking' ? (
                    <>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase">
                          <span className="text-blue-600 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> Cooking In Progress</span>
                          <span>{batch.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${batch.progress}%` }}></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                       <div className="text-xs font-medium text-slate-500">Not started yet</div>
                       <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Start Batch <ChevronRight className="w-4 h-4 ml-1"/></Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
