import * as React from 'react';
import { MOCK_SHELTERS } from '@/data/mockData';
import { ChartContainer, Progress } from '@floodguard/ui';

export const ShelterCapacityChart: React.FC = () => {
  return (
    <ChartContainer height={260}>
      <div className="space-y-3 overflow-y-auto max-h-[240px] pr-1">
        {MOCK_SHELTERS.map((sh) => {
          const occupancyPct = Math.round((sh.currentOccupancy / sh.capacity) * 100);
          const isFull = occupancyPct >= 90;

          return (
            <div key={sh.id} className="space-y-1 p-2 rounded-lg bg-muted/40 border border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground truncate max-w-[200px]">{sh.name}</span>
                <span className="font-mono text-muted-foreground">
                  {sh.currentOccupancy} / {sh.capacity} ({occupancyPct}%)
                </span>
              </div>
              <Progress
                value={occupancyPct}
                variant={isFull ? 'danger' : occupancyPct > 70 ? 'warning' : 'safe'}
              />
            </div>
          );
        })}
      </div>
    </ChartContainer>
  );
};
