import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bike, Clock } from 'lucide-react';

export const RiderWaitingWidget = ({ riders }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
          <Bike className="w-4 h-4 text-slate-500" />
          Riders Waiting
        </h3>
        <Badge variant="secondary" className="font-bold">{riders?.length || 0}</Badge>
      </div>
      
      <div className="divide-y divide-slate-100">
        {riders && riders.length > 0 ? riders.map((rider, idx) => {
          const isWarning = rider.waitTimeMins >= 10;
          return (
            <div key={idx} className="p-3 hover:bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-slate-800">{rider.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">Order #{rider.orderId}</div>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold ${isWarning ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                <Clock className="w-3 h-3" />
                {rider.waitTimeMins}m
              </div>
            </div>
          );
        }) : (
          <div className="p-6 text-center text-sm text-slate-500 font-medium">No riders waiting</div>
        )}
      </div>
    </div>
  );
};
