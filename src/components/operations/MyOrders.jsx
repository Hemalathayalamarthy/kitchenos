import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ChefHat, Clock, Phone } from 'lucide-react';

export const MyOrders = ({ orders = [] }) => {
  const [sourceFilter, setSourceFilter] = useState('All');
  
  const activeOrders = orders.filter(o => o.lifecycle !== 'Incoming');
  
  const swiggyCount = activeOrders.filter(o => o.source === 'Swiggy').length;
  const zomatoCount = activeOrders.filter(o => o.source === 'Zomato').length;
  const directCount = activeOrders.filter(o => o.source === 'Direct').length;
  
  const displayedOrders = activeOrders.filter(o => sourceFilter === 'All' || o.source === sourceFilter);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8f9fa] p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Orders List</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">A complete list of all accepted orders currently in processing.</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-lg flex items-center gap-2">
           <ClipboardList className="w-4 h-4 text-slate-400" />
           <span className="text-sm font-bold text-slate-700">{activeOrders.length} Accepted Orders</span>
        </div>
      </div>
      
      {/* Classification Filters */}
      <div className="flex gap-3 mb-6">
        {[
          { id: 'All', label: 'All', count: activeOrders.length },
          { id: 'Swiggy', label: 'Swiggy', count: swiggyCount },
          { id: 'Zomato', label: 'Zomato', count: zomatoCount },
          { id: 'Direct', label: 'Direct', count: directCount }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSourceFilter(filter.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${
              sourceFilter === filter.id 
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 min-w-[200px]">Items</th>
              <th className="px-6 py-4">Station</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Rider OTP</th>
              <th className="px-6 py-4">Wait Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">#{order.id}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-max ${order.source === 'Zomato' ? 'bg-red-50 text-red-600 border-red-200' : order.source === 'Swiggy' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                    {order.source === 'Direct' && <Phone className="w-3 h-3" />}
                    {order.source}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">{order.customer_name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className={`text-xs font-medium flex items-center ${item.isCanceled ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        <span className={`font-bold mr-1 ${item.isCanceled ? 'text-slate-400' : 'text-slate-500'}`}>{item.quantity}x</span>
                        {item.name}
                        {item.isCanceled && <span className="ml-1.5 text-[8px] font-bold text-red-500 uppercase tracking-wider not-italic no-underline border border-red-200 bg-red-50 px-1 py-0.5 rounded">Canceled</span>}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex w-max items-center gap-1.5 text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded text-xs">
                    <ChefHat className="w-3.5 h-3.5" /> 
                    {order.station || 
                      (order.items?.some(i => i.name.includes('Burger') || i.name.includes('Fries')) ? 'Fry & Grill Station' : 
                       order.items?.some(i => i.name.includes('Bowl')) ? 'Assembly Station' : 
                       'Main Hot Station')
                    }
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.lifecycle === 'Incoming' ? 'bg-amber-100 text-amber-800' :
                    order.lifecycle === 'Cooking' ? 'bg-blue-100 text-blue-800' :
                    order.lifecycle === 'Ready' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {order.lifecycle}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {(order.lifecycle === 'Ready' || order.lifecycle === 'Packed') ? (
                    <span className="font-mono font-bold text-slate-700 tracking-widest bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {order.id.replace(/\D/g, '').slice(-4).padEnd(4, '0')}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Awaiting Prep</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-slate-500 font-medium"><Clock className="w-3.5 h-3.5" /> {order.time}</span>
                </td>
              </tr>
            ))}
            {displayedOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-500 font-medium">
                  {activeOrders.length === 0 ? 'No active orders yet. Accept incoming orders to see them here.' : `No active ${sourceFilter} orders.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
