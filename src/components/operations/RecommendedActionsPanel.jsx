import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Lightbulb, AlertCircle, Phone, PackageCheck } from 'lucide-react';

export const RecommendedActionsPanel = ({ actions, onActionClick }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-blue-600" />
        <h2 className="font-bold text-blue-900 text-sm tracking-wide uppercase">Recommended Next Actions</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {actions.map((action, idx) => {
          let Icon = ArrowRight;
          let colorClass = 'bg-white border-blue-200 hover:border-blue-300';
          let iconClass = 'text-blue-500 bg-blue-50';
          
          let priorityBadge = <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[9px] uppercase">Medium</Badge>;
          
          if (action.type === 'urgent') {
            Icon = AlertCircle;
            colorClass = 'bg-red-50 border-red-200 hover:border-red-300';
            iconClass = 'text-red-600 bg-red-100';
            priorityBadge = <Badge variant="destructive" className="text-[9px] uppercase">Critical</Badge>;
          } else if (action.type === 'call') {
            Icon = Phone;
            priorityBadge = <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 text-[9px] uppercase">High</Badge>;
          } else if (action.type === 'pack') {
            Icon = PackageCheck;
            iconClass = 'text-green-600 bg-green-50';
          }

          return (
            <button
              key={idx}
              onClick={() => onActionClick && onActionClick(action)}
              className={`flex items-center text-left gap-3 p-3 rounded-lg border shadow-sm transition-all group ${colorClass}`}
            >
              <div className={`p-2 rounded-full ${iconClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                    {action.title}
                  </div>
                  {priorityBadge}
                </div>
                {action.subtitle && (
                  <div className="text-xs text-slate-500">{action.subtitle}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
