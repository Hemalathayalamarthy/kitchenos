import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, AlertTriangle, ChefHat, Package, XCircle } from 'lucide-react';

export const RushSummary = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50/50 p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Post-Rush Summary</h2>
          <p className="text-base font-medium text-slate-500 mt-2">Lunch Rush metrics for today (11:30 AM - 2:00 PM)</p>
        </div>
        <div className="text-right">
          <Badge className="bg-emerald-100 text-emerald-800 font-bold uppercase tracking-widest px-3 py-1 mb-1 shadow-sm">Rush Ended</Badge>
          <div className="text-sm font-semibold text-slate-500">72 Total Orders Processed</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <span className="font-bold text-slate-500 text-sm uppercase tracking-wider">On-Time Dispatch</span>
          </div>
          <div className="text-4xl font-black text-slate-800 mt-3">94%</div>
          <div className="text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1">+2% from yesterday</div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Clock className="w-5 h-5" /></div>
            <span className="font-bold text-slate-500 text-sm uppercase tracking-wider">Avg Accept to Handover</span>
          </div>
          <div className="text-4xl font-black text-slate-800 mt-3">14m</div>
          <div className="text-sm font-semibold text-slate-400 mt-2">Target: 15m</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 text-red-700 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
            <span className="font-bold text-slate-500 text-sm uppercase tracking-wider">Breached Orders</span>
          </div>
          <div className="text-4xl font-black text-slate-800 mt-3">4 <span className="text-lg font-bold text-slate-400">/ 72</span></div>
          <div className="text-sm font-semibold text-red-600 mt-2">All delayed at Grill Station</div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Package className="w-5 h-5" /></div>
             <span className="font-bold text-slate-500 text-sm uppercase tracking-wider">Ready-and-Cold</span>
           </div>
           <div className="text-4xl font-black text-slate-800 mt-3">2</div>
           <div className="text-sm font-semibold text-slate-500 mt-2">Rider delayed at door</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><ChefHat className="w-5 h-5 text-slate-400"/> Busiest Stations</h3>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Grill Station</span>
                <Badge variant="destructive">Overloaded 3x</Badge>
             </div>
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Hot Station 1</span>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">Balanced</Badge>
             </div>
             <div className="p-4 flex items-center justify-between">
                <span className="font-bold text-slate-800">Packing</span>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">Balanced</Badge>
             </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-slate-400"/> Slowest Items (Bottlenecks)</h3>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <div className="font-bold text-slate-800">Loaded Fries (L)</div>
                   <div className="text-xs font-semibold text-slate-500">Burger Hub</div>
                </div>
                <div className="text-right">
                   <div className="font-black text-red-600">18m avg</div>
                   <div className="text-xs font-semibold text-slate-400">Target: 8m</div>
                </div>
             </div>
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <div className="font-bold text-slate-800">Paneer Tikka Platter</div>
                   <div className="text-xs font-semibold text-slate-500">North Indian</div>
                </div>
                <div className="text-right">
                   <div className="font-black text-red-600">22m avg</div>
                   <div className="text-xs font-semibold text-slate-400">Target: 15m</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
