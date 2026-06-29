import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

export const OperationalSummaryModal = ({ onDeployNextShift }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-[#0f172a] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <CheckCircle2 className="w-16 h-16 text-[#10b981] mx-auto mb-4 relative z-10" />
          <h2 className="text-3xl font-bold mb-2 relative z-10">Rush Hour Completed</h2>
          <p className="text-slate-400 font-medium relative z-10">Outstanding performance! Here is how the kitchen performed.</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1">Total Orders</div>
              <div className="text-3xl font-bold text-slate-800">142</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1">Avg Prep Time</div>
              <div className="text-3xl font-bold text-slate-800">14<span className="text-lg text-slate-400">m</span></div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-emerald-700 font-semibold text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Batch Efficiency</div>
              <div className="text-3xl font-bold text-emerald-800">32%</div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="text-red-700 font-semibold text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Late Orders</div>
              <div className="text-3xl font-bold text-red-800">2</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> Rider Wait Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">0 - 5 mins</span>
                  <span className="text-sm font-bold text-slate-800">85%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div></div>
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-slate-600">5 - 10 mins</span>
                  <span className="text-sm font-bold text-slate-800">12%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '12%' }}></div></div>
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium text-slate-600">&gt; 10 mins</span>
                  <span className="text-sm font-bold text-slate-800">3%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{ width: '3%' }}></div></div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-slate-500" /> Top Operational Issues</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">14</div>
                  <span className="text-sm text-slate-700 font-medium">Paneer Tikka Platter Out of Stock incidents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">6</div>
                  <span className="text-sm text-slate-700 font-medium">Grill Station Overloaded warnings</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">3</div>
                  <span className="text-sm text-slate-700 font-medium">Riders waited &gt;10 mins at Packing</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-6 flex justify-end">
             <Button onClick={onDeployNextShift} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white h-12 px-8 rounded-lg font-bold text-base w-full md:w-auto">
               End Shift & Export Report
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
