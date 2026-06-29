import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export const WeeklyAnalytics = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8f9fa] p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Weekly Analytics & Settlement</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Review weekly order volume and revenue across all platforms.</p>
        </div>
        <Badge variant="outline" className="bg-white px-3 py-1 text-sm font-bold border-slate-200">Current Week (Mon - Sun)</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">₹84,250</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% from last week</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">342</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +5% from last week</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">₹246</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +2% from last week</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Cancellation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">1.2%</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><TrendingDown className="w-3 h-3"/> -0.4% from last week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Platform Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#cb202d]"></div>
                    <span className="font-bold text-slate-700">Zomato</span>
                  </div>
                  <span className="font-bold text-slate-800">₹42,100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-[#cb202d] h-2 rounded-full" style={{width: '50%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fc8019]"></div>
                    <span className="font-bold text-slate-700">Swiggy</span>
                  </div>
                  <span className="font-bold text-slate-800">₹25,260</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-[#fc8019] h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                    <span className="font-bold text-slate-700">Direct App</span>
                  </div>
                  <span className="font-bold text-slate-800">₹16,890</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-800 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Brand Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                 <div>
                   <div className="font-bold text-slate-800">Biryani Express</div>
                   <div className="text-xs font-medium text-slate-500">180 orders</div>
                 </div>
                 <div className="font-bold text-emerald-600">₹54,000</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                 <div>
                   <div className="font-bold text-slate-800">Burger Hub</div>
                   <div className="text-xs font-medium text-slate-500">95 orders</div>
                 </div>
                 <div className="font-bold text-emerald-600">₹18,500</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                 <div>
                   <div className="font-bold text-slate-800">Healthy Bowls</div>
                   <div className="text-xs font-medium text-slate-500">67 orders</div>
                 </div>
                 <div className="font-bold text-emerald-600">₹11,750</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
