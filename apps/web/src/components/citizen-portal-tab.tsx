import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Building2,
  Phone,
  PlusCircle,
  ShieldAlert,
  Bot,
  FileText,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@floodguard/ui';
import { useNotifications, useMyReports } from '@/hooks/use-citizen-queries';

interface Props {
  onOpenReportModal: () => void;
  onOpenAssistant: () => void;
}

export const CitizenPortalTab: React.FC<Props> = ({
  onOpenReportModal,
  onOpenAssistant,
}) => {
  const { data: notifData } = useNotifications();
  const { data: reports = [] } = useMyReports();

  const statusColors: Record<string, string> = {
    Verified: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    Pending: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    Rejected: 'bg-red-500/10 border-red-500/30 text-red-400',
    Resolved: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-slate-950 via-teal-950/20 to-slate-950 p-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 font-mono text-xs text-teal-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Citizen Emergency & Safety Portal</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Monsoon Flood Guard Center
          </h2>
          <p className="max-w-xl text-xs text-slate-400">
            Report flood incidents, ask AI Assistant for real-time safety
            guidance, and view municipal emergency alerts for your ward.
          </p>
        </div>

        <div className="flex shrink-0 items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenAssistant}
            leftIcon={<Bot className="h-4 w-4" />}
          >
            Ask AI Assistant
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onOpenReportModal}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Report Flood Incident
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Reports & Latest Alerts */}
        <div className="space-y-6 lg:col-span-2">
          {/* 1. My Reports Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-slate-400">
                My Submitted Incident Reports ({reports.length})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenReportModal}
                leftIcon={<PlusCircle className="h-3.5 w-3.5" />}
              >
                Submit New Report
              </Button>
            </div>

            {reports.length === 0 ? (
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
                <FileText className="mx-auto h-8 w-8 text-slate-600" />
                <p className="font-mono text-xs">No reports submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <motion.div
                    key={rep.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">
                          {rep.title}
                        </span>
                        <Badge
                          variant={
                            rep.severity === 'Critical'
                              ? 'destructive'
                              : 'warning'
                          }
                        >
                          {rep.severity}
                        </Badge>
                      </div>
                      <div
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${statusColors[rep.status]}`}
                      >
                        {rep.status}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">{rep.description}</p>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 font-mono text-[11px] text-slate-400">
                      <span>📍 Ward: {rep.ward_name}</span>
                      <span>💧 Depth: {rep.water_depth_cm} cm</span>
                      <span>
                        Priority:{' '}
                        <strong className="text-teal-400">
                          {rep.priority}
                        </strong>
                      </span>
                      <span>
                        {new Date(rep.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {rep.internal_notes && (
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-2 font-mono text-[11px] text-teal-300">
                        💬 Municipal Note: {rep.internal_notes}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* 2. System Notification Alerts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-slate-400">
                Latest System & Ward Alerts
              </span>
              <span className="font-mono text-[10px] text-teal-400">
                Live Notification Feed
              </span>
            </div>

            <div className="space-y-2">
              {(notifData?.notifications || []).map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start space-x-3 rounded-xl border p-3 ${
                    notif.severity === 'Critical'
                      ? 'border-red-500/30 bg-red-950/20 text-red-200'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  <Bell
                    className={`mt-0.5 h-4 w-4 shrink-0 ${notif.severity === 'Critical' ? 'animate-pulse text-red-400' : 'text-teal-400'}`}
                  />
                  <div className="flex-1 space-y-0.5 font-mono text-xs">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{notif.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(notif.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recommended Shelter & Emergency Contacts */}
        <div className="space-y-6">
          {/* Recommended Shelter Card */}
          <Card className="border-emerald-800/40 bg-emerald-950/15">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <CardTitle className="font-mono text-sm uppercase text-emerald-400">
                  Recommended Shelter
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="text-base font-bold text-white">
                Gajuwaka Sports Stadium
              </div>
              <div className="text-slate-300">
                Ward: <strong>Gajuwaka</strong>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Capacity Utilization</span>
                  <span className="text-emerald-400">950 / 1200 (79%)</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: '79%' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-800/60 pt-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>🏥 Medical First Aid</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>🍲 Food & Clean Water</span>
                  <Badge variant="secondary">Stocked</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>♿ Accessibility</span>
                  <Badge variant="secondary">Ramp Ready</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={onOpenAssistant}
              >
                Ask Assistant for Directions →
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Helpline Contacts */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <CardTitle className="font-mono text-sm uppercase text-white">
                  24x7 Emergency Helplines
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              {[
                {
                  label: 'GVMC Disaster Cell',
                  phone: '1077',
                  detail: 'Toll-Free Control Room',
                },
                {
                  label: 'NDRF Rescue Squad',
                  phone: '0891-2567890',
                  detail: 'Flood Evacuation',
                },
                {
                  label: 'Fire & Rescue Service',
                  phone: '101',
                  detail: 'Emergency Response',
                },
                {
                  label: 'Ambulance Medical',
                  phone: '108',
                  detail: 'Medical Emergency',
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5"
                >
                  <div>
                    <div className="font-bold text-slate-200">{c.label}</div>
                    <div className="text-[10px] text-slate-500">{c.detail}</div>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="font-bold text-teal-400 hover:underline"
                  >
                    {c.phone}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
