import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, PackageX } from 'lucide-react';

export const ExceptionsPanel = ({ exceptions, onActionClick }) => {
  if (!exceptions || exceptions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden mb-6">
      <div className="bg-red-50 px-5 py-3 border-b border-red-100 flex justify-between items-center">
        <h3 className="font-bold text-red-800 flex items-center gap-2 text-sm uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          Exception Center
        </h3>
        <Badge variant="destructive" className="font-bold">{exceptions.length}</Badge>
      </div>
      
      <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
        {exceptions.map((ex, idx) => {
          return (
            <div key={idx} className="p-4 hover:bg-slate-50">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="font-bold text-sm text-slate-900 leading-tight">{ex.title}</div>
                <Badge variant={ex.type === 'ingredient' || ex.type === 'urgent' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-bold py-0.5 shrink-0 whitespace-nowrap text-center">{ex.status}</Badge>
              </div>
              <div className="text-xs font-medium text-slate-500 mb-3">{ex.impact}</div>
              {ex.action && (
                <Button onClick={() => onActionClick && onActionClick(ex)} variant="outline" size="sm" className="w-full text-xs font-semibold h-8 border-slate-300 hover:bg-slate-100 text-slate-700">
                  {ex.action}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
