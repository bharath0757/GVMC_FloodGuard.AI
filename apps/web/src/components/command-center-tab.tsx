import * as React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Building2,
  Camera,
  Brain,
  Navigation,
} from 'lucide-react';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatisticsCard,
} from '@floodguard/ui';
import { useAIDashboardSummary } from '@/hooks/use-ai-queries';
import { useShelters, useReports } from '@/hooks/use-api-queries';
import { IncidentTimeline } from '@/components/incident-timeline';
import { DemoSimulationBanner } from '@/components/demo-simulation-banner';

export const CommandCenterTab: React.FC = () => {
  const { data: aiSummary } = useAIDashboardSummary();
  const { data: shelters = [] } = useShelters();
  const { data: reports = [] } = useReports();

  const criticalWards = (aiSummary?.ward_predictions || []).filter(
    (w) => w.risk_category === 'Critical',
  );

  return (
    <div className="space-y-6">
      {/* 1. Guided Demo Simulation Banner */}
      <DemoSimulationBanner />

      {/* 2. Top Statistics Header Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatisticsCard
          title="Overall Alert Level"
          value={aiSummary?.overall_alert_level || 'Red Stage 3'}
          subtitle="Visakhapatnam GVMC Monsoon Grid"
          trend="Monsoon Stage 3"
          trendDirection="up"
          variant="danger"
          icon={<ShieldAlert className="h-5 w-5 animate-pulse text-red-500" />}
        />
        <StatisticsCard
          title="Critical Wards (P0)"
          value={`${criticalWards.length || 3} Wards`}
          subtitle="Gajuwaka, Pendurthi, Old Town"
          trend="Immediate Evacuation"
          trendDirection="down"
          variant="warning"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <StatisticsCard
          title="Relief Shelters Capacity"
          value={`${shelters.length || 8} Shelters`}
          subtitle="PostgreSQL PostGIS GeoJSON Active"
          trend="18,500 Total Spaces"
          trendDirection="neutral"
          variant="safe"
          icon={<Building2 className="h-5 w-5 text-emerald-500" />}
        />
        <StatisticsCard
          title="Citizen Reports Queue"
          value={`${reports.length} Reports`}
          subtitle="Realtime AI Hazard Pipeline"
          trend="Verified Queue"
          trendDirection="up"
          icon={<Camera className="h-5 w-5 text-cyan-500" />}
        />
      </div>

      {/* 3. Two-Column Command Center Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Risk Overview, AI Recommendations & Recent Reports */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Risk Overview & High Risk Wards */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base text-white">
                  XGBoost Flood Risk & Active High-Risk Wards
                </CardTitle>
                <span className="font-mono text-xs text-slate-400">
                  15 Visakhapatnam Wards • Continuous Sensor Ingestion
                </span>
              </div>
              <Badge variant="risk_critical">XGBoost v2.1 Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(aiSummary?.ward_predictions || []).slice(0, 6).map((ward) => (
                  <div
                    key={ward.ward_number}
                    className={`flex items-center justify-between rounded-xl border p-3 font-mono text-xs ${
                      ward.alert_color === 'Red'
                        ? 'border-red-500/30 bg-red-950/20 text-red-200'
                        : ward.alert_color === 'Orange'
                          ? 'border-orange-500/30 bg-orange-950/20 text-orange-200'
                          : 'border-slate-800 bg-slate-950 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white">
                        {ward.ward_name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Ward #{ward.ward_number} • {ward.rainfall_mm_hr} mm/h
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-base font-extrabold">
                        {ward.risk_score.toFixed(0)}
                      </div>
                      <Badge
                        variant={
                          ward.alert_color === 'Red'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {ward.risk_category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Actionable Recommendations */}
          <Card className="border-teal-500/30 bg-teal-950/10">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-teal-400" />
                <CardTitle className="font-mono text-base uppercase text-white">
                  AI Command Center Recommendations
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-xs">
              <div className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <div className="font-bold text-white">
                    Pre-position NDRF Boat Units in Gajuwaka (Ward #14)
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    XGBoost risk score (88.2) combined with 68.2mm/h rainfall
                    indicates high underpass inundation risk.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">
                    Activate Secondary Relief Shelter AU Sports Complex
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Gajuwaka Stadium occupancy reached 79%. Divert new evacuees
                    to AU Sports Complex via A* safe route.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <div>
                  <div className="font-bold text-white">
                    Issue Traffic Advisory for Submerged NH-16 Intersection
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Citizen report rep-101 verified water depth at 65cm.
                    Redirect traffic toward Sheela Nagar arterial bypass.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Realtime Incident Chronological Timeline */}
        <div className="space-y-6">
          <Card className="h-full border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">
                Emergency Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IncidentTimeline />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
