import * as React from 'react';
import { ChartContainer } from '@floodguard/ui';

export const IncidentReportsChart: React.FC = () => {
  const categories = [
    { label: 'Blocked Drains / Overflow', count: 18, pct: 45, color: '#EF4444' },
    { label: 'Submerged Alleyways', count: 12, pct: 30, color: '#F97316' },
    { label: 'Fallen Trees & Power Lines', count: 6, pct: 15, color: '#EAB308' },
    { label: 'Stranded Citizens', count: 4, pct: 10, color: '#3B82F6' },
  ];

  return (
    <ChartContainer height={260}>
      <div className="flex flex-col justify-between h-full pt-2">
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{cat.label}</span>
                <span className="font-mono text-muted-foreground">{cat.count} reports ({cat.pct}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
};
