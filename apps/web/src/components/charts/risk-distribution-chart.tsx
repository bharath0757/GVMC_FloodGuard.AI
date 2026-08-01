import * as React from 'react';
import { MOCK_RISK_DISTRIBUTION } from '@/data/mockData';
import { ChartContainer } from '@floodguard/ui';

export const RiskDistributionChart: React.FC = () => {
  return (
    <ChartContainer height={260}>
      <div className="flex flex-col h-full justify-between pt-2">
        {/* Risk Percentage Bar Stack */}
        <div className="w-full flex h-6 rounded-lg overflow-hidden border border-border">
          {MOCK_RISK_DISTRIBUTION.map((item) => (
            <div
              key={item.category}
              className="h-full transition-all hover:brightness-110"
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              title={`${item.category}: ${item.count} Wards (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {MOCK_RISK_DISTRIBUTION.map((item) => (
            <div key={item.category} className="flex items-center space-x-2 p-2 rounded bg-muted/40 border border-border/50">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <div className="text-xs font-semibold text-foreground">{item.category}</div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {item.count} Wards ({item.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
};
