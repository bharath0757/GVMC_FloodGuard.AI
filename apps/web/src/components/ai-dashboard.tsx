import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Shield, Navigation, AlertTriangle,
  TrendingUp, Activity, RefreshCw,
  Building2, ChevronRight, Target
} from 'lucide-react';
import { Badge, Button } from '@floodguard/ui';
import { useAIDashboardSummary, useAIPredictRisk, useAIRecommendShelter, useAISafeRoute, WardPrediction } from '@/hooks/use-ai-queries';

// ─────────────────────────────────────────────
// Alert Color Mappings
// ─────────────────────────────────────────────
const ALERT_BG: Record<string, string> = {
  Red:    'bg-red-500/15 border-red-500/50 text-red-300',
  Orange: 'bg-orange-500/15 border-orange-500/50 text-orange-300',
  Yellow: 'bg-amber-500/15 border-amber-500/50 text-amber-300',
  Green:  'bg-emerald-500/15 border-emerald-500/50 text-emerald-300',
};


// ─────────────────────────────────────────────
// Ward Risk Card (mini)
// ─────────────────────────────────────────────
const WardRiskCard: React.FC<{ ward: WardPrediction; onClick: () => void }> = ({ ward, onClick }) => {
  const barPct = Math.round(ward.risk_score);
  const barColor =
    ward.alert_color === 'Red'    ? 'bg-red-500' :
    ward.alert_color === 'Orange' ? 'bg-orange-500' :
    ward.alert_color === 'Yellow' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border backdrop-blur-sm transition-all ${ALERT_BG[ward.alert_color]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-xs truncate max-w-[100px]">{ward.ward_name}</span>
        <span className="font-mono font-bold text-sm">{ward.risk_score.toFixed(0)}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${barPct}%` }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono opacity-70">
        <span>🌧 {ward.rainfall_mm_hr} mm/h</span>
        <span>💧 {ward.water_level_cm} cm</span>
      </div>
    </motion.button>
  );
};

// ─────────────────────────────────────────────
// Prediction Detail Panel
// ─────────────────────────────────────────────
const PredictionPanel: React.FC<{
  ward: WardPrediction;
  onClose: () => void;
}> = ({ ward, onClose }) => {
  const predictMutation = useAIPredictRisk();
  const shelterMutation = useAIRecommendShelter();
  const routeMutation = useAISafeRoute();

  React.useEffect(() => {
    predictMutation.mutate({
      ward_number: ward.ward_number,
      rainfall_mm_hr: ward.rainfall_mm_hr,
      water_level_cm: ward.water_level_cm,
    });
    shelterMutation.mutate({
      user_lat: 17.6868,
      user_lng: 83.2185,
      risk_score: ward.risk_score,
      ward_risk_category: ward.risk_category,
    });
    routeMutation.mutate({
      start_ward: `w${ward.ward_number}`,
      high_risk_wards: [`w${ward.ward_number}`],
      flooded_wards: [],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ward.ward_number]);

  const pred = predictMutation.data;
  const shelter = shelterMutation.data;
  const route = routeMutation.data;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-4 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-white">{ward.ward_name}</h3>
          <span className="text-xs font-mono text-slate-400">Ward #{ward.ward_number} • Live AI Analysis</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1">✕</button>
      </div>

      {/* Risk Score */}
      <div className={`p-4 rounded-xl border ${ALERT_BG[ward.alert_color]}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase font-bold">AI Risk Score</span>
          <Badge variant={ward.alert_color === 'Red' ? 'destructive' : 'secondary'}>
            {ward.risk_category}
          </Badge>
        </div>
        <div className="text-5xl font-extrabold font-mono">{ward.risk_score.toFixed(1)}<span className="text-xl text-slate-400">/100</span></div>
        <div className="mt-2 text-xs font-mono text-slate-300">
          Confidence: {(ward.confidence * 100).toFixed(1)}% • Model: {ward.model_used}
        </div>
      </div>

      {/* SHAP Explanations */}
      {pred?.explanations && (
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase mb-2 font-bold">Feature Importance (SHAP)</div>
          <div className="space-y-2">
            {pred.explanations.slice(0, 4).map((exp, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 w-40 truncate">{exp.feature.replace(/_/g, ' ')}</span>
                <div className="flex-1 mx-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${exp.direction === 'increases_risk' ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(exp.contribution))}%` }}
                  />
                </div>
                <span className={exp.direction === 'increases_risk' ? 'text-red-400' : 'text-emerald-400'}>
                  {exp.contribution > 0 ? '+' : ''}{exp.contribution.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {pred?.recommendations && (
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase mb-2 font-bold">AI Recommendations</div>
          <div className="space-y-1.5">
            {pred.recommendations.map((rec, i) => (
              <div key={i} className="text-xs text-slate-300 bg-slate-900/60 border border-slate-800 rounded-lg p-2">{rec}</div>
            ))}
          </div>
        </div>
      )}

      {/* Best Shelter */}
      {shelter?.primary_shelter && (
        <div className="p-3 rounded-xl border border-emerald-800/50 bg-emerald-950/30">
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase font-mono">Recommended Shelter</span>
          </div>
          <div className="font-bold text-sm text-white">{shelter.primary_shelter.name}</div>
          <div className="flex items-center justify-between mt-1 text-xs font-mono text-slate-300">
            <span>📍 {shelter.primary_shelter.distance_km} km away</span>
            <span>🏠 {shelter.primary_shelter.available_capacity} spaces free</span>
            <span>⏱ ~{shelter.primary_shelter.estimated_travel_min} min</span>
          </div>
        </div>
      )}

      {/* Evacuation Route */}
      {route?.primary_route && (
        <div className="p-3 rounded-xl border border-cyan-800/50 bg-cyan-950/30">
          <div className="flex items-center space-x-2 mb-2">
            <Navigation className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase font-mono">A* Safe Evacuation Route</span>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-slate-300 flex-wrap gap-1">
            {route.primary_route.path.map((node, i) => (
              <React.Fragment key={node}>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded">{node}</span>
                {i < route.primary_route.path.length - 1 && <ChevronRight className="h-3 w-3 text-slate-500" />}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>📏 {route.primary_route.total_distance_km} km</span>
            <span>⏱ ~{route.primary_route.estimated_time_min} min</span>
            <span>🔬 {route.routing_algorithm}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Main AI Dashboard Component
// ─────────────────────────────────────────────
export const AIDashboard: React.FC = () => {
  const { data: summary, isLoading, refetch } = useAIDashboardSummary();
  const [selectedWard, setSelectedWard] = React.useState<WardPrediction | null>(null);

  const alertColors: Record<string, string> = {
    Red: 'text-red-400 border-red-500/50 bg-red-500/10',
    Orange: 'text-orange-400 border-orange-500/50 bg-orange-500/10',
    Yellow: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
    Green: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <Brain className="h-8 w-8 animate-pulse text-teal-400" />
          <span className="text-xs font-mono">XGBoost Inference Engine Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30">
            <Brain className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">AI Flood Intelligence Engine</h2>
            <span className="text-xs font-mono text-slate-400">XGBoost + A* Routing • 15 Wards Active • Visakhapatnam GVMC</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${alertColors[summary?.overall_alert_level || 'Green']}`}>
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span>ALERT: {summary?.overall_alert_level}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical Wards', value: summary?.critical_wards ?? 0, icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
          { label: 'High Risk Wards', value: summary?.high_risk_wards ?? 0, icon: <TrendingUp className="h-4 w-4" />, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
          { label: 'Avg Risk Score', value: `${summary?.average_risk_score ?? 0}`, icon: <Target className="h-4 w-4" />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
          { label: 'Safe Wards', value: summary?.safe_wards ?? 0, icon: <Shield className="h-4 w-4" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl border ${m.color} flex flex-col space-y-2`}
          >
            <div className="flex items-center justify-between">
              {m.icon}
              <span className="text-2xl font-extrabold font-mono">{m.value}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{m.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ward Risk Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Ward Risk Scores (Click to Inspect)</span>
            <Badge variant="secondary">{summary?.model_status}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[480px] overflow-y-auto pr-1">
            {(summary?.ward_predictions ?? []).map((ward) => (
              <WardRiskCard
                key={ward.ward_number}
                ward={ward}
                onClick={() => setSelectedWard(ward)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 min-h-[480px]">
          {selectedWard ? (
            <PredictionPanel ward={selectedWard} onClose={() => setSelectedWard(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <Brain className="h-12 w-12 text-slate-600" />
              <span className="text-sm font-mono text-center">
                Select a ward card to view<br />XGBoost predictions, SHAP explanations,<br />shelter recommendations & A* routes
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-mono text-teal-400 animate-pulse">
                <Activity className="h-3.5 w-3.5" />
                <span>AI Engine Active • 15 Ward Models Running</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Risk Ward Banner */}
      {summary?.top_risk_ward && (
        <div className={`p-4 rounded-xl border ${ALERT_BG['Red']} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
            <div>
              <span className="font-bold text-sm text-white">Highest Risk: {summary.top_risk_ward.ward_name} (Ward #{summary.top_risk_ward.ward_number})</span>
              <div className="text-xs font-mono text-red-300 mt-0.5">
                Risk Score: {summary.top_risk_ward.risk_score.toFixed(1)} | 🌧 {summary.top_risk_ward.rainfall_mm_hr} mm/h | 💧 {summary.top_risk_ward.water_level_cm} cm
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedWard(summary.top_risk_ward)}>
            Inspect →
          </Button>
        </div>
      )}
    </div>
  );
};
