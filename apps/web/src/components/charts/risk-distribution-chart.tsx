import * as React from 'react';
import { MOCK_RISK_DISTRIBUTION } from '@/data/mockData';
import { ChartContainer } from '@floodguard/ui';

export const RiskDistributionChart: React.FC = () => {
  return (
    <ChartContainer height={260}>
      <div className="flex h-full flex-col justify-between pt-2">
        {/* Risk Percentage Bar Stack */}
        <div className="border-border flex h-6 w-full overflow-hidden rounded-lg border">
          {MOCK_RISK_DISTRIBUTION.map((item) => (
            <div
              key={item.category}
              className="h-full transition-all hover:brightness-110"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              title={`${item.category}: ${item.count} Wards (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Legend Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MOCK_RISK_DISTRIBUTION.map((item) => (
            <div
              key={item.category}
              className="bg-muted/40 border-border/50 flex items-center space-x-2 rounded border p-2"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <div className="text-foreground text-xs font-semibold">
                  {item.category}
                </div>
                <div className="text-muted-foreground font-mono text-[10px]">
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
