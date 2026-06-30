import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Minus, Plus, AlertCircle, Clock, MapPin, ChefHat, Package, CheckCircle2, Lightbulb, Phone, ArrowRight, LayoutDashboard, ListOrdered, Layers, ClipboardList, AlertTriangle, BarChart3, PackageSearch, CookingPot, Flame } from 'lucide-react';

import { KitchenStatusWidget } from '@/components/operations/KitchenStatusWidget';
import { RecommendedActionsPanel } from '@/components/operations/RecommendedActionsPanel';
import { ExceptionsPanel } from '@/components/operations/ExceptionsPanel';
import { RiderWaitingWidget } from '@/components/operations/RiderWaitingWidget';
import { OperationalSummaryModal } from '@/components/operations/OperationalSummaryModal';
import { BatchManager } from '@/components/operations/BatchManager';
import { StationBalancer } from '@/components/operations/StationBalancer';
import { WeeklyAnalytics } from '@/components/operations/WeeklyAnalytics';
import { MenuAvailability } from '@/components/operations/MenuAvailability';
import { RushSummary } from '@/components/operations/RushSummary';
import { MyOrders } from '@/components/operations/MyOrders';

// MOCK DATA
const INITIAL_ORDERS = [
  { id: 'SWG-1000', source: 'Swiggy', time: '12m ago', customer_name: 'sanjay', items: [{ id: 1, quantity: 4, name: 'Chicken Biryani (L)', price: 1700, isOOS: false }], notes: '', timeLeft: 800, maxTime: 900, lifecycle: 'Cooking', batchMatch: 'B15' },
  { id: 'DIR-4401', source: 'Direct', time: '1m ago', customer_name: 'hari',   items: [{ id: 5, quantity: 2, name: 'Smash Burger', price: 560, isOOS: false }, { id: 4, quantity: 1, name: 'Loaded Fries', price: 180, isOOS: false }], notes: '', timeLeft: 387, maxTime: 420, lifecycle: 'Incoming', batchMatch: 'G02' },
  { id: 'ZOM-1182', source: 'Zomato', time: '1m ago', customer_name: 'harika', items: [{ id: 5, quantity: 3, name: 'Smash Burger', price: 840, isOOS: false }], notes: '', timeLeft: 267, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'G02' },
  { id: 'SWG-9026', source: 'Swiggy', time: '1m ago', customer_name: 'rahul',  items: [{ id: 5, quantity: 1, name: 'Smash Burger', price: 280, isOOS: false }], notes: '', timeLeft: 255, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'G02' },
  { id: 'ZOM-1183', source: 'Zomato', time: '2m ago', customer_name: 'niharika', items: [{ id: 5, quantity: 2, name: 'Smash Burger', price: 560, isOOS: false }, { id: 4, quantity: 1, name: 'Loaded Fries', price: 180, isOOS: false }], notes: '', timeLeft: 227, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'G02' },
  { id: 'SWG-9022', source: 'Swiggy', time: '2m ago', customer_name: 'amit', items: [{ id: 8, quantity: 1, name: 'Quinoa Power Bowl', price: 280, isOOS: false }], notes: '', timeLeft: 240, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'H01' },
  { id: 'DIR-4402', source: 'Direct', time: '2m ago', customer_name: 'priya', items: [{ id: 8, quantity: 2, name: 'Quinoa Power Bowl', price: 560, isOOS: false }], notes: '', timeLeft: 240, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'H01' },
  { id: 'ZOM-8811', source: 'Zomato', time: '20m ago', customer_name: 'suresh', items: [{ id: 1, quantity: 1, name: 'Chicken Biryani (L)', price: 425, isOOS: false }], notes: '', timeLeft: 300, maxTime: 300, lifecycle: 'Packed', batchMatch: null },
  { id: 'DIR-5501', source: 'Direct', time: '22m ago', customer_name: 'anita', items: [{ id: 5, quantity: 2, name: 'Smash Burger', price: 560, isOOS: false }], notes: '', timeLeft: 300, maxTime: 300, lifecycle: 'Ready', batchMatch: null },
  { id: 'SWG-8860', source: 'Swiggy', time: '25m ago', customer_name: 'vikram', items: [{ id: 8, quantity: 1, name: 'Quinoa Power Bowl', price: 280, isOOS: false }], notes: '', timeLeft: 120, maxTime: 120, lifecycle: 'Packed', batchMatch: null }
];

const INITIAL_RECOMMENDED_ACTIONS = [
  { title: 'Call Rider for Order #SWG-8860', subtitle: 'Food is packed and cooling', type: 'call' }
];

const INITIAL_EXCEPTIONS = [
  { title: 'Cancelled Mid-Cook', status: 'Customer Cancelled', impact: 'Order #DIR-4401', action: 'Stop Cooking - Save Items', type: 'urgent' },
  { title: 'Paneer Tikka Platter', status: 'Out of Stock', impact: 'Global Inventory', action: 'Disable Platform Listing', type: 'ingredient' }
];

const INITIAL_RIDERS = [
  { name: 'Raju G.', orderId: 'SWG-8860', waitTimeMins: 12 },
  { name: 'Mohammed K.', orderId: 'ZOM-8811', waitTimeMins: 4 }
];

