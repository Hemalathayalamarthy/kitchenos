import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, CookingPot, Utensils, Package, AlertTriangle, Layers } from 'lucide-react';

const stations = [
  { id: 'hot', name: 'Main Hot Station', icon: Flame, capacity: '12/15', queue: 8, status: 'Busy', waitTime: '15m', currentBatch: 'B15' },
  { id: 'grill', name: 'Fry & Grill Station', icon: CookingPot, capacity: '18/15', queue: 15, status: 'Overloaded', waitTime: '25m', currentBatch: 'G02' },
  { id: 'assembly', name: 'Assembly Station', icon: Utensils, capacity: '4/20', queue: 4, status: 'Free', waitTime: '5m', currentBatch: '-' },
  { id: 'packing', name: 'Packing', icon: Package, capacity: '8/10', queue: 8, status: 'Busy', waitTime: '8m', currentBatch: '-' }
];

export const KitchenStatusWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-slate-500" />
          Kitchen Stations
        </h3>
        <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded border shadow-sm">LIVE</span>
      </div>
      
      <div className="p-2">
        {stations.map(station => {
          const Icon = station.icon;
          const isOverloaded = station.status === 'Overloaded';
          
          return (
            <div key={station.id} className="p-4 hover:bg-slate-50 rounded-lg transition-colors border-b last:border-0 border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${isOverloaded ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-800">{station.name}</span>
                </div>
                <Badge variant={isOverloaded ? 'destructive' : 'secondary'} className="text-[10px] font-bold uppercase tracking-wider">
                  {station.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white border rounded p-2 flex flex-col justify-between">
                   <span className="text-[10px] font-semibold text-slate-400 uppercase">Avg Wait</span>
                   <span className={`text-sm font-bold ${isOverloaded ? 'text-red-600' : 'text-slate-700'}`}>{station.waitTime}</span>
                </div>
                <div className="bg-white border rounded p-2 flex flex-col justify-between">
                   <span className="text-[10px] font-semibold text-slate-400 uppercase">Capacity</span>
                   <span className="text-sm font-bold text-slate-700">{station.capacity}</span>
                </div>
                <div className="bg-white border rounded p-2 flex flex-col justify-between">
                   <span className="text-[10px] font-semibold text-slate-400 uppercase">Queue</span>
                   <span className="text-sm font-bold text-slate-700">{station.queue} items</span>
                </div>
                <div className="bg-white border rounded p-2 flex flex-col justify-between">
                   <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1"><Layers className="w-3 h-3"/> Batch</span>
                   <span className="text-sm font-bold text-slate-700">{station.currentBatch}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
