import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ChefHat, Clock } from 'lucide-react';

export const MyOrders = ({ orders = [] }) => {
  const activeOrders = orders.filter(o => o.lifecycle !== 'Incoming');

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
            {activeOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">#{order.id}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${order.source === 'Zomato' ? 'bg-red-50 text-red-600 border-red-200' : order.source === 'Swiggy' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                    {order.source}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">{order.customer_name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="text-xs font-medium text-slate-700">
                        <span className="font-bold text-slate-500 mr-1">{item.quantity}x</span>{item.name}
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
            {activeOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-500 font-medium">No active orders yet. Accept incoming orders to see them here.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
