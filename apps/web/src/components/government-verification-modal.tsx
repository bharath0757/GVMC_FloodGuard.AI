import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, CheckCircle2, X } from 'lucide-react';
import { Button, Badge } from '@floodguard/ui';
import {
  useVerifyReport,
  useResolveReport,
  DetailedReport,
} from '@/hooks/use-citizen-queries';

interface Props {
  report: DetailedReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GovernmentVerificationModal: React.FC<Props> = ({
  report,
  isOpen,
  onClose,
}) => {
  const verifyMutation = useVerifyReport();
  const resolveMutation = useResolveReport();

  const [priority, setPriority] = React.useState<'P0' | 'P1' | 'P2' | 'P3'>(
    'P1',
  );
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (report) {
      setPriority(report.priority || 'P1');
      setNotes(report.internal_notes || '');
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const handleVerify = (status: 'Verified' | 'Rejected') => {
    verifyMutation.mutate(
      {
        report_id: report.id,
        status,
        priority,
        internal_notes: notes,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleResolve = (resolutionStatus: 'In Progress' | 'Resolved') => {
    resolveMutation.mutate(
      {
        report_id: report.id,
        resolution_status: resolutionStatus,
        internal_notes: notes,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                Government Authority Verification
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[500px] space-y-4 overflow-y-auto p-4">
            {/* Report Overview */}
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {report.title}
                </span>
                <Badge
                  variant={
                    report.severity === 'Critical' ? 'destructive' : 'warning'
                  }
                >
                  {report.severity}
                </Badge>
              </div>
              <div className="text-slate-400">
                Ward: <span className="text-slate-200">{report.ward_name}</span>{' '}
                • Reported by{' '}
                <span className="text-slate-200">{report.reporter_name}</span>
              </div>
              <div className="rounded-lg bg-slate-900 p-2 font-sans text-xs text-slate-300">
                {report.description}
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>
                  Water Depth:{' '}
                  <strong className="text-teal-400">
                    {report.water_depth_cm} cm
                  </strong>
                </span>
                <span>
                  Current Status:{' '}
                  <strong className="text-amber-400">{report.status}</strong>
                </span>
              </div>
            </div>

            {/* AI Hazard Analysis Card */}
            {report.ai_analysis && (
              <div className="space-y-1 rounded-xl border border-teal-500/30 bg-teal-950/20 p-3 font-mono text-xs">
                <span className="text-[10px] font-bold uppercase text-teal-400">
                  AI Hazard Analysis
                </span>
                <div className="text-slate-300">
                  Category: <strong>{report.ai_analysis.category}</strong>
                </div>
                <div className="text-slate-300">
                  Suggested Priority:{' '}
                  <strong>{report.ai_analysis.suggested_priority}</strong>
                </div>
                <div className="text-slate-300">
                  Confidence:{' '}
                  <strong>
                    {((report.ai_confidence || 0.9) * 100).toFixed(0)}%
                  </strong>
                </div>
              </div>
            )}

            {/* Priority Assignment */}
            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-bold text-slate-400">
                Assign Response Priority:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['P0', 'P1', 'P2', 'P3'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`rounded-lg border py-1.5 font-mono text-xs font-bold transition-all ${
                      priority === p
                        ? p === 'P0'
                          ? 'border-red-400 bg-red-500 text-white'
                          : 'border-teal-400 bg-teal-500 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {p} {p === 'P0' ? '(Critical)' : p === 'P1' ? '(High)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-bold text-slate-400">
                Internal Dispatch Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dispatched NDRF Squad #2 with 2 water pumps..."
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-2 border-t border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleVerify('Rejected')}
                disabled={verifyMutation.isPending}
                leftIcon={<XCircle className="h-3.5 w-3.5" />}
              >
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve('Resolved')}
                disabled={resolveMutation.isPending}
                leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
              >
                Mark Resolved
              </Button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleVerify('Verified')}
              disabled={verifyMutation.isPending}
              leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
            >
              Verify & Issue Alert
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
