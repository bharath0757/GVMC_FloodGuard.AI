import * as React from 'react';
import { BarChart3, Building2, TrendingUp, Clock, Award } from 'lucide-react';
import { Badge, AnalyticsCard } from '@floodguard/ui';
import { RainfallChart } from '@/components/charts/rainfall-chart';
import { RiskDistributionChart } from '@/components/charts/risk-distribution-chart';
import { ShelterCapacityChart } from '@/components/charts/shelter-capacity-chart';
import { IncidentReportsChart } from '@/components/charts/incident-reports-chart';

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Monsoon Flood Analytics & Predictive Metrics</h2>
            <span className="text-xs font-mono text-slate-400">
              Visakhapatnam Historical & Realtime Sensor Telemetry • TFT Time-Series Models
            </span>
          </div>
        </div>
        <Badge variant="secondary">REALTIME DATA SYNC</Badge>
      </div>

      {/* Response Performance Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
          <div className="flex items-center justify-between text-teal-400">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold text-xl">&lt; 4.2 min</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Avg Report Verification Time</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <Award className="h-4 w-4" />
            <span className="font-mono font-bold text-xl">94.2%</span>
          </div>
          <span className="text-xs font-mono text-slate-400">AI Hazard Model Accuracy</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
          <div className="flex items-center justify-between text-cyan-400">
            <Building2 className="h-4 w-4" />
            <span className="font-mono font-bold text-xl">18,500</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Shelter Capacity</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <TrendingUp className="h-4 w-4" />
            <span className="font-mono font-bold text-xl">45,000</span>
          </div>
          <span className="text-xs font-mono text-slate-400">SMS Alerts Dispatched</span>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Rainfall Trends & TFT Forecast */}
        <AnalyticsCard
          title="1. Rainfall Trends & TFT 24h Forecast"
          description="Observed hourly rainfall vs Temporal Fusion Transformer predictions"
        >
          <RainfallChart />
        </AnalyticsCard>

        {/* 2. Ward Risk Category Distribution */}
        <AnalyticsCard
          title="2. Ward Flood Risk Distribution"
          description="Classification breakdown of 15 municipal wards by XGBoost risk level"
        >
          <RiskDistributionChart />
        </AnalyticsCard>

        {/* 3. Relief Shelter Capacity & Occupancy */}
        <AnalyticsCard
          title="3. Relief Shelter Capacity Utilization"
          description="Current occupancy vs total capacity across all 8 active shelters"
        >
          <ShelterCapacityChart />
        </AnalyticsCard>

        {/* 4. Crowdsourced Incident Severity Categories */}
        <AnalyticsCard
          title="4. Incident Report Severity Distribution"
          description="Categorization of crowdsourced citizen reports by hazard type"
        >
          <IncidentReportsChart />
        </AnalyticsCard>
      </div>
    </div>
  );
};
