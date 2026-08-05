import * as React from 'react';
import {
  ShieldAlert,
  Map,
  Building2,
  Camera,
  BarChart3,
  Bell,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowUpRight,
  Download,
  Menu,
  PlusCircle,
  LogIn,
  LogOut,
  Brain,
  Bot,
  UserCheck,
  Shield,
} from 'lucide-react';
import { AIDashboard } from '@/components/ai-dashboard';
import { CitizenPortalTab } from '@/components/citizen-portal-tab';
import { GovernmentDashboardTab } from '@/components/government-dashboard-tab';
import { FloodAssistantWidget } from '@/components/flood-assistant-widget';
import { CommandCenterTab } from '@/components/command-center-tab';
import { AnalyticsTab } from '@/components/analytics-tab';
import { RightIntelligencePanel } from '@/components/right-intelligence-panel';
import {
  MOCK_CITY_OVERVIEW,
  type WardData,
  type AlertData,
  type ShelterData,
  type CrowdReportData,
} from '@/data/mockData';

import { useAuth } from '@/context/auth-context';
import { useShelters, useReports, useAlerts, useWeather, useRiskZones } from '@/hooks/use-api-queries';
import { AuthModal } from '@/components/auth-modal';
import { SubmitReportModal } from '@/components/submit-report-modal';
import { MapPlaceholder } from '@/components/map-placeholder';
import { RainfallChart } from '@/components/charts/rainfall-chart';
import { RiskDistributionChart } from '@/components/charts/risk-distribution-chart';
import { ShelterCapacityChart } from '@/components/charts/shelter-capacity-chart';
import {
  Sidebar,
  SidebarNav,
  SidebarNavItem,
  SidebarSectionTitle,
  Navbar,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  StatisticsCard,
  AnalyticsCard,
  SearchBar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useTheme,
  useToast,
} from '@floodguard/ui';