const OperationsCommandCenter = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState('Incoming');
  const [activeView, setActiveView] = useState('command-center');
  const [selectedReplacement, setSelectedReplacement] = useState({});
  const [oosState, setOosState] = useState({}); // 0: Initial, 1: Call Customer, 2: Select Replacement
  
  const initialPrep = { 'DIR-4401': 55, 'ZOM-1182': 45, 'SWG-9026': 45, 'ZOM-1183': 40, 'SWG-9022': 18, 'DIR-4402': 25 };
  const [prepTimes, setPrepTimes] = useState(initialPrep);
  const [basePrepTimes, setBasePrepTimes] = useState(initialPrep);
  
  const [notification, setNotification] = useState(null);
  const [batchSelections, setBatchSelections] = useState({});
  const [wave2Triggered, setWave2Triggered] = useState(false);
  const [wave3Triggered, setWave3Triggered] = useState(false);
  
  const [exceptions, setExceptions] = useState(INITIAL_EXCEPTIONS);
  const [riders, setRiders] = useState(INITIAL_RIDERS);

  // Timer Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.timeLeft != null && order.timeLeft > 0) {
            let nextState = order.lifecycle;
            if (order.lifecycle === 'Cooking' && order.timeLeft <= 5 * 60) {
               nextState = 'Ready';
            }
            return { ...order, lifecycle: nextState, timeLeft: order.timeLeft - 1 };
          } else if (order.timeLeft != null && order.timeLeft <= 0 && (order.lifecycle === 'Cooking' || order.lifecycle === 'Ready')) {
            return { ...order, lifecycle: 'Packed', timeLeft: 0 };
          }
          return order;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-trigger Wave 2
  useEffect(() => {
    // If all initial orders have been processed from the Incoming queue
    if (!wave2Triggered && orders.length > 0) {
      const incomingOrders = orders.filter(o => o.lifecycle === 'Incoming');
      if (incomingOrders.length === 0) {
        setWave2Triggered(true);
        // Trigger Wave 2 after a short delay for dramatic effect
        setTimeout(() => {
          setOrders(prev => [
            ...prev,
            { id: 'DIR-4403', source: 'Direct', time: 'Just now', customer_name: 'vikram', phone: '+91 98765 43210', items: [{ id: 9, quantity: 1, name: 'Tandoori Chicken (Starter)', price: 220, isOOS: true }, { id: 10, quantity: 2, name: 'Mutton Biryani', price: 450, isOOS: false }], notes: '', timeLeft: 300, maxTime: 300, lifecycle: 'Incoming', batchMatch: null },
            { id: 'SWG-9026', source: 'Swiggy', time: 'Just now', customer_name: 'arjun', items: [{ id: 11, quantity: 1, name: 'Truffle Mushroom Burger', price: 320, isOOS: false }], notes: '', timeLeft: 270, maxTime: 300, lifecycle: 'Incoming', batchMatch: null }
          ]);
          setExceptions(prev => [
            ...prev,
            { title: 'Tandoori Chicken (Starter)', status: 'Out of Stock', impact: 'Order #DIR-4403', action: 'Disable Platform Listing', type: 'ingredient' }
          ]);
          setRecommendedActions(prev => [
            ...prev,
            { title: 'Verify Tandoori Chicken availability', subtitle: 'Order #DIR-4403 contains OOS item', type: 'urgent' }
          ]);
          const newPrep = { 'DIR-4403': 45, 'SWG-9026': 15 };
          setPrepTimes(prev => ({...prev, ...newPrep}));
          setBasePrepTimes(prev => ({...prev, ...newPrep}));
          showNotification('Inventory Warning - Order #DIR-4403', 'Tandoori Chicken Starter is Out of Stock! (45m Prep Time)', 'error');
        }, 1500);
      }
    }
  }, [orders, wave2Triggered]);

  // Auto-trigger Wave 3 (The Rush Wave with 6 orders)
  useEffect(() => {
    if (wave2Triggered && !wave3Triggered) {
      const incomingOrders = orders.filter(o => o.lifecycle === 'Incoming');
      if (incomingOrders.length === 0) {
        setWave3Triggered(true);
        
        // Fast forward the B15 batch timer to simulate it being half-over
        setOrders(prev => prev.map(o => {
           if (o.lifecycle === 'Cooking' && o.batchMatch === 'B15') {
              return { ...o, timeLeft: o.maxTime / 2 - 10 };
           }
           return o;
        }));

        setTimeout(() => {
          setOrders(prev => [
            ...prev,
            { id: 'ORD-5001', source: 'Zomato', time: 'Just now', customer_name: 'rahul', items: [{ id: 1, quantity: 1, name: 'Chicken Biryani (L)', price: 425, isOOS: false }], notes: '', timeLeft: 300, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'B15' }, // Too late
            { id: 'ORD-5002', source: 'Swiggy', time: 'Just now', customer_name: 'neha', items: [{ id: 1, quantity: 2, name: 'Chicken Biryani (L)', price: 850, isOOS: false }], notes: '', timeLeft: 270, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'B15' }, // Too late
            { id: 'ORD-5003', source: 'Direct', time: 'Just now', customer_name: 'ajay', items: [{ id: 8, quantity: 1, name: 'Quinoa Power Bowl', price: 280, isOOS: false }], notes: '', timeLeft: 240, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'H01' }, // Can add
            { id: 'ORD-5004', source: 'Zomato', time: 'Just now', customer_name: 'priya', items: [{ id: 8, quantity: 2, name: 'Quinoa Power Bowl', price: 560, isOOS: false }], notes: '', timeLeft: 210, maxTime: 300, lifecycle: 'Incoming', batchMatch: 'H01' }, // Can add
            { id: 'ORD-5005', source: 'Swiggy', time: 'Just now', customer_name: 'kabir', items: [{ id: 12, quantity: 1, name: 'Loaded Fries', price: 180, isOOS: false }], notes: '', timeLeft: 180, maxTime: 300, lifecycle: 'Incoming', batchMatch: null }, // Normal
            { id: 'ORD-5006', source: 'Zomato', time: 'Just now', customer_name: 'suresh', items: [{ id: 5, quantity: 1, name: 'Smash Burger', price: 280, isOOS: false }], notes: '', timeLeft: 150, maxTime: 300, lifecycle: 'Incoming', batchMatch: null }  // Normal
          ]);
          const newPrep = { 'ORD-5001': 25, 'ORD-5002': 45, 'ORD-5003': 10, 'ORD-5004': 10, 'ORD-5005': 15, 'ORD-5006': 15 };
          setPrepTimes(prev => ({...prev, ...newPrep}));
          setBasePrepTimes(prev => ({...prev, ...newPrep}));
          showNotification('Peak Rush', 'Six new orders just arrived!', 'error');
        }, 1500);
      }
    }
  }, [orders, wave2Triggered, wave3Triggered]);

  const showNotification = (title, message, type = 'success') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const advanceLifecycle = (orderId, targetState, customPrepTime = null) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updates = { lifecycle: targetState };
        if (targetState === 'Cooking' || targetState === 'Batch Suggestion') {
           const timeInMins = customPrepTime !== null ? customPrepTime : (prepTimes[o.id] || 15);
           const prepTimeSecs = timeInMins * 60;
           updates.timeLeft = prepTimeSecs;
           updates.maxTime = prepTimeSecs;
        }
        // No timer reset for Ready or Packed, they stay within the order time
        return { ...o, ...updates };
      }
      return o;
    }));
    showNotification('Order Updated', `Order #${orderId} moved to ${targetState}`, 'success');
  };

  const getStationForOrder = (order) => {
    if (order.items.some(i => i.name.toLowerCase().includes('burger') || i.name.toLowerCase().includes('fries'))) return 'Fry & Grill Station';
    if (order.items.some(i => i.name.toLowerCase().includes('bowl'))) return 'Assembly Station';
    return 'Main Hot Station';
  };

  const assignStation = (orderId, station) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, lifecycle: 'Assigned', station } : o));
    showNotification('Station Assigned', `Order #${orderId} assigned to ${station}`, 'info');
  };

  const mergeOrderToCooking = (order) => {
    const recommendedStation = getStationForOrder(order);
    const targetBatch = batchSelections[order.id] || order.batchMatch;
    const activeCookingMatch = orders.find(o => o.lifecycle === 'Cooking' && o.batchMatch === targetBatch);
    
    const newTimeLeft = activeCookingMatch ? activeCookingMatch.timeLeft : (prepTimes[order.id] || 15) * 60;
    const newMaxTime = activeCookingMatch ? activeCookingMatch.maxTime : (prepTimes[order.id] || 15) * 60;

    
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, lifecycle: 'Cooking', station: recommendedStation, timeLeft: newTimeLeft, maxTime: newMaxTime, batchMatch: targetBatch } : o));
    showNotification('Order Accepted', `Accepted and added to batch ${targetBatch}`, 'success');
  };

  const acceptOrder = (order) => {
    // If it has an OOS item, attempting to accept it normally triggers the OOS expansion
    const hasOOS = order.items.some(i => i.isOOS);
    if (hasOOS) {
      setOosState(prev => ({...prev, [order.id]: 2}));
      return;
    }
    
    // Check if it's too late to merge to an active batch
    const activeCookingMatch = order.batchMatch ? orders.find(o => o.lifecycle === 'Cooking' && o.batchMatch === order.batchMatch) : null;
    const isTooLateToMerge = activeCookingMatch && activeCookingMatch.timeLeft < activeCookingMatch.maxTime / 2;

    // If it's too late to merge with the currently running batch, form a NEW batch opportunity (e.g. B15_2)
    const finalBatchMatch = isTooLateToMerge ? `${order.batchMatch}_2` : order.batchMatch;
    let nextState = finalBatchMatch ? 'Batch Suggestion' : 'Cooking';
    
    const recommendedStation = getStationForOrder(order);
    const prepTimeSecs = (prepTimes[order.id] || 15) * 60;
    
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, lifecycle: nextState, station: recommendedStation, timeLeft: prepTimeSecs, maxTime: prepTimeSecs, batchMatch: finalBatchMatch } : o));
    showNotification('Order Accepted', `Order #${order.id} accepted.`, 'success');
  };

  const rejectOrder = (order) => {
    setOrders(prev => prev.filter(o => o.id !== order.id));
    showNotification('Error', `Order #${order.id} rejected`, 'error');
    setExceptions(prev => prev.filter(e => !e.impact.includes(order.id)));
    setRecommendedActions(prev => prev.filter(a => !a.title.includes(order.id)));
  };

  const handoverOrder = (order) => {
    setOrders(prev => prev.filter(o => o.id !== order.id));
    setRiders(prev => prev.filter(r => r.orderId !== order.id));
    setRecommendedActions(prev => prev.filter(a => !a.title.includes(order.id)));
    showNotification('Dispatched', `Order #${order.id} handed over to rider successfully`, 'success');
  };

  const replaceItem = (orderId, oldItemName, newItemName, newBatchMatch) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        batchMatch: newBatchMatch || o.batchMatch,
        items: newItemName === 'No Substitute' 
                 ? o.items.map(i => i.name === oldItemName ? { ...i, isCanceled: true, isOOS: false } : i)
                 : o.items.map(i => i.name === oldItemName ? { ...i, name: newItemName, isOOS: false } : i)
      };
    }));
    showNotification('Item Resolved', newItemName === 'No Substitute' ? `Canceled ${oldItemName} from order` : `Replaced ${oldItemName} with ${newItemName}`, 'info');
  };

  const handleExceptionAction = (exception) => {
    if (exception.action === 'Stop Cooking - Save Items') {
      showNotification('Success', `Stopped cooking for ${exception.impact} and recovered 2 items.`, 'success');
      setExceptions(prev => prev.filter(e => e.title !== exception.title));
    } else if (exception.action === 'Disable Platform Listing') {
      showNotification('Success', `Paneer Tikka temporarily disabled on Zomato & Swiggy.`, 'success');
      setExceptions(prev => prev.filter(e => e.title !== exception.title));
    } else {
      showNotification('Info', `Action triggered for ${exception.title}`, 'info');
    }
  };

  const adjustPrepTime = (id, amount) => {
    setPrepTimes(prev => {
      const base = basePrepTimes[id] || 15;
      const current = prev[id] || base;
      const next = current + amount;
      
      // Limit to +5 minutes from original, and don't go below 5 minutes or base-5
      if (next > base + 5) {
        showNotification('Limit Reached', 'Cannot increase prep time by more than 5 minutes', 'error');
        return prev;
      }
      if (next < Math.max(5, base - 5)) return prev;
      
      return { ...prev, [id]: next };
    });
  };

  const getSourceStyle = (source) => {
    switch(source) {
      case 'Zomato': return { bg: 'bg-[#cb202d]', text: 'text-white' };
      case 'Swiggy': return { bg: 'bg-[#fc8019]', text: 'text-white' };
      case 'Direct': return { bg: 'bg-black', text: 'text-white' };
      default: return { bg: 'bg-blue-500', text: 'text-white' };
    }
  };

  const formatTime = (seconds) => {
    if (seconds == null) return '';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getTimerColor = (timeLeft, maxTime) => {
    const ratio = timeLeft / maxTime;
    if (ratio > 0.5) return 'text-emerald-600';
    if (ratio > 0.2) return 'text-amber-500';
    return 'text-red-600 animate-pulse font-bold';
  };

  const activeBatchOrders = orders.filter(o => o.lifecycle === 'Batch Suggestion');
  const batchOpportunities = Array.from(new Set(activeBatchOrders.map(o => o.batchMatch).filter(Boolean)))
    .map(matchId => {
      let meta = { name: 'Batch', station: 'Prep', timeSaved: 5 };
      if (matchId.startsWith('B15')) meta = { name: 'Chicken Biryani', station: 'Main Hot Station', timeSaved: 14 };
      if (matchId.startsWith('G02')) meta = { name: 'Smash Burger', station: 'Fry & Grill Station', timeSaved: 11 };
      if (matchId.startsWith('H01')) meta = { name: 'Quinoa Power Bowl', station: 'Assembly Station', timeSaved: 6 };
      if (matchId.startsWith('K22')) meta = { name: 'Kaju Butter Masala', station: 'Main Hot Station', timeSaved: 12 };
      
      return {
        id: matchId,
        name: meta.name,
        station: meta.station,
        timeSaved: meta.timeSaved,
        orders: activeBatchOrders.filter(o => o.batchMatch === matchId)
      };
    })
    .filter(b => b.orders.length > 1);

  const filteredOrders = orders
    .filter(o => o.lifecycle === filter)
    .sort((a, b) => a.timeLeft - b.timeLeft);

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans overflow-hidden">
      {/* Spacer for Absolute Sidebar - Reserves the FULL expanded width so main content never shifts */}
      <div className="w-64 hidden md:block shrink-0 bg-transparent"></div>
      
      {/* SIDEBAR (Hover to expand) */}
      <div className="w-[80px] hover:w-64 transition-all duration-300 ease-in-out bg-white border-r border-slate-200 hidden md:flex flex-col z-50 absolute left-0 top-0 h-full group shadow-none hover:shadow-2xl">
        <div className="p-6 h-16 border-b border-slate-100 flex items-center overflow-hidden shrink-0">
          <div className="flex items-center gap-3 w-full">
            <LayoutDashboard className="w-8 h-8 text-indigo-600 shrink-0" />
            <h1 className="font-bold text-xl text-slate-800 tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Kitchen<span className="text-blue-600">OS</span></h1>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1 mt-4 overflow-x-hidden">
          <div className="px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Cloud Kitchen Platform</div>
          <button onClick={() => setActiveView('command-center')} className={`w-full flex items-center px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeView === 'command-center' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <ListOrdered className="w-5 h-5 shrink-0" />
            <div className="flex items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden ml-3">
              <span className="whitespace-nowrap">Live Orders</span>
            </div>
          </button>
          <button onClick={() => setActiveView('my-orders')} className={`w-full flex items-center px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeView === 'my-orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <ClipboardList className="w-5 h-5 shrink-0" />
            <div className="flex items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden ml-3">
              <span className="whitespace-nowrap">My Orders</span>
            </div>
          </button>
          <button onClick={() => setActiveView('station-balancer')} className={`w-full flex items-center px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeView === 'station-balancer' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <ChefHat className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">Station</span>
          </button>
          <button onClick={() => setActiveView('batch-manager')} className={`w-full flex items-center px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeView === 'batch-manager' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Layers className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">Batch Manager</span>
          </button>
          <button onClick={() => setActiveView('menu-availability')} className={`w-full flex items-center px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeView === 'menu-availability' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <PackageSearch className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">Inventory</span>
          </button>
          <button onClick={() => setActiveView('weekly-analytics')} className={`w-full flex items-center px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors ${activeView === 'weekly-analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <BarChart3 className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">Analytics</span>
          </button>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center overflow-hidden shrink-0">
          <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm mr-3">R</div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <div className="text-sm font-bold text-slate-800 leading-tight">Ravi</div>
            <div className="text-xs text-slate-500 font-medium">Order Manager</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* GLOBAL STATUS BAR */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
              <span className="font-semibold text-slate-800 text-sm">Kitchen Active</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 font-bold tracking-widest text-[10px] uppercase">Lunch Rush</Badge>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-bold text-slate-600 font-mono tracking-wide">12:45 PM</div>
            <div className="relative">
              <AlertCircle className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer">OM</div>
          </div>
        </div>
        
        {/* Custom Notification Overlay */}
        {notification && (
          <div className={`absolute top-6 right-6 z-[100] border px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'error' ? 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]' :
            notification.type === 'info' ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]' :
            'bg-[#eefaf4] border-[#d1f2e1] text-[#0f8b72]'
          }`}>
            <div className={`p-0.5 rounded-full ${
              notification.type === 'error' ? 'bg-[#ef4444]' :
              notification.type === 'info' ? 'bg-[#22c55e]' :
              'bg-[#10b981]'
            }`}>
              <Check className="h-4 w-4 text-white stroke-[3]" />
            </div>
            <div className="font-semibold text-[15px]">
              {notification.message}
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          
          {activeView === 'rush-summary' && <RushSummary />}
          {activeView === 'menu-availability' && <MenuAvailability />}
          {activeView === 'batch-manager' && <BatchManager orders={orders} />}
          {activeView === 'station-balancer' && <StationBalancer orders={orders} />}
          {activeView === 'weekly-analytics' && <WeeklyAnalytics />}
          {activeView === 'my-orders' && <MyOrders orders={orders} />}
          {activeView === 'command-center' && (
            <div className="flex-1 flex flex-col min-w-0 overflow-auto">
            <div className="sticky top-0 z-30 bg-[#f8f9fa] pt-6 px-6 pb-4">
              <Tabs value={filter} onValueChange={setFilter} className="w-full max-w-full overflow-hidden">
                <TabsList className="flex flex-nowrap overflow-x-auto bg-white border border-slate-200 p-1 gap-1 h-auto rounded-xl shadow-sm relative scrollbar-hide w-full justify-start">
                  {['Incoming', 'Batch Suggestion', 'Cooking', 'Ready', 'Packed'].map(tab => {
                    const hasBatchOrders = orders.some(o => o.lifecycle === 'Batch Suggestion');
                    return (
                      <TabsTrigger 
                        key={tab} 
                        value={tab} 
                        className="relative rounded-lg px-6 py-2.5 font-bold text-sm text-slate-600 hover:text-slate-900 data-[state=active]:bg-[#0f172a] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                      >
                        <div className="flex items-center">
                          {tab} <span className="ml-1.5 text-xs font-semibold opacity-70">({tab === 'Batch Suggestion' ? batchOpportunities.length : orders.filter(o => o.lifecycle === tab).length})</span>
                          {tab === 'Incoming' && orders.filter(o => o.lifecycle === 'Incoming').length > 0 && (
                            <span className="ml-2 relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                          )}
                          {tab === 'Batch Suggestion' && batchOpportunities.length > 0 && (
                            <span className="ml-2 relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                          )}
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
            
            <div className="p-6 pt-2 h-full overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start content-start pb-20">
                {filteredOrders.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-slate-500 font-medium">No orders in {filter} status.</p>
                  </div>
                ) : (
                  <>
                  {filter === 'Batch Suggestion' && batchOpportunities.map(batch => {
                    const totalPcs = batch.orders.reduce((sum, o) => sum + (o.items.find(i => i.name.includes(batch.name.split(' ').pop()))?.quantity || 0), 0);
                      
                      return (
                        <div key={batch.id} className="bg-[#fffdf0] border border-[#fde68a] rounded-xl shadow-sm overflow-hidden flex flex-col relative transition-all duration-300 hover:shadow-md h-fit">
                          <div className="p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1 mb-3">
                                <Lightbulb className="w-4 h-4 text-amber-600" fill="currentColor" />
                                <span className="text-xs font-bold text-amber-600 tracking-wider">BATCH OPPORTUNITY DETECTED</span>
                              </div>
                              <div className="flex justify-between items-start mb-1">
                                <div className="text-xl font-medium text-slate-800">
                                  {batch.orders.length} orders with <span className="font-bold text-amber-700">{batch.name}</span>
                                </div>
                                <div className="bg-[#fef3c7] text-amber-800 font-bold px-2 py-0.5 rounded text-sm">{totalPcs} pcs</div>
                              </div>
                              <div className="text-sm text-slate-500 mb-4">
                                {batch.station} • {batch.orders.length} portions total • ~{batch.timeSaved} min saved by batching
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-6">
                                {batch.orders.map(o => (
                                  <div key={o.id} className="flex items-center bg-white border border-slate-200 rounded px-2 py-1 shadow-sm gap-1.5">
                                    <span className={`text-white text-[9px] font-bold px-1 py-0.5 uppercase ${getSourceStyle(o.source).bg}`}>{o.source}</span>
                                    <span className="text-xs font-bold text-slate-700">#{o.id} <span className="text-slate-400 font-medium">x{o.items.find(i => i.name.includes(batch.name.split(' ').pop()))?.quantity || 1}</span></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                               <Button onClick={() => batch.orders.forEach(o => advanceLifecycle(o.id, 'Cooking'))} className="flex-1 font-semibold h-10 bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm overflow-hidden">
                                 <Layers className="w-4 h-4 mr-2 shrink-0"/> <span className="truncate">Create Batch — {batch.name}</span>
                               </Button>
                               <Button onClick={() => batch.orders.forEach(o => advanceLifecycle(o.id, 'Cooking'))} variant="outline" className="font-semibold h-10 w-auto px-5 shrink-0 border-slate-200 text-slate-600 hover:bg-slate-100">Dismiss</Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  
                  {filteredOrders.filter(order => {
                    if (filter !== 'Batch Suggestion') return true;
                    // Hide if it's already part of a valid batch opportunity
                    return !batchOpportunities.some(b => b.orders.some(o => o.id === order.id));
                  }).map((order) => {
                  
                  return (
                    <div key={order.id} className={`bg-white rounded-xl border ${order.items.some(i => i.isOOS) ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'} shadow-sm flex flex-col relative transition-all duration-300 hover:shadow-md hover:border-slate-300 h-fit mt-3`}>
                      {/* OOS Warning Banner */}
                      {order.items.some(i => i.isOOS) && order.lifecycle === 'Incoming' && (
                        <div className="absolute -top-6 left-4 right-4 bg-red-100 border border-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded-t-lg flex items-center justify-between shadow-sm z-0">
                          <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> INVENTORY WARNING</span>
                        </div>
                      )}
                      
                      {/* Top Source Badge from Figma - strict rectangle tag */}
                      {order.lifecycle === 'Incoming' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                           <div className={`px-4 py-1 text-[11px] font-bold uppercase tracking-widest ${getSourceStyle(order.source).bg} ${getSourceStyle(order.source).text} shadow-sm rounded-none border border-black/5 flex items-center gap-1.5`}>
                             {order.source}
                           </div>
                        </div>
                      )}

                      <div className="p-5 flex flex-col pt-6">
                        {/* Common Header for all non-Batch Suggestion cards */}
                        {order.lifecycle !== 'Batch Suggestion' && (
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                 <span className="text-sm font-bold text-slate-800 bg-[#eef2ff] px-2 py-0.5 rounded shadow-sm">#{order.id}</span>
                                 <span className="text-base text-slate-800">order by <span className="font-medium">{order.customer_name}</span></span>
                              </div>
                              <Badge variant="outline" className="w-fit text-[10px] font-bold uppercase tracking-wider text-slate-500 border-slate-200 bg-slate-50 flex items-center gap-1">
                                {getStationForOrder(order) === 'Fry & Grill Station' ? <CookingPot className="w-3 h-3"/> : getStationForOrder(order) === 'Assembly Station' ? <ChefHat className="w-3 h-3"/> : <Flame className="w-3 h-3"/>}
                                {getStationForOrder(order)}
                              </Badge>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm text-slate-500">
                                {order.lifecycle === 'Incoming' ? `${Math.floor((order.maxTime - order.timeLeft) / 60) + 1}m ago` : order.time}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Order Items */}
                        <div className="space-y-2 mb-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col">
                              <div className={`flex justify-between items-center ${item.isOOS ? 'bg-[#fef2f2] -mx-5 px-5 py-2' : ''}`}>
                                <div className={`font-medium text-[15px] flex items-center ${item.isOOS ? 'text-[#b91c1c]' : item.isCanceled ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                  {item.quantity}x {item.name}
                                  {item.isCanceled && <span className="ml-2 text-[10px] font-bold text-red-500 uppercase tracking-wider not-italic no-underline border border-red-200 bg-red-50 px-1.5 py-0.5 rounded">Canceled</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`font-medium text-[15px] ${item.isOOS || item.isCanceled ? 'text-slate-400 line-through' : 'text-slate-700'}`}>₹{item.price.toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="h-px bg-slate-200 w-full mb-2"></div>

                        {/* Contextual Actions based on Lifecycle */}
                        {order.lifecycle === 'Incoming' && (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-semibold text-slate-600">Prep Time Adjustment</span>
                              <div className="flex items-center rounded border border-slate-300 overflow-hidden bg-white">
                                <Button variant="ghost" size="icon" onClick={() => adjustPrepTime(order.id, -1)} className="h-8 w-8 rounded-none hover:bg-slate-50 text-[#0f8b72]"><Minus className="h-4 w-4 stroke-[3]" /></Button>
                                <div className="w-16 text-center text-sm font-bold border-x border-slate-200 h-8 flex items-center justify-center">{prepTimes[order.id]}min</div>
                                <Button variant="ghost" size="icon" onClick={() => adjustPrepTime(order.id, 1)} className="h-8 w-8 rounded-none hover:bg-slate-50 text-[#0f8b72]"><Plus className="h-4 w-4 stroke-[3]" /></Button>
                              </div>
                            </div>
                            

                            
                            {order.requiresStaggeredStart && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs font-semibold text-amber-800 mt-2 mb-3">
                                <div className="flex items-center gap-1.5 mb-1"><Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Multi-Brand Synchronization</div>
                                Start <span className="font-bold underline">Chicken Biryani</span> now. Hold <span className="font-bold underline">Loaded Fries</span> for 30 mins to avoid cold food.
                              </div>
                            )}

                            {order.items.some(i => i.isOOS) ? (
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 relative">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" /> INVENTORY WARNING
                                  </div>
                                  <Button 
                                    onClick={() => setOosState(prev => ({...prev, [order.id]: 2}))} 
                                    variant="outline" 
                                    className="h-8 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm rounded-md"
                                  >
                                    <Phone className="w-3 h-3 mr-1.5"/> Call Customer
                                  </Button>
                                </div>
                                
                                {oosState[order.id] === 2 ? (
                                  <div className="flex flex-col gap-4 animate-in fade-in duration-300 pt-2 border-t border-slate-200">
                                    <div className="flex items-center gap-2 mb-1">
                                       <span className="relative flex h-2.5 w-2.5">
                                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                       </span>
                                       <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Awaiting Customer Decision</span>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-xs font-semibold text-slate-600">If customer agrees to substitute, select their choice:</label>
                                      <select 
                                        className="w-full border border-slate-300 rounded-lg h-12 px-4 py-2 text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                                        value={selectedReplacement[order.id] || ''}
                                        onChange={(e) => {
                                          const replacement = e.target.value;
                                          setSelectedReplacement(prev => ({...prev, [order.id]: replacement}));
                                          
                                          let addedTime = 15;
                                          if (replacement === 'No Substitute') addedTime = 0;
                                          else if (replacement.includes('Biryani')) addedTime = 20;
                                          else if (replacement.includes('Masala')) addedTime = 25;
                                          else if (replacement.includes('Burger') || replacement.includes('Fries')) addedTime = 15;
                                          else if (replacement.includes('Bowl')) addedTime = 10;
                                          
                                          const baseTime = order.id === 'DIR-4403' ? 45 : 15;
                                          setPrepTimes(prev => ({...prev, [order.id]: baseTime + addedTime}));
                                        }}
                                      >
                                        <option value="" disabled>Select a substitute from the SAME station...</option>
                                        <option value="No Substitute">No Substitute (Cancel Item)</option>
                                        {getStationForOrder(order) === 'Main Hot Station' && (
                                          <>
                                            <option value="Chicken Biryani (L)">Chicken Biryani (L) (₹425) - 20m prep</option>
                                            <option value="Mutton Biryani">Mutton Biryani (₹450) - 20m prep</option>
                                            <option value="Kaju Butter Masala">Kaju Butter Masala (₹250) - 25m prep</option>
                                          </>
                                        )}
                                        {getStationForOrder(order) === 'Fry & Grill Station' && (
                                          <>
                                            <option value="Smash Burger">Smash Burger (₹280) - 15m prep</option>
                                            <option value="Loaded Fries">Loaded Fries (₹180) - 15m prep</option>
                                            <option value="Truffle Mushroom Burger">Truffle Mushroom Burger (₹320) - 15m prep</option>
                                          </>
                                        )}
                                        {getStationForOrder(order) === 'Assembly Station' && (
                                          <>
                                            <option value="Quinoa Power Bowl">Quinoa Power Bowl (₹280) - 10m prep</option>
                                            <option value="Teriyaki Chicken Bowl">Teriyaki Chicken Bowl (₹310) - 10m prep</option>
                                          </>
                                        )}
                                      </select>
                                    </div>
    
                                    <div className="flex flex-col gap-3">
                                      <Button 
                                        disabled={!selectedReplacement[order.id]}
                                        onClick={() => {
                                          const replacement = selectedReplacement[order.id];
                                          let nextState = 'Cooking';
                                          let newBatchMatch = null;
                                          
                                          if (replacement === 'No Substitute') {
                                              nextState = 'Cooking';
                                              newBatchMatch = null;
                                          } else if (replacement.includes('Biryani')) {
                                              newBatchMatch = 'B15';
                                              nextState = 'Batch Suggestion';
                                          } else if (replacement.includes('Masala')) {
                                              nextState = 'Cooking';
                                          } else if (replacement.includes('Burger') || replacement.includes('Fries')) {
                                              newBatchMatch = 'G02';
                                              nextState = 'Batch Suggestion';
                                          } else if (replacement.includes('Bowl')) {
                                              newBatchMatch = 'H01';
                                              nextState = 'Batch Suggestion';
                                          }
                                          
                                          const newTotalTime = prepTimes[order.id];
      
                                          replaceItem(order.id, order.items.find(i=>i.isOOS).name, replacement, newBatchMatch);
                                          advanceLifecycle(order.id, nextState, newTotalTime);
                                        }} 
                                        className="w-full relative overflow-hidden text-sm font-bold h-12 bg-[#0a5c4b] hover:bg-[#08483b] text-white shadow-sm rounded-lg border-0 disabled:opacity-50"
                                      >
                                        <div className="absolute left-0 top-0 bottom-0 bg-[#0f8b72] transition-all duration-1000 ease-linear" style={{ width: `${(order.timeLeft / order.maxTime) * 100}%` }}></div>
                                        <div className="relative z-10 flex items-center justify-center w-full px-4 text-sm font-bold tracking-wide">
                                          <CheckCircle2 className="w-4 h-4 mr-2"/> 
                                          Replace & Accept ({formatTime(order.timeLeft)})
                                        </div>
                                      </Button>
                                      
                                      <Button variant="outline" className="font-semibold h-12 w-full text-[#cb202d] border-[#cb202d] hover:bg-[#cb202d]/5 bg-white shadow-sm text-sm rounded-lg" onClick={() => rejectOrder(order)}>Reject</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <Button variant="outline" className="font-semibold h-12 w-32 text-[#cb202d] border-[#cb202d] hover:bg-[#cb202d]/5 bg-white shadow-sm text-base rounded-lg" onClick={() => rejectOrder(order)}>Reject</Button>
                                    <Button 
                                      onClick={() => setOosState(prev => ({...prev, [order.id]: 2}))} 
                                      className="flex-1 relative overflow-hidden h-12 bg-[#0a5c4b] hover:bg-[#08483b] text-white shadow-sm rounded-lg border-0"
                                    >
                                      <div className="absolute left-0 top-0 bottom-0 bg-[#0f8b72] transition-all duration-1000 ease-linear" style={{ width: `${(order.timeLeft / order.maxTime) * 100}%` }}></div>
                                      <div className="relative z-10 flex items-center justify-center w-full px-4 text-base font-bold tracking-wide">
                                         Accept Order ({formatTime(order.timeLeft)})
                                      </div>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col mt-4">
                                {(() => {
                                  const activeCookingMatch = order.batchMatch ? orders.find(o => o.lifecycle === 'Cooking' && o.batchMatch === order.batchMatch) : null;
                                  const isTooLateToMerge = activeCookingMatch && activeCookingMatch.timeLeft < activeCookingMatch.maxTime / 2;
                                  
                                  if (activeCookingMatch) {
                                    const batchOrders = orders.filter(o => o.lifecycle === 'Cooking' && o.batchMatch === activeCookingMatch.batchMatch);
                                    
                                    if (isTooLateToMerge) {
                                      const elapsedMins = Math.floor((activeCookingMatch.maxTime - activeCookingMatch.timeLeft) / 60);
                                      return (
                                        <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-2 mt-4 flex flex-col items-center justify-center text-center">
                                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                          </div>
                                          <div className="text-sm font-bold text-slate-700 mb-1">
                                            Batch {order.batchMatch} is already cooking
                                          </div>
                                          <div className="text-xs font-medium text-slate-500 mb-3 px-2">
                                            It's almost {elapsedMins} minutes over, so we can't add these orders to that batch.
                                          </div>
                                        </div>
                                      );
                                    }
                                    
                                    const matchedItem = batchOrders[0]?.items.find(i => i.name.includes('Biryani') || i.name.includes('Burger') || i.name.includes('Fries') || i.name.includes('Masala') || i.name.includes('Bowl'));
                                    const itemName = matchedItem ? matchedItem.name : 'Items';
                                    const totalQty = batchOrders.reduce((sum, o) => sum + (o.items.find(i => i.name === itemName)?.quantity || 0), 0);
                                    
                                    const elapsedMins = Math.floor((activeCookingMatch.maxTime - activeCookingMatch.timeLeft) / 60);                                    
                                    let statusColor = isTooLateToMerge ? 'bg-red-500' : (elapsedMins > 4 ? 'bg-blue-500' : 'bg-[#0f8b72]');
                                    let statusText = isTooLateToMerge ? 'We can\'t add because it\'s almost reached at the end of the order or preparation. So we can\'t add these orders to that batch.' : (elapsedMins > 4 ? 'Early stage — safe to add' : 'Just started — best time to add');
                                    let barWidth = isTooLateToMerge ? 'w-full' : (elapsedMins > 4 ? 'w-1/2' : 'w-1/4');
                                    let textColor = isTooLateToMerge ? 'text-red-600' : 'text-slate-400';
                                    
                                    const isSelected = batchSelections[order.id] === activeCookingMatch.batchMatch && !isTooLateToMerge;
                                    
                                    return (
                                      <div className="flex-1 flex flex-col mb-4">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ADD TO BATCH</div>
                                        <div 
                                          className={`border rounded-lg p-3 transition-colors ${isTooLateToMerge ? 'opacity-80 cursor-not-allowed border-red-200 bg-red-50/50' : (isSelected ? 'border-[#0f8b72] bg-[#f0fdf4] cursor-pointer' : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer')}`}
                                          onClick={() => {
                                              if (!isTooLateToMerge) {
                                                  setBatchSelections(prev => prev[order.id] === activeCookingMatch.batchMatch ? { ...prev, [order.id]: null } : { ...prev, [order.id]: activeCookingMatch.batchMatch });
                                              }
                                          }}
                                        >
                                          <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-3">
                                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isTooLateToMerge ? 'border-red-300 bg-red-100' : (isSelected ? 'border-[#0f8b72] bg-[#0f8b72]' : 'border-slate-300')}`}>
                                                {isSelected && !isTooLateToMerge && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                              </div>
                                              <div className="flex items-baseline gap-2">
                                                <span className={`font-bold text-sm ${isTooLateToMerge ? 'text-slate-500' : 'text-slate-800'}`}>Batch {activeCookingMatch.batchMatch}</span>
                                                <span className={`text-xs font-semibold ${isSelected ? 'text-[#0f8b72]' : (isTooLateToMerge ? 'text-slate-400' : 'text-slate-600')}`}>{itemName} x{totalQty}</span>
                                              </div>
                                            </div>
                                            <span className={`text-xs font-bold ${isTooLateToMerge ? 'text-red-500' : 'text-slate-600'}`}>{elapsedMins}min ago</span>
                                          </div>
                                          
                                          <div className="w-full bg-slate-100 h-1.5 rounded-full mb-2 overflow-hidden">
                                            <div className={`h-full ${statusColor} ${barWidth} rounded-full transition-all`}></div>
                                          </div>
                                          
                                          <div className={`text-[10px] ${textColor} font-medium leading-relaxed`}>
                                            {statusText} {isTooLateToMerge ? '' : `· ${batchOrders.length} orders already in batch`}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                                
                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 mt-auto">
                                  {order.source === 'Direct' && (
                                    <Button 
                                      variant="outline"
                                      onClick={() => showNotification('Calling Customer', `Calling ${order.customer_name}...`, 'info')}
                                      className="font-semibold h-12 w-full flex items-center justify-center text-blue-600 border-blue-200 hover:bg-blue-50 bg-white shadow-sm rounded-lg"
                                    >
                                      <Phone className="w-4 h-4 mr-2" /> Call Customer
                                    </Button>
                                  )}
                                  <div className="flex gap-3">
                                    <Button variant="outline" className="font-semibold h-12 w-32 shrink-0 text-[#cb202d] border-[#cb202d] hover:bg-[#cb202d]/5 bg-white shadow-sm text-base rounded-lg" onClick={() => rejectOrder(order)}>Reject</Button>
                                    <Button 
                                      onClick={() => {
                                         if (batchSelections[order.id]) {
                                             mergeOrderToCooking(order);
                                         } else {
                                             acceptOrder(order);
                                         }
                                      }}
                                      className="flex-1 relative overflow-hidden h-12 bg-[#0a5c4b] hover:bg-[#08483b] text-white shadow-sm rounded-lg border-0"
                                    >
                                      <div className="absolute left-0 top-0 bottom-0 bg-[#0f8b72] transition-all duration-1000 ease-linear" style={{ width: `${(order.timeLeft / order.maxTime) * 100}%` }}></div>
                                      <div className="relative z-10 flex items-center justify-center w-full px-4 text-base font-bold tracking-wide">
                                         Accept Order ({formatTime(order.timeLeft)})
                                      </div>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {order.lifecycle === 'Batch Suggestion' && (() => {
                          const activeCookingMatch = order.batchMatch ? orders.find(o => o.lifecycle === 'Cooking' && o.batchMatch === order.batchMatch) : null;
                          
                          return (
                            <div className="flex flex-col gap-2 mt-4">
                              {activeCookingMatch ? (
                                <button 
                                  onClick={() => advanceLifecycle(order.id, 'Cooking')} 
                                  className="w-full text-left bg-amber-50 hover:bg-amber-100 transition-all border border-amber-300 rounded-lg p-3 flex flex-col gap-1.5 cursor-pointer shadow-sm group"
                                >
                                  <div className="flex items-start gap-2 text-amber-900">
                                    <Lightbulb className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                                    <div className="text-sm font-medium">
                                      <span className="font-bold text-amber-700">Batch {order.batchMatch} ({activeCookingMatch.items[0].name})</span> is currently cooking. Add this item to the active batch?
                                    </div>
                                  </div>
                                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider group-hover:text-amber-900 flex items-center pl-7">
                                    Tap to Add to Batch <Plus className="w-3.5 h-3.5 ml-1" />
                                  </div>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => advanceLifecycle(order.id, 'Cooking')} 
                                  className="w-full text-left bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-200 rounded-lg p-3 flex flex-col gap-1.5 cursor-pointer shadow-sm group"
                                >
                                  <div className="flex items-start gap-2 text-indigo-900">
                                    <Layers className="w-5 h-5 mt-0.5 shrink-0 text-indigo-600" />
                                    <div className="text-sm font-medium">
                                      Start Cooking (No Batch)
                                    </div>
                                  </div>
                                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider group-hover:text-indigo-800 flex items-center pl-7">
                                    Waiting for batch opportunities... <Plus className="w-3.5 h-3.5 ml-1" />
                                  </div>
                                </button>
                              )}
                            </div>
                          );
                        })()}

                        {(order.lifecycle === 'Cooking' || order.lifecycle === 'Ready') && (
                          <div className="flex flex-col gap-2 mt-1">
                            <div className={`w-full relative overflow-hidden h-12 shadow-sm rounded-lg flex items-center justify-center border ${order.lifecycle === 'Ready' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                               <div className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-linear ${order.lifecycle === 'Ready' ? 'bg-emerald-200' : 'bg-amber-200'}`} style={{ width: `${(1 - (order.timeLeft / order.maxTime)) * 100}%` }}></div>
                               <div className="relative z-10 flex items-center justify-center w-full px-4 text-sm font-bold tracking-wide">
                                  {order.lifecycle === 'Ready' ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" /> : <Flame className="w-4 h-4 mr-2 text-amber-600 shrink-0" />}
                                  {order.lifecycle === 'Ready' ? 'Ready' : 'Cooking'}: {formatTime(order.timeLeft)} Remaining
                               </div>
                            </div>
                          </div>
                        )}

                        {order.lifecycle === 'Packed' && (
                          <div className="flex flex-col gap-2 mt-1">
                            <div className="text-center mb-1 text-xs font-bold text-slate-500">
                               Rider OTP: <span className="text-slate-800 tracking-wider">8291</span>
                            </div>
                            <Button 
                              onClick={() => showNotification('Calling Rider', `Connecting to rider for order #${order.id}...`, 'info')}
                              className="w-full h-10 bg-[#0f8b72] hover:bg-[#0a5c4b] text-white shadow-sm rounded-lg border-0 text-sm font-bold tracking-wide flex items-center justify-center"
                            >
                               <Phone className="w-3.5 h-3.5 mr-2 shrink-0" /> Call to Rider
                            </Button>
                            
                            <Button 
                              onClick={() => handoverOrder(order)} 
                              className="w-full h-10 bg-blue-800 hover:bg-blue-900 text-white shadow-sm rounded-lg border-0 text-sm font-bold tracking-wide flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" /> Handover to Rider
                            </Button>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
                </>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Right Metrics Panel */}
          <div className="w-80 lg:w-96 bg-slate-50/50 border-l border-slate-200 p-5 overflow-y-auto hidden md:block z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
            <ExceptionsPanel exceptions={exceptions} onActionClick={handleExceptionAction} />
            <div className="mb-6"></div>
            <KitchenStatusWidget />
            <RiderWaitingWidget riders={riders} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default OperationsCommandCenter;
