import * as React from 'react';
import { MOCK_RAINFALL_SERIES } from '@/data/mockData';
import { ChartContainer } from '@floodguard/ui';

export const RainfallChart: React.FC = () => {
  const maxRainfall = 80;

  return (
    <ChartContainer height={260}>
      <div className="flex h-full flex-col justify-between pt-2">
        <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="bg-primary inline-block h-2.5 w-2.5 rounded-full" />
              <span>Observed Rainfall (mm)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-cyan-300 bg-cyan-400" />
              <span>TFT Forecast Horizon (mm)</span>
            </span>
          </div>
          <span className="bg-muted rounded px-2 py-0.5 font-mono text-[10px]">
            TFT Model v2.4
          </span>
        </div>

        {/* SVG Line / Bar Visualization */}
        <div className="border-border/80 relative flex w-full flex-1 items-end justify-between gap-2 border-b border-l px-2 pb-1">
          {MOCK_RAINFALL_SERIES.map((pt, i) => {
            const val =
              pt.actualRainfall !== null
                ? pt.actualRainfall
                : pt.predictedRainfall;
            const heightPct = Math.min(
              100,
              Math.max(10, (val / maxRainfall) * 100),
            );
            const isForecast = pt.actualRainfall === null;

            return (
              <div
                key={i}
                className="group relative flex h-full flex-1 flex-col items-center justify-end"
              >
                {/* Tooltip on Hover */}
                <div className="pointer-events-none absolute -top-10 z-20 whitespace-nowrap rounded bg-slate-900 p-1.5 font-mono text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {pt.time}: {val} mm
                  {isForecast && ' (AI Prediction)'}
                </div>

                {/* Bar */}
                <div
                  className={`w-full max-w-[28px] rounded-t-sm transition-all duration-300 ${
                    isForecast
                      ? 'animate-pulse border-t border-cyan-200 bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-90'
                      : 'from-primary/80 to-primary bg-gradient-to-t'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />

                {/* X Axis Label */}
                <span className="text-muted-foreground mt-2 w-full truncate text-center font-mono text-[9px]">
                  {pt.time.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ChartContainer>
  );
};