export const DashboardPage: React.FC = () => {
  const { theme, setTheme, mode, toggleEmergencyMode } = useTheme();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();

  // API Queries (connected to PostgreSQL DB endpoints with seed fallback)
  const { data: shelters = [] } = useShelters();
  const { data: reports = [] } = useReports();
  const { data: alerts = [] } = useAlerts();
  const { data: weather } = useWeather();
  const { data: wards = [] } = useRiskZones();

  const [activeTab, setActiveTab] = React.useState<'overview' | 'map' | 'command' | 'shelters' | 'reports' | 'analytics' | 'ai' | 'citizen' | 'government'>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedWardId, setSelectedWardId] = React.useState('w14');
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [assistantModalOpen, setAssistantModalOpen] = React.useState(false);

  const rawSelectedWard = (wards as unknown as Array<WardData & { ward_number?: number; ward_name?: string; risk_category?: string; water_level_cm?: number; rainfall_mm_hr?: number; elevation_meters?: number }>).find((w) => w.id === selectedWardId || w.number === 14 || w.ward_number === 14) || (wards[0] as unknown as WardData & { ward_number?: number; ward_name?: string; risk_category?: string; water_level_cm?: number; rainfall_mm_hr?: number; elevation_meters?: number }) || {};
  const selectedWard = {
    name: rawSelectedWard.name || rawSelectedWard.ward_name || 'Gajuwaka Industrial Zone',
    number: rawSelectedWard.number || rawSelectedWard.ward_number || 14,
    riskCategory: rawSelectedWard.riskCategory || rawSelectedWard.risk_category || 'Critical',
    waterLevelCm: rawSelectedWard.waterLevelCm ?? rawSelectedWard.water_level_cm ?? 68,
    rainfallMmHr: rawSelectedWard.rainfallMmHr ?? rawSelectedWard.rainfall_mm_hr ?? 54.2,
    elevationMeters: rawSelectedWard.elevationMeters ?? rawSelectedWard.elevation_meters ?? 3.2,
    population: rawSelectedWard.population || 84000,
  };

  const handleVerifyReport = (id: string) => {
    toast({
      title: 'Report Verified',
      message: `Crowd report ${id} verified in DB queue.`,
      type: 'success',
    });
  };

  const handleRejectReport = (id: string) => {
    toast({
      title: 'Report Rejected',
      message: `Crowd report ${id} marked as duplicate.`,
      type: 'warning',
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Auth Modal & Submit Report Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SubmitReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />

      {/* 1. SIDEBAR */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        brandName="FloodGuard AI"
        brandLogo={
          <img
            src="/logo.png"
            alt="FloodGuard Logo"
            className="h-8 w-auto object-contain rounded-md bg-slate-900/80 p-0.5 border border-slate-700/50"
          />
        }
      >
        <SidebarSectionTitle title="Command Center" collapsed={sidebarCollapsed} />
        <SidebarNav>
          <SidebarNavItem
            icon={<Activity className="h-4 w-4" />}
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<Shield className="h-4 w-4 text-red-400" />}
            label="Command Center"
            active={activeTab === 'command'}
            onClick={() => setActiveTab('command')}
            badge={<Badge variant="risk_critical">EMERGENCY</Badge>}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<Map className="h-4 w-4" />}
            label="Live GIS Map"
            active={activeTab === 'map'}
            onClick={() => setActiveTab('map')}
            badge={<Badge variant="risk_critical">4 Wards</Badge>}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<Building2 className="h-4 w-4" />}
            label="Shelters"
            active={activeTab === 'shelters'}
            onClick={() => setActiveTab('shelters')}
            badge={<Badge variant="secondary">{shelters.length} Open</Badge>}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<Camera className="h-4 w-4" />}
            label="Crowd Reports"
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
            badge={<Badge variant="warning">{reports.length} Reports</Badge>}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<BarChart3 className="h-4 w-4" />}
            label="Analytics & TFT"
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<Brain className="h-4 w-4" />}
            label="AI Engine"
            active={activeTab === 'ai'}
            onClick={() => setActiveTab('ai')}
            badge={<Badge variant="risk_critical">LIVE</Badge>}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<Bot className="h-4 w-4" />}
            label="Citizen Portal"
            active={activeTab === 'citizen'}
            onClick={() => setActiveTab('citizen')}
            collapsed={sidebarCollapsed}
          />
          <SidebarNavItem
            icon={<UserCheck className="h-4 w-4" />}
            label="Gov Verification"
            active={activeTab === 'government'}
            onClick={() => setActiveTab('government')}
            badge={<Badge variant="warning">Action Required</Badge>}
            collapsed={sidebarCollapsed}
          />
        </SidebarNav>
      </Sidebar>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 2. TOP NAVBAR */}
        <Navbar
          brandName="Visakhapatnam Command Center"
          brandSub="GVMC Flood Operations • Cyclone Warning Stage 3"
          isEmergency={mode === 'emergency'}
          onToggleEmergency={toggleEmergencyMode}
          leftSlot={
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="md:hidden p-2 rounded-md hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
          }
          rightActions={
            <div className="flex items-center space-x-3">
              {/* Submit Report Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (!isAuthenticated) {
                    setAuthModalOpen(true);
                  } else {
                    setReportModalOpen(true);
                  }
                }}
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Submit Report
              </Button>

              {/* Search Bar Input */}
              <div className="hidden sm:block w-56">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  shortcutHint="⌘K"
                />
              </div>

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Notification Dropdown Trigger */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                </Button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-2xl z-50 animate-in fade-in-50">
                    <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                      <span className="font-bold text-xs">Emergency Broadcasts (DB)</span>
                      <Badge variant="destructive">{alerts.length} Active</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      {(alerts as unknown as Array<AlertData & { message?: string }>).map((alt) => (
                        <div key={alt.id || alt.title} className="p-2 rounded bg-muted/50 border border-border/60">
                          <div className="font-semibold text-red-500">{alt.title}</div>
                          <div className="text-muted-foreground mt-0.5">{alt.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Auth User Menu / Login Trigger */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {user.full_name.substring(0, 2)}
                    </div>
                    <div className="hidden lg:block text-left text-xs">
                      <div className="font-bold text-foreground leading-tight">{user.full_name}</div>
                      <div className="text-[10px] text-teal-400 capitalize">{user.role} Account</div>
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in-50 text-xs">
                      <div className="p-2 border-b border-border mb-1">
                        <div className="font-bold">{user.full_name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full text-left p-2 rounded hover:bg-muted text-red-400 flex items-center space-x-2"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={() => setAuthModalOpen(true)} leftIcon={<LogIn className="h-4 w-4" />}>
                  Sign In
                </Button>
              )}
            </div>
          }
        />

        {/* 3. DASHBOARD BODY SPLIT */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Emergency Alert Callout Banner */}
            {mode === 'emergency' && (
              <Alert variant="emergency">
                <AlertTitle className="text-base font-extrabold flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" /> CRITICAL EMERGENCY BROADCAST ACTIVATED FOR GVMC
                </AlertTitle>
                <AlertDescription className="text-sm mt-1">
                  Flash flood warning issued for Wards 14 (Gajuwaka) and 8 (One Town). All disaster response units dispatched. Non-essential traffic prohibited on coastal roads.
                </AlertDescription>
              </Alert>
            )}

            {/* TOP KPI STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatisticsCard
                title="Overall City Flood Risk"
                value={`${MOCK_CITY_OVERVIEW.overallRiskScore} / 100`}
                subtitle="Visakhapatnam GVMC Region"
                trend="+14% since 08:00"
                trendDirection="up"
                variant="danger"
                icon={<ShieldAlert className="h-5 w-5 text-red-500" />}
              />
              <StatisticsCard
                title="Active Critical Wards"
                value={`${(wards as unknown as Array<WardData & { risk_category?: string }>).filter((w) => w.risk_category === 'Critical' || w.riskCategory === 'Critical').length || 4} Wards`}
                subtitle="Gajuwaka, One Town, Maharanipeta, Sheela Nagar"
                trend="Immediate Evacuation"
                trendDirection="down"
                variant="warning"
                icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
              />
              <StatisticsCard
                title="Open Relief Shelters (DB)"
                value={`${shelters.length} Shelters`}
                subtitle={`Active relief capacity in PostgreSQL DB`}
                trend="18,500 Max Capacity"
                trendDirection="neutral"
                variant="safe"
                icon={<Building2 className="h-5 w-5 text-emerald-500" />}
              />
              <StatisticsCard
                title="Crowd Reports Queue (DB)"
                value={`${reports.length} Reports`}
                subtitle="PostgreSQL DB Verified Queue"
                trend="Realtime Sync"
                trendDirection="up"
                icon={<Camera className="h-5 w-5 text-cyan-500" />}
              />
            </div>

            {/* MAIN TAB SWITCHER */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 overflow-x-auto">
                <TabsList>
                  <TabsTrigger value="overview" icon={<Activity className="h-4 w-4" />}>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="command" icon={<Shield className="h-4 w-4 text-red-400" />}>
                    Command Center
                  </TabsTrigger>
                  <TabsTrigger value="map" icon={<Map className="h-4 w-4" />}>
                    GIS Map
                  </TabsTrigger>
                  <TabsTrigger value="shelters" icon={<Building2 className="h-4 w-4" />}>
                    Shelters ({shelters.length})
                  </TabsTrigger>
                  <TabsTrigger value="reports" icon={<Camera className="h-4 w-4" />}>
                    Crowd Reports ({reports.length})
                  </TabsTrigger>
                  <TabsTrigger value="analytics" icon={<BarChart3 className="h-4 w-4" />}>
                    TFT Analytics
                  </TabsTrigger>
                  <TabsTrigger value="ai" icon={<Brain className="h-4 w-4" />}>
                    AI Engine
                  </TabsTrigger>
                  <TabsTrigger value="citizen" icon={<Bot className="h-4 w-4" />}>
                    Citizen Portal
                  </TabsTrigger>
                  <TabsTrigger value="government" icon={<UserCheck className="h-4 w-4" />}>
                    Gov Verification
                  </TabsTrigger>
                </TabsList>

                <div className="hidden xl:flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setReportModalOpen(true)} leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
                    New DB Report
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
                    Export Report
                  </Button>
                </div>
              </div>

              {/* TAB 1: OVERVIEW */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Interactive Map Card */}
                  <Card className="border-slate-800 bg-slate-900/60 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <CardTitle className="text-base font-extrabold text-white flex items-center gap-2">
                          <Map className="h-4 w-4 text-cyan-400" /> Live GIS Spatial Risk Map
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                          Visakhapatnam Wards • Realtime Water Depth & AI TFT Prediction Overlay
                        </CardDescription>
                      </div>
                      <Badge variant="risk_critical" className="font-mono text-[10px]">
                        LIVE GIS STREAM
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <MapPlaceholder
                        selectedWardId={selectedWardId}
                        onSelectWard={(id) => setSelectedWardId(id)}
                        height="480px"
                      />
                    </CardContent>
                  </Card>

                  {/* Ward Selected Inspector */}
                  <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-slate-900/90 shadow-xl">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                            SELECTED WARD #{selectedWard.number}
                          </span>
                          <Badge variant={selectedWard.riskCategory === 'Critical' ? 'risk_critical' : 'warning'}>
                            {selectedWard.riskCategory} Risk
                          </Badge>
                        </div>
                        <h4 className="text-xl font-extrabold text-white mt-0.5">{selectedWard.name}</h4>
                        <div className="text-xs text-slate-300 mt-2 flex flex-wrap gap-4 font-mono">
                          <span>Water Level: <strong className="text-red-400">{selectedWard.waterLevelCm} cm</strong></span>
                          <span>Rainfall: <strong className="text-cyan-400">{selectedWard.rainfallMmHr} mm/h</strong></span>
                          <span>Elevation: <strong>{selectedWard.elevationMeters}m</strong></span>
                          <span>Population: <strong>{selectedWard.population.toLocaleString()}</strong></span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        rightIcon={<ArrowUpRight className="h-4 w-4" />}
                        onClick={() => {
                          toast({
                            title: 'Rescue Team Dispatched',
                            message: `NDMA First Responders routed to Ward #${selectedWard.number} (${selectedWard.name}).`,
                            type: 'success',
                          });
                        }}
                      >
                        Dispatch Rescue Team
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* BOTTOM ROW CHARTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnalyticsCard title="Rainfall Trend & TFT Forecast (24h)" description="Historical observed rainfall vs TFT neural prediction horizon">
                    <RainfallChart />
                  </AnalyticsCard>

                  <AnalyticsCard title="Ward Risk Distribution Breakdown" description="Categorization of all 15 GVMC wards by flood severity score">
                    <RiskDistributionChart />
                  </AnalyticsCard>
                </div>
              </TabsContent>

              {/* TAB 2: GIS MAP */}
              <TabsContent value="map">
                <Card className="border-slate-800 bg-slate-900/60 shadow-2xl">
                  <CardHeader className="border-b border-slate-800">
                    <CardTitle className="text-white">Full Screen GIS Command Map</CardTitle>
                    <CardDescription className="text-slate-400">Multi-layer geospatial visualization for Visakhapatnam</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <MapPlaceholder height="680px" />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 3: SHELTERS */}
              <TabsContent value="shelters" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
                      <CardHeader className="border-b border-slate-800">
                        <CardTitle className="text-white">Active Relief Shelters Directory (PostgreSQL DB)</CardTitle>
                        <CardDescription className="text-slate-400">Live capacity, medical amenities, and emergency contacts</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Shelter Name</TableHead>
                              <TableHead>Ward</TableHead>
                              <TableHead>Capacity</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(shelters as unknown as Array<ShelterData & { ward_name?: string; current_occupancy?: number; contact_phone?: string; is_accessible?: boolean }>).map((sh) => (
                              <TableRow key={sh.id}>
                                <TableCell className="font-semibold text-white">
                                  {sh.name}
                                  <span className="block text-[10px] text-slate-400 font-normal">{sh.address}</span>
                                </TableCell>
                                <TableCell className="text-slate-300">{sh.ward_name || sh.wardName}</TableCell>
                                <TableCell className="font-mono text-cyan-300">
                                  {sh.current_occupancy ?? sh.currentOccupancy ?? 0} / {sh.capacity}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={sh.status === 'Near Capacity' ? 'warning' : 'safe'}>
                                    {sh.status || 'Open'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button size="sm" variant="outline">Directions</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <AnalyticsCard title="Shelter Capacity Allocation" description="Occupancy rate per shelter">
                      <ShelterCapacityChart />
                    </AnalyticsCard>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: CROWD REPORTS */}
              <TabsContent value="reports" className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800">
                    <div>
                      <CardTitle className="text-white">Crowd Report Verification Queue (PostgreSQL DB)</CardTitle>
                      <CardDescription className="text-slate-400">AI-Assisted Photo Verification (YOLOv11 + BLIP-2 Vision Models)</CardDescription>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => setReportModalOpen(true)} leftIcon={<PlusCircle className="h-4 w-4" />}>
                      Submit Report
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Title</TableHead>
                          <TableHead>Reporter & Ward</TableHead>
                          <TableHead>Est. Water Depth</TableHead>
                          <TableHead>AI Label & Confidence</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Verification Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(reports as unknown as Array<CrowdReportData & { reporter_name?: string; ward_name?: string; water_depth_cm?: number; created_at?: string; ai_labels?: string[]; ai_confidence?: number }>).map((rep) => (
                          <TableRow key={rep.id}>
                            <TableCell className="font-semibold text-white">
                              {rep.title}
                              <span className="block text-[10px] text-slate-400 font-normal">{rep.description}</span>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {rep.reporter_name || rep.reporterName || 'Anonymous Citizen'}
                              <span className="block text-[10px] text-slate-400">{rep.ward_name || rep.wardName}</span>
                            </TableCell>
                            <TableCell className="font-mono font-bold text-red-400">
                              {rep.water_depth_cm ?? rep.waterDepthEst} cm
                            </TableCell>
                            <TableCell>
                              <span className="text-xs font-mono text-cyan-300 block">
                                {Array.isArray(rep.ai_labels) ? rep.ai_labels.join(', ') : rep.ai_labels || 'Submerged Road'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Conf: {Math.round((rep.ai_confidence || 0.92) * 100)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  rep.status === 'Verified' ? 'safe' : rep.status === 'Rejected' ? 'destructive' : 'warning'
                                }
                              >
                                {rep.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {rep.status === 'Pending' ? (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="safe"
                                    onClick={() => handleVerifyReport(rep.id)}
                                    leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                                  >
                                    Verify
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleRejectReport(rep.id)}
                                    leftIcon={<XCircle className="h-3.5 w-3.5" />}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Processed</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 5: ANALYTICS */}
              <TabsContent value="analytics" className="space-y-0 pt-2">
                <AnalyticsTab />
              </TabsContent>

              {/* TAB 6: AI ENGINE */}
              <TabsContent value="ai" className="space-y-0 pt-2">
                <AIDashboard />
              </TabsContent>

              {/* TAB 9: COMMAND CENTER */}
              <TabsContent value="command" className="space-y-0 pt-2">
                <CommandCenterTab />
              </TabsContent>

              {/* TAB 7: CITIZEN PORTAL */}
              <TabsContent value="citizen" className="space-y-0 pt-2">
                <CitizenPortalTab
                  onOpenReportModal={() => setReportModalOpen(true)}
                  onOpenAssistant={() => setAssistantModalOpen(true)}
                />
              </TabsContent>

              {/* TAB 8: GOVERNMENT VERIFICATION */}
              <TabsContent value="government" className="space-y-0 pt-2">
                <GovernmentDashboardTab />
              </TabsContent>
            </Tabs>

            {/* Flood Assistant Floating Chat Widget Modal */}
            <FloodAssistantWidget
              isOpen={assistantModalOpen}
              onClose={() => setAssistantModalOpen(false)}
            />
          </main>

          {/* Right Intelligence Panel */}
          <RightIntelligencePanel
            selectedWard={selectedWard}
            weather={weather}
            sheltersCount={shelters.length}
            reportsCount={reports.length}
            onDispatchTeam={() => {
              toast({
                title: 'Evacuation Order Dispatched',
                message: `NDMA First Responders routed for Ward #${selectedWard.number}.`,
                type: 'error',
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

