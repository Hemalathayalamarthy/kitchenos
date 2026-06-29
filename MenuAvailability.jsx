import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, Phone, XCircle, MoreHorizontal } from 'lucide-react';

const INITIAL_MENU = [
  { id: 1, name: 'Paneer Tikka Platter', brand: 'Biryani Express', status: 'out_of_stock', affectedOrders: 4, lastUpdated: '5m ago' },
  { id: 2, name: 'Chicken Biryani (L)', brand: 'Biryani Express', status: 'available', affectedOrders: 0, lastUpdated: '1h ago' },
  { id: 3, name: 'Smash Burger', brand: 'Burger Hub', status: 'running_low', affectedOrders: 0, lastUpdated: '12m ago' },
  { id: 4, name: 'Loaded Fries', brand: 'Burger Hub', status: 'available', affectedOrders: 0, lastUpdated: '2h ago' },
  { id: 5, name: 'Quinoa Power Bowl', brand: 'Healthy Bowls', status: 'available', affectedOrders: 0, lastUpdated: '3h ago' },
];

export const MenuAvailability = () => {
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [search, setSearch] = useState('');

  const filteredMenu = menu.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  
  const oosItems = filteredMenu.filter(i => i.status === 'out_of_stock');
  const lowItems = filteredMenu.filter(i => i.status === 'running_low');
  const availableItems = filteredMenu.filter(i => i.status === 'available');

  const [disabledItems, setDisabledItems] = useState({});

  const ItemRow = ({ item }) => {
    const isDisabled = !!disabledItems[item.id];
    
    return (
      <div className={`p-4 border-b border-slate-100 last:border-0 flex items-center justify-between hover:bg-slate-50 transition-colors ${item.status === 'out_of_stock' ? 'bg-red-50/30' : ''}`}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-bold text-slate-800">{item.name}</span>
            {item.status === 'out_of_stock' && <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-wider">Out of Stock</Badge>}
            {item.status === 'running_low' && <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] uppercase font-bold tracking-wider">Running Low</Badge>}
            {item.status === 'available' && <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold tracking-wider">Available</Badge>}
            {isDisabled && <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-wider ml-2">Platform Disabled</Badge>}
          </div>
          <div className="text-xs font-medium text-slate-500 flex items-center gap-3">
            <span>{item.brand}</span>
            <span>•</span>
            <span>Updated {item.lastUpdated}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {item.affectedOrders > 0 && (
            <div className="text-right">
              <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-0.5">Impact</div>
              <div className="text-sm font-bold text-slate-800">{item.affectedOrders} Live Orders</div>
            </div>
          )}
          
          {item.status === 'out_of_stock' ? (
            <div className="flex gap-2">
              <Button 
                onClick={() => setDisabledItems(prev => ({...prev, [item.id]: !prev[item.id]}))}
                variant={isDisabled ? "ghost" : "outline"} 
                className={`h-9 font-semibold text-xs ${isDisabled ? 'bg-slate-100 text-slate-500 border-transparent' : 'border-slate-300'}`}
              >
                {isDisabled ? "Re-enable Listing" : <><XCircle className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Disable on Apps</>}
              </Button>
              <Button size="sm" className="h-9 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs"><Phone className="w-3.5 h-3.5 mr-1.5" /> Call Customers</Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50/50 p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Menu Availability</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage live menu status across all delivery platforms.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>
      
      {oosItems.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 px-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-slate-800 text-sm">Requires Attention</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
            {oosItems.map(item => <ItemRow key={item.id} item={item} />)}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm">All Items</h3>
          <div className="flex gap-4 text-xs font-semibold text-slate-500">
             <span>{availableItems.length} Available</span>
             <span>{lowItems.length} Running Low</span>
          </div>
        </div>
        <div>
          {lowItems.map(item => <ItemRow key={item.id} item={item} />)}
          {availableItems.map(item => <ItemRow key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};
