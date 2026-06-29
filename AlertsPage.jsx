import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    try {
      const data = await pb.collection('alerts').getFullList({ filter: 'acknowledged = false', sort: '-created', $autoCancel: false });
      setAlerts(data);
    } catch (error) {}
    setLoading(false);
  };

  const acknowledge = async (id) => {
    try {
      await pb.collection('alerts').update(id, { acknowledged: true }, { $autoCancel: false });
      toast.success('Alert acknowledged');
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (e) { toast.error('Failed to acknowledge'); }
  };

  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'critical': return 'border-status-urgent bg-status-urgent/5 border-l-4 border-l-status-urgent';
      case 'high': return 'border-status-normal bg-status-normal/5 border-l-4 border-l-status-normal';
      default: return 'border-border bg-card border-l-4 border-l-border';
    }
  };

  return (
    <>
      <Helmet><title>Alerts - KitchenOS</title></Helmet>
      <div className="min-h-screen bg-secondary/30 pb-20">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 pt-6">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8">System Alerts</h1>
          <div className="space-y-4">
            {alerts.map(alert => (
              <Card key={alert.id} className={`p-5 shadow-sm rounded-xl ${getSeverityStyles(alert.severity)}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === 'critical' ? 'text-status-urgent' : 'text-status-normal'}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="uppercase font-bold text-[10px] tracking-wider bg-background">{alert.type?.replace('_', ' ')}</Badge>
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="font-semibold text-foreground/90">{alert.message}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="font-bold shrink-0" onClick={() => acknowledge(alert.id)}>Acknowledge</Button>
                </div>
              </Card>
            ))}
            {alerts.length === 0 && !loading && (
              <div className="text-center py-16 text-muted-foreground font-medium border-2 border-dashed rounded-xl">No active alerts. Everything is running smoothly.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertsPage;
