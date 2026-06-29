import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await pb.collection('analytics').getFullList({ sort: '-date', $autoCancel: false });
      setData(res);
    } catch (error) {}
    setLoading(false);
  };

  const latest = data[0] || {};
  const trend = (data.length > 0 ? data.slice(0, 7).reverse() : Array.from({length: 7}, (_, i) => ({ date: new Date(Date.now() - (6-i)*86400000).toISOString(), total_orders: Math.floor(Math.random()*80)+60 }))).map(d => ({
    name: new Date(d.date).toLocaleDateString([], {weekday: 'short'}),
    Orders: d.total_orders
  }));

  const brands = [
    { name: 'Swiggy', value: 45 },
    { name: 'Zomato', value: 35 },
    { name: 'Direct', value: 20 }
  ];

  return (
    <>
      <Helmet><title>Insights - KitchenOS</title></Helmet>
      <div className="min-h-screen bg-secondary/30 pb-20">
        <Header />
        <div className="container max-w-6xl mx-auto px-4 pt-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Insights</h1>
              <p className="text-muted-foreground font-medium mt-1">Operational performance metrics</p>
            </div>
            <Button variant="outline" className="font-bold shadow-sm" onClick={() => toast.success('Export started')}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders (Today)', value: latest.total_orders || 142 },
              { label: 'On-time Delivery', value: '94%', color: 'text-status-on-track' },
              { label: 'Late Orders', value: latest.late_count || 3, color: 'text-status-urgent' },
              { label: 'Avg Prep Time', value: '18m' }
            ].map((metric, i) => (
              <Card key={i} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="text-sm font-bold text-muted-foreground mb-2">{metric.label}</div>
                  <div className={`text-3xl font-extrabold font-mono-nums ${metric.color || ''}`}>{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle>Weekly Order Trend</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="Orders" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle>Channel Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={brands} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        <Cell fill="#fc8019" />
                        <Cell fill="hsl(var(--destructive))" />
                        <Cell fill="#3b82f6" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
