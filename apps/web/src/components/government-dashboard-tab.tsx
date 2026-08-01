import * as React from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2,
  Clock, RefreshCw, UserCheck
} from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@floodguard/ui';
import { useReports } from '@/hooks/use-api-queries';
import { useAIDashboardSummary } from '@/hooks/use-ai-queries';
import { GovernmentVerificationModal } from '@/components/government-verification-modal';
import { DetailedReport } from '@/hooks/use-citizen-queries';

export const GovernmentDashboardTab: React.FC = () => {
  const { data: rawReports = [], refetch } = useReports();
  const { data: aiSummary } = useAIDashboardSummary();

  const [selectedReport, setSelectedReport] = React.useState<DetailedReport | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Cast reports to detailed format
  const reports: DetailedReport[] = (rawReports as any[]).map((r) => ({
    id: r.id,
    user_id: r.user_id || '00000000-0000-0000-0000-000000000001',
    reporter_name: r.reporter_name || 'Citizen',
    ward_name: r.ward_name || r.ward || 'Gajuwaka',
    title: r.title,
    description: r.description,
    severity: r.severity || 'Medium',
    status: r.status || 'Pending',
    priority: r.priority || 'P2',
    resolution_status: r.resolution_status || 'Unresolved',
    water_depth_cm: r.water_depth_cm ?? 30,
    lat: r.lat ?? 17.685,
    lng: r.lng ?? 83.21,
    image_url: r.image_url,
    ai_labels: r.ai_labels || ['Waterlogging'],
    ai_confidence: r.ai_confidence ?? 0.9,
    ai_analysis: r.ai_analysis,
    internal_notes: r.internal_notes,
    verified_by: r.verified_by,
    verified_at: r.verified_at,
    upvotes: r.upvotes ?? 1,
    created_at: r.created_at || new Date().toISOString(),
  }));

  const pendingReports = reports.filter((r) => r.status === 'Pending');
  const verifiedReports = reports.filter((r) => r.status === 'Verified');
  const resolvedReports = reports.filter((r) => r.status === 'Resolved' || r.resolution_status === 'Resolved');

  const handleOpenVerify = (rep: DetailedReport) => {
    setSelectedReport(rep);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Modal */}
      <GovernmentVerificationModal
        report={selectedReport}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetch();
        }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            GVMC Flood Emergency Command Center <Badge variant="risk_critical">OFFICER DASHBOARD</Badge>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Realtime Incident Verification • Priority Dispatch • Shelter Capacity Monitoring
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
          Refresh Queue
        </Button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <Clock className="h-4 w-4" />
            <span className="text-2xl font-extrabold font-mono">{pendingReports.length}</span>
          </div>
          <span className="text-xs font-mono text-slate-300">Pending Verification</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-2xl font-extrabold font-mono">{verifiedReports.length}</span>
          </div>
          <span className="text-xs font-mono text-slate-300">Verified & Active</span>
        </div>

        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-1">
          <div className="flex items-center justify-between text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-2xl font-extrabold font-mono">{aiSummary?.critical_wards ?? 3}</span>
          </div>
          <span className="text-xs font-mono text-slate-300">Critical Wards (P0)</span>
        </div>

        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-1">
          <div className="flex items-center justify-between text-cyan-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-2xl font-extrabold font-mono">{resolvedReports.length}</span>
          </div>
          <span className="text-xs font-mono text-slate-300">Incidents Resolved</span>
        </div>
      </div>

      {/* Pending Reports Verification Queue Table */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base text-white">Pending Citizen Reports Verification Queue</CardTitle>
            <span className="text-xs font-mono text-slate-400">Review AI suggested priority, inspect photos, & dispatch rescue units</span>
          </div>
          <Badge variant="warning">{pendingReports.length} Awaiting Action</Badge>
        </CardHeader>
        <CardContent>
          {pendingReports.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-400">
              ✅ All citizen reports verified! No pending verification requests.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 text-xs font-mono">
                  <TableHead>Ward / Reporter</TableHead>
                  <TableHead>Incident Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Water Depth</TableHead>
                  <TableHead>Suggested Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReports.map((rep) => (
                  <TableRow key={rep.id} className="border-slate-800 text-xs font-mono">
                    <TableCell>
                      <div className="font-bold text-white">{rep.ward_name}</div>
                      <div className="text-[10px] text-slate-400">{rep.reporter_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-200 truncate max-w-xs">{rep.title}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{rep.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rep.severity === 'Critical' ? 'destructive' : 'warning'}>
                        {rep.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-teal-400 font-bold">{rep.water_depth_cm} cm</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-amber-400 border border-slate-700">
                        {rep.priority || 'P1'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenVerify(rep)}
                        leftIcon={<UserCheck className="h-3.5 w-3.5" />}
                      >
                        Verify / Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Verified Reports List */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-white">Verified Incidents & Active Dispatches ({verifiedReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {verifiedReports.map((rep) => (
              <div key={rep.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{rep.title}</span>
                  <Badge variant="secondary">{rep.priority}</Badge>
                </div>
                <div className="text-slate-400">Ward: <span className="text-slate-200">{rep.ward_name}</span> | Depth: <span className="text-teal-400">{rep.water_depth_cm} cm</span></div>
                {rep.internal_notes && (
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-teal-300">
                    💬 {rep.internal_notes}
                  </div>
                )}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Verified by: {rep.verified_by || 'Officer Suresh'}</span>
                  <button onClick={() => handleOpenVerify(rep)} className="text-teal-400 hover:underline">
                    Edit Notes / Resolve →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
