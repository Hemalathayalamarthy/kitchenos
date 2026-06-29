import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const MenuAvailabilityPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadMenuItems(); }, []);

  const loadMenuItems = async () => {
    try {
      const items = await pb.collection('menu_items').getFullList({ sort: 'brand,name', $autoCancel: false });
      setMenuItems(items);
    } catch (error) { toast.error('Failed to load menu items'); }
    setLoading(false);
  };

  const toggleAvailability = async (id, current) => {
    try {
      await pb.collection('menu_items').update(id, { available: !current }, { $autoCancel: false });
      toast.success(current ? 'Item marked Out of Stock' : 'Item marked Available');
      loadMenuItems();
    } catch (error) { toast.error('Failed to update status'); }
  };

  const filteredItems = menuItems.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Menu & Stock - KitchenOS</title></Helmet>
      <div className="min-h-screen bg-secondary/30 pb-20">
        <Header />
        <div className="container max-w-5xl mx-auto px-4 pt-6">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Menu & Stock</h1>
              <p className="text-muted-foreground font-medium mt-1">Manage item availability across all brands</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background border-border/50" />
            </div>
          </div>
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-5 md:col-span-6">Item Name</div>
              <div className="col-span-3 md:col-span-2 text-right">Price</div>
              <div className="col-span-4 md:col-span-4 text-right pr-2">Availability</div>
            </div>
            <CardContent className="p-0 divide-y divide-border/50">
              {filteredItems.map(item => (
                <div key={item.id} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${!item.available ? 'bg-destructive/5' : 'hover:bg-muted/20'}`}>
                  <div className="col-span-5 md:col-span-6">
                    <div className={`font-bold ${!item.available ? 'text-destructive line-through' : ''}`}>{item.name}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] py-0">{item.brand}</Badge>
                      {item.running_low && item.available && <Badge className="bg-status-normal text-white text-[10px] py-0">Low Stock</Badge>}
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right font-mono-nums font-semibold">${item.price?.toFixed(2)}</div>
                  <div className="col-span-4 md:col-span-4 flex justify-end items-center gap-3">
                    <span className={`text-xs font-bold ${item.available ? 'text-status-on-track' : 'text-destructive'}`}>{item.available ? 'In Stock' : 'Out'}</span>
                    <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id, item.available)} className={item.available ? 'data-[state=checked]:bg-status-on-track' : ''} />
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && !loading && (
                <div className="p-12 text-center text-muted-foreground font-medium">No items found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MenuAvailabilityPage;
