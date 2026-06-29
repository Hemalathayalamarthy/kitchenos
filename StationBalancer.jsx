import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, ArrowRightLeft, AlertTriangle, CookingPot, Flame } from 'lucide-react';

const STATION_META = [
  { id: 'hot', name: 'Main Hot Station', icon: Flame, capacity: 15 },
  { id: 'grill', name: 'Fry & Grill Station', icon: CookingPot, capacity: 10 },
  { id: 'assembly', name: 'Assembly Station', icon: ChefHat, capacity: 8 }
];

export const StationBalancer = ({ orders = [] }) => {
  const dynamicStations = useMemo(() => {
    // Only count orders that are currently cooking
    const cookingOrders = orders.filter(o => o.lifecycle === 'Cooking');
    
    return STATION_META.map(meta => {
      // Find orders matching this station based on typical item keywords
      let stationOrders = [];
      
      cookingOrders.forEach(o => {
        const matchesStation = o.items.some(i => {
          const name = i.name.toLowerCase();
          if (meta.id === 'hot' && (name.includes('biryani') || name.includes('masala') || name.includes('tikka'))) return true;
          if (meta.id === 'grill' && (name.includes('burger') || name.includes('fries'))) return true;
          if (meta.id === 'assembly' && (name.includes('bowl') || name.includes('salad'))) return true;
          return false;
        });
        
        if (matchesStation) {
          const relevantItemsStr = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
          stationOrders.push({
            id: o.id,
            items: relevantItemsStr,
            timeInStation: '2m' // Mocked time in station for demo
          });
        }
      });
      
      // Calculate load
      const currentLoad = stationOrders.reduce((acc, order) => acc + order.items.split(',').length, 0); // Very rough proxy for load
      const status = currentLoad > meta.capacity ? 'overwhelmed' : 'optimal';
      
      return {
        ...meta,
        currentLoad,
        status,
        orders: stationOrders
      };
    });
  }, [orders]);
  
  const reassignLoad = () => {
    // Demo implementation
    alert("In a real environment, this would redistribute the load.");
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8f9fa] p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Station Balancer</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor kitchen load and re-route orders to prevent bottlenecks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dynamicStations.map(station => {
          const Icon = station.icon;
          const isOverwhelmed = station.status === 'overwhelmed';
          
          return (
            <div key={station.id} className={`bg-white rounded-xl shadow-sm border ${isOverwhelmed ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'} flex flex-col overflow-hidden`}>
              <div className={`p-4 border-b ${isOverwhelmed ? 'bg-red-50/50 border-red-100' : 'bg-slate-50/50 border-slate-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOverwhelmed ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{station.name}</h3>
                  </div>
                  {isOverwhelmed && (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Overwhelmed
                    </Badge>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    <span>Current Load</span>
                    <span className={isOverwhelmed ? 'text-red-600' : 'text-slate-700'}>{station.currentLoad} / {station.capacity} items</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${isOverwhelmed ? 'bg-red-500' : station.currentLoad > 0 ? 'bg-[#0f8b72]' : 'bg-slate-300'}`} style={{ width: `${Math.min(100, (station.currentLoad / station.capacity) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-1 bg-slate-50/30">
                <div className="space-y-3">
                  {station.orders.map(order => (
                    <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col gap-2 transition-all hover:border-slate-300">
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 shadow-none border border-indigo-100/50">{order.id}</Badge>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{order.timeInStation} in station</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-700 truncate">{order.items}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {isOverwhelmed && (
                <div className="p-4 border-t border-red-100 bg-red-50">
                  <p className="text-xs font-bold text-red-700 mb-3 leading-relaxed">
                    Station exceeds maximum capacity. Re-route newer orders to <span className="bg-red-200 px-1 rounded">Assembly Station</span> to balance load.
                  </p>
                  <Button onClick={reassignLoad} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-10 shadow-sm">
                    <ArrowRightLeft className="w-4 h-4 mr-2" /> Re-assign 2 Orders
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
