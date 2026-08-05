import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Cpu,
  Navigation,
  Building2,
  Camera,
  Mic,
  LayoutDashboard,
  Box,
  History,
  CloudRain,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  Activity,
  Phone,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@floodguard/ui';
import { AuthModal } from '@/components/auth-modal';
import { useAuth } from '@/context/auth-context';

export const LandingPage: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Top Banner Ticker */}
      <div className="flex items-center justify-between border-b border-cyan-800/40 bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 px-4 py-2 font-mono text-xs text-cyan-300">
        <div className="container mx-auto flex items-center space-x-2">
          <span className="flex h-2 w-2 animate-ping rounded-full bg-cyan-400" />
          <span className="font-bold">LIVE TELEMETRY:</span>
          <span className="truncate text-slate-300">
            Visakhapatnam GVMC Monsoon Stage 3 Warning • 450mm Cumulative
            Rainfall • TFT Model Active
          </span>
        </div>
        <Link
          to="/dashboard"
          className="hidden items-center text-cyan-400 hover:underline sm:inline-flex"
        >
          Launch Command Center →
        </Link>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="FloodGuard Logo"
              className="h-10 w-auto rounded-lg border border-slate-800 bg-slate-900/90 object-contain p-1 shadow-md shadow-teal-500/20"
            />
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                FloodGuard <span className="text-teal-400">AI</span>
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Smart City Flood Intelligence Platform
              </span>
            </div>
          </div>

          <nav className="hidden items-center space-x-6 text-sm font-medium text-slate-300 md:flex">
            <a
              href="#problem"
              className="transition-colors hover:text-teal-400"
            >
              Crisis
            </a>
            <a
              href="#solution"
              className="transition-colors hover:text-teal-400"
            >
              Solution
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-teal-400"
            >
              Capabilities
            </a>
            <a href="#tech" className="transition-colors hover:text-teal-400">
              Tech Stack
            </a>
            <a href="#works" className="transition-colors hover:text-teal-400">
              How It Works
            </a>
            <a
              href="#scalability"
              className="transition-colors hover:text-teal-400"
            >
              Scalability
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 font-mono text-xs text-teal-400">
                <span>Welcome, {user.full_name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
              >
                Sign In / Register
              </Button>
            )}
            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Command Center Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden px-4 pb-28 pt-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-teal-500/10 via-cyan-500/5 to-transparent blur-3xl" />

        <div className="container relative z-10 mx-auto max-w-5xl space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 opacity-30 blur-lg transition duration-500 group-hover:opacity-50" />
              <img
                src="/logo.png"
                alt="FloodGuard Visakhapatnam Smart Mitigation Shield Logo"
                className="relative h-28 w-auto rounded-2xl border border-teal-500/30 bg-slate-900/90 object-contain p-3 shadow-2xl backdrop-blur-md sm:h-36"
              />
            </div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/30 bg-slate-900/90 px-3.5 py-1.5 font-mono text-xs text-teal-400 shadow-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>
                GVMC Visakhapatnam • Predictive Data & Flood Defense Platform
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Predict, Prepare & Protect Against{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Urban Flooding
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl"
          >
            FloodGuard AI fuses Temporal Fusion Transformers, Graph Neural
            Networks, and AI Crowd Intelligence into an end-to-end command
            platform for Indian smart coastal cities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
          >
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Launch Live Command Center
              </Button>
            </Link>
            <a href="#solution" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-900 sm:w-auto"
              >
                Architecture Blueprint
              </Button>
            </a>
          </motion.div>

          {/* Hero Visual Mockup Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-12"
          >
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 font-bold text-slate-200">
                    FloodGuard Digital Twin Preview • Visakhapatnam
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center text-emerald-400">
                    <Activity className="mr-1 h-3 w-3" /> 100K Events/Sec
                  </span>
                  <span className="font-bold text-cyan-400">
                    LIVE SIMULATION
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="font-mono text-xs uppercase text-slate-400">
                    AI Flood Risk Score
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-red-500">
                    92 / 100
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Ward 14 (Gajuwaka Industrial Zone)
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="font-mono text-xs uppercase text-slate-400">
                    TFT Forecast Horizon
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-cyan-400">
                    +78 cm
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Water Depth Expected at 18:00 IST
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="font-mono text-xs uppercase text-slate-400">
                    Safe Evacuation Route
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-emerald-400">
                    GNN Path EV-04
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Bypasses Flooded NH-16 Intersection
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section
        id="problem"
        className="border-t border-slate-800 bg-slate-900/40 px-4 py-20"
      >
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <Badge variant="destructive">THE COASTAL FLOODING CRISIS</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Indian Coastal Cities Face Millions in Annual Flood Damage &
              Preventable Loss of Life
            </h2>
            <p className="text-base text-slate-400">
              Rapid urbanization, inadequate drainage systems, and intensifying
              cyclonic depressions in the Bay of Bengal expose cities like
              Visakhapatnam to severe monsoon inundation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-slate-800 bg-slate-950 text-slate-100">
              <CardHeader>
                <CardTitle className="text-red-400">
                  Reactive Emergency Ops
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Traditional response relies on delayed phone calls after
                  streets are already submerged.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-400">
                <p>
                  • Zero predictive early-warning capability at street level.
                </p>
                <p>
                  • Emergency responders dispatch blindly into flooded
                  bottlenecks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950 text-slate-100">
              <CardHeader>
                <CardTitle className="text-amber-400">
                  Siloed Municipal Data
                </CardTitle>
                <CardDescription className="text-slate-400">
                  IMD weather forecasts, sensor feeds, and citizen complaints
                  exist in disconnected silos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-400">
                <p>
                  • Manual cross-referencing delays evacuation decisions by
                  hours.
                </p>
                <p>
                  • Shelter capacity tracking is updated manually on paper
                  logbooks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950 text-slate-100">
              <CardHeader>
                <CardTitle className="text-cyan-400">
                  Information Blackout for Citizens
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Citizens lack localized, language-accessible guidance during
                  high stress evacuations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-400">
                <p>
                  • Panic leads citizens into submerged underpasses and live
                  electrical hazards.
                </p>
                <p>
                  • Lack of regional language support (Telugu/Hindi) for
                  low-literacy communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION OVERVIEW */}
      <section id="solution" className="border-t border-slate-800 px-4 py-20">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <Badge variant="secondary">SOLUTION ARCHITECTURE</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Transforming Flood Management from Reactive Chaos to Predictive
              Intelligence
            </h2>
            <p className="text-base text-slate-400">
              FloodGuard AI unifies sensor data, meteorological models, and
              citizen reports into real-time risk scores and dynamic evacuation
              guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-teal-400">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI Street-Level Prediction
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Temporal Fusion Transformers forecast water level changes at
                    1h, 6h, 24h, and 72h horizons across every city ward.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-400">
                  <Navigation className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Graph Neural Evacuation Routing
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    GNN road graph models recalculate safe evacuation routes in
                    real-time, preventing evacuees from entering flooded roads.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-blue-400">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI Crowd Report Verification
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    YOLOv11 object detection and BLIP-2 vision-language models
                    instantly estimate flood depth and damage from citizen
                    photos.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Platform Overview Box */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-slate-400">
                End-to-End Data Pipeline
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-300">
                    1. Ingestion: Weather APIs + IoT Sensors
                  </span>
                  <span className="text-teal-400">15 min interval</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-300">
                    2. XGBoost + TFT Model Inference
                  </span>
                  <span className="text-cyan-400">&lt; 3.0s latency</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-300">
                    3. Spatial Risk Grid & GIS Polyline Generation
                  </span>
                  <span className="text-blue-400">PostGIS 3.4</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-300">
                    4. Realtime Broadcast & Command Dispatch
                  </span>
                  <span className="text-emerald-400">WebSocket / SMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES (11 Capabilities) */}
      <section
        id="features"
        className="border-t border-slate-800 bg-slate-900/40 px-4 py-20"
      >
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <Badge
              variant="outline"
              className="border-teal-500/40 text-teal-400"
            >
              PLATFORM CAPABILITIES
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              11 Core Modules Engine Powering Disaster Resilience
            </h2>
            <p className="text-base text-slate-400">
              Designed to serve citizens, municipal officials, emergency
              responders, and system administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <TrendingUp className="h-5 w-5 text-teal-400" />,
                title: '1. AI Flood Risk Scoring',
                desc: 'XGBoost ensemble model computing 0-100 ward risk scores based on terrain, slope, drainage, and rain.',
              },
              {
                icon: <CloudRain className="h-5 w-5 text-cyan-400" />,
                title: '2. Street Prediction (TFT)',
                desc: 'Temporal Fusion Transformer providing 1h, 6h, 24h, 72h water depth predictions with confidence bounds.',
              },
              {
                icon: <Navigation className="h-5 w-5 text-blue-400" />,
                title: '3. Smart Evacuation Routing',
                desc: 'Graph Neural Networks recalculating multi-modal safe evacuation routes around active flood zones.',
              },
              {
                icon: <Building2 className="h-5 w-5 text-emerald-400" />,
                title: '4. Shelter Engine',
                desc: 'Multi-criteria shelter matching based on proximity, live capacity, accessibility, and medical amenities.',
              },
              {
                icon: <Camera className="h-5 w-5 text-amber-400" />,
                title: '5. Crowd Photo AI Analysis',
                desc: 'YOLOv11 + BLIP-2 multi-modal pipeline detecting water depth, stranded vehicles, and debris.',
              },
              {
                icon: <Mic className="h-5 w-5 text-purple-400" />,
                title: '6. Multilingual Voice Assistant',
                desc: 'OpenAI Whisper powered voice query support in Telugu, Hindi, and English for low-literacy citizens.',
              },
              {
                icon: <LayoutDashboard className="h-5 w-5 text-red-400" />,
                title: '7. Government Command Center',
                desc: 'Real-time situational awareness dashboard for GVMC officers to track rescue dispatches.',
              },
              {
                icon: <Box className="h-5 w-5 text-indigo-400" />,
                title: '8. 3D Digital Twin Simulation',
                desc: 'Interactive 3D city terrain visualization for simulating cyclone storm surge scenarios.',
              },
              {
                icon: <History className="h-5 w-5 text-pink-400" />,
                title: '9. Historical Flood Analytics',
                desc: 'Seasonal monsoon trend analysis, damage estimates, and historical event comparison.',
              },
              {
                icon: <Activity className="h-5 w-5 text-yellow-400" />,
                title: '10. Weather & Sensor Monitoring',
                desc: 'Automated integration with IMD stations, IoT river gauges, and rain telemetry.',
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-teal-400" />,
                title: '11. Role-Based Auth & RBAC',
                desc: 'Granular permissions for Citizens, Municipal Officers, Emergency Responders, and Admins.',
              },
            ].map((feat, i) => (
              <Card
                key={i}
                className="border-slate-800 bg-slate-950 transition-all hover:scale-[1.02] hover:border-slate-700"
              >
                <CardHeader>
                  <div className="mb-2 w-fit rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                    {feat.icon}
                  </div>
                  <CardTitle className="text-base text-white">
                    {feat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {feat.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TECHNOLOGY STACK */}
      <section id="tech" className="border-t border-slate-800 px-4 py-20">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <Badge variant="secondary">PRODUCTION TECH STACK</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Enterprise Technology Stack Built for High Availability & Scale
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              {
                cat: 'Frontend',
                name: 'React 18 + Vite',
                desc: 'TypeScript, TailwindCSS, Framer Motion',
              },
              {
                cat: 'UI Library',
                name: '@floodguard/ui',
                desc: 'Custom accessible design system package',
              },
              {
                cat: 'Backend API',
                name: 'FastAPI (Python 3.11)',
                desc: 'Async execution, Pydantic v2 schemas',
              },
              {
                cat: 'Database',
                name: 'PostgreSQL 16 + PostGIS',
                desc: 'Spatial index GiST, GeoJSON support',
              },
              {
                cat: 'Cache & Queue',
                name: 'Redis 7 + Celery',
                desc: 'Async ML inference tasks & WebSocket',
              },
              {
                cat: 'AI Models',
                name: 'PyTorch + XGBoost',
                desc: 'Temporal Fusion Transformer (TFT)',
              },
              {
                cat: 'Vision AI',
                name: 'YOLOv11 + BLIP-2',
                desc: 'Image depth & hazard detection',
              },
              {
                cat: 'Voice Speech',
                name: 'Whisper large-v3',
                desc: 'Telugu, Hindi & English speech-to-text',
              },
              {
                cat: 'GIS Engine',
                name: 'Mapbox GL + CesiumJS',
                desc: '3D terrain & dynamic polyline overlays',
              },
              {
                cat: 'DevOps',
                name: 'Docker + TurboRepo',
                desc: 'PNPM Workspaces monorepo architecture',
              },
            ].map((tech, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:bg-slate-900"
              >
                <span className="block font-mono text-[10px] uppercase tracking-wider text-teal-400">
                  {tech.cat}
                </span>
                <span className="mt-1 block text-sm font-bold text-white">
                  {tech.name}
                </span>
                <span className="mt-1 block text-[11px] text-slate-400">
                  {tech.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section
        id="works"
        className="border-t border-slate-800 bg-slate-900/40 px-4 py-20"
      >
        <div className="container mx-auto max-w-5xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <Badge
              variant="outline"
              className="border-teal-500/40 text-teal-400"
            >
              OPERATIONAL WORKFLOW
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From Early Detection to Life-Saving Dispatch in Seconds
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                num: '01',
                title: 'Continuous Data Telemetry',
                desc: 'Weather stations, river sensors, satellite precipitation data, and citizen photos are ingested into the platform stream every 15 minutes.',
              },
              {
                num: '02',
                title: 'TFT & XGBoost Inference Engine',
                desc: 'AI models calculate ward-level risk scores (0-100) and forecast water depth trends for 1h, 6h, 24h, and 72h horizons.',
              },
              {
                num: '03',
                title: 'Real-time Command Visualization',
                desc: 'Municipal disaster officers see live 3D GIS heatmaps, active emergency alerts, and verified crowd reports in the dashboard.',
              },
              {
                num: '04',
                title: 'Smart Evacuation & Rescue Dispatch',
                desc: 'Citizens receive Telugu/Hindi voice alerts and GNN-optimized safe evacuation routes directly to safe shelters.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-4 rounded-xl border border-slate-800 bg-slate-950 p-6"
              >
                <span className="font-mono text-2xl font-bold text-teal-400">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SCALABILITY VISION */}
      <section
        id="scalability"
        className="border-t border-slate-800 px-4 py-20"
      >
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <Badge variant="secondary">MULTI-CITY ROADMAP</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Designed to Scale Across 10+ Coastal Smart Cities in India
            </h2>
            <p className="text-base text-slate-400">
              Initial pilot deployment in Visakhapatnam (GVMC) with architecture
              ready for multi-tenant deployment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            {[
              'Visakhapatnam (Pilot)',
              'Chennai (Greater Chennai Corp)',
              'Mumbai (MCGM)',
              'Kolkata (KMC)',
            ].map((city, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <MapPin className="mx-auto mb-2 h-6 w-6 text-teal-400" />
                <span className="block text-sm font-bold text-white">
                  {city}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  Smart City Grid Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-20 text-center">
        <div className="container mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ready to Explore the FloodGuard AI Command Center?
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-400">
            Test the live interactive prototype built for municipal officials
            and emergency response teams.
          </p>
          <div className="pt-4">
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Launch Interactive Demo Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-12 text-xs text-slate-400">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="h-5 w-5 text-teal-400" />
            <span className="text-sm font-bold text-white">
              FloodGuard AI Platform
            </span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>Aligned with NDMA Guidelines</span>
            <span>IT Act 2000 Compliant</span>
            <span className="flex items-center font-mono text-teal-400">
              <Phone className="mr-1 h-3.5 w-3.5" /> Emergency Hotline: 1077
            </span>
          </div>

          <div className="text-slate-500">
            © 2026 FloodGuard AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
