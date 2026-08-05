import * as React from 'react';
import { MOCK_SHELTERS } from '@/data/mockData';
import { ChartContainer, Progress } from '@floodguard/ui';

export const ShelterCapacityChart: React.FC = () => {
  return (
    <ChartContainer height={260}>
      <div className="max-h-[240px] space-y-3 overflow-y-auto pr-1">
        {MOCK_SHELTERS.map((sh) => {
          const occupancyPct = Math.round(
            (sh.currentOccupancy / sh.capacity) * 100,
          );
          const isFull = occupancyPct >= 90;

          return (
            <div
              key={sh.id}
              className="bg-muted/40 border-border/60 space-y-1 rounded-lg border p-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground max-w-[200px] truncate font-semibold">
                  {sh.name}
                </span>
                <span className="text-muted-foreground font-mono">
                  {sh.currentOccupancy} / {sh.capacity} ({occupancyPct}%)
                </span>
              </div>
              <Progress
                value={occupancyPct}
                variant={
                  isFull ? 'danger' : occupancyPct > 70 ? 'warning' : 'safe'
                }
              />
            </div>
          );
        })}
      </div>
    </ChartContainer>
  );
};
