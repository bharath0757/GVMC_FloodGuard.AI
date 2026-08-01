import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Sparkles, CheckCircle2, CloudRain, ShieldAlert, FileText, Building2, Navigation, Bell } from 'lucide-react';
import { Button, Badge } from '@floodguard/ui';
import { TimelineEvent } from './incident-timeline';

interface DemoSimulationState {
  isActive: boolean;
  step: number; // 0 to 8
  isCompleted: boolean;
  rainfall_mm_hr: number;
  risk_score: number;
  report_created: boolean;
  report_verified: boolean;
  shelter_recommended: boolean;
  route_generated: boolean;
  notification_sent: boolean;
  simulatedTimeline: TimelineEvent[];
}

interface Props {
  onSimulationUpdate?: (state: DemoSimulationState) => void;
}

export const DemoSimulationBanner: React.FC<Props> = ({ onSimulationUpdate }) => {
  const [simState, setSimState] = React.useState<DemoSimulationState>({
    isActive: false,
    step: 0,
    isCompleted: false,
    rainfall_mm_hr: 42.8,
    risk_score: 48.2,
    report_created: false,
    report_verified: false,
    shelter_recommended: false,
    route_generated: false,
    notification_sent: false,
    simulatedTimeline: [],
  });

  React.useEffect(() => {
    if (onSimulationUpdate) {
      onSimulationUpdate(simState);
    }
  }, [simState, onSimulationUpdate]);

  const stepsList = [
    { title: '1. Heavy Rainfall Telemetry', desc: 'Simulating 85.0 mm/h cloudburst rainfall rate in Ward 14 (Gajuwaka)', icon: <CloudRain className="h-4 w-4 text-cyan-400" /> },
    { title: '2. XGBoost Risk Escalation', desc: 'Recalculating Ward 14 risk score -> 92.4/100 (Critical Level - Red Alert)', icon: <ShieldAlert className="h-4 w-4 text-red-400" /> },
    { title: '3. Map Color Scale Update', desc: 'Gajuwaka polygon styled to Critical Red on Mapbox vector canvas', icon: <Sparkles className="h-4 w-4 text-amber-400" /> },
    { title: '4. Citizen Flood Report Created', desc: "Autogenerating report: 'Gajuwaka Underpass Inundation' (65cm depth)", icon: <FileText className="h-4 w-4 text-blue-400" /> },
    { title: '5. Automated Report Verification', desc: 'GVMC Municipal Authority auto-verifying report & assigning P0 Priority', icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> },
    { title: '6. MCDA Shelter Recommendation', desc: 'Recommending Gajuwaka Sports Stadium (250 free spaces, Medical Team)', icon: <Building2 className="h-4 w-4 text-purple-400" /> },
    { title: '7. A* Safe Route Generation', desc: 'Computing safe pathing avoiding flooded NH-16 underpass', icon: <Navigation className="h-4 w-4 text-teal-400" /> },
    { title: '8. Emergency Alert Broadcast', desc: 'Broadcasting multilingual siren notification & SMS to 45,000 residents', icon: <Bell className="h-4 w-4 text-red-500 animate-bounce" /> },
  ];

  const timerRef = React.useRef<any>(null);

  const startSimulation = () => {
    setSimState({
      isActive: true,
      step: 1,
      isCompleted: false,
      rainfall_mm_hr: 85.0,
      risk_score: 92.4,
      report_created: true,
      report_verified: true,
      shelter_recommended: true,
      route_generated: true,
      notification_sent: true,
      simulatedTimeline: [],
    });

    let currentStep = 1;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      currentStep++;
      if (currentStep <= 8) {
        setSimState((prev) => ({
          ...prev,
          step: currentStep,
        }));
      } else {
        clearInterval(timerRef.current);
        setSimState((prev) => ({
          ...prev,
          step: 8,
          isCompleted: true,
        }));
      }
    }, 1200);
  };

  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSimState({
      isActive: false,
      step: 0,
      isCompleted: false,
      rainfall_mm_hr: 42.8,
      risk_score: 48.2,
      report_created: false,
      report_verified: false,
      shelter_recommended: false,
      route_generated: false,
      notification_sent: false,
      simulatedTimeline: [],
    });
  };

  return (
    <div className="p-4 rounded-2xl border border-teal-500/40 bg-slate-900/90 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white shadow-md">
            <Sparkles className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Guided Hackathon Demo Simulation Engine
              <Badge variant="risk_critical">INTERACTIVE DEMO</Badge>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Simulate cloudburst, XGBoost risk escalation, report verification, MCDA shelter match, & A* routing in real-time.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {!simState.isActive ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={startSimulation}
              leftIcon={<Play className="h-4 w-4 text-emerald-300 fill-emerald-300" />}
            >
              Start Guided Demo
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset Simulation
            </Button>
          )}
        </div>
      </div>

      {/* Progress & Step Details */}
      {simState.isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          {/* Step Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Simulation Step {simState.step} of 8</span>
              <span className="text-teal-400 font-bold">
                {simState.isCompleted ? '✅ Simulation Complete' : '⚡ Running Live Telemetry...'}
              </span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${(simState.step / 8) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Step Cards Carousel Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stepsList.map((st, i) => {
              const isCurrent = simState.step === i + 1;
              const isPast = simState.step > i + 1;

              return (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all ${
                    isCurrent
                      ? 'border-teal-400 bg-teal-950/40 text-white shadow-lg ring-1 ring-teal-400/50'
                      : isPast
                      ? 'border-slate-800 bg-slate-950 text-slate-400 opacity-80'
                      : 'border-slate-900 bg-slate-950/40 text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold mb-1">
                    {st.icon}
                    <span className="truncate">{st.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight truncate">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
