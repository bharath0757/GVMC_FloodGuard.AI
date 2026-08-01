import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Building2, Phone, PlusCircle, ShieldAlert,
  Bot, FileText
} from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@floodguard/ui';
import { useNotifications, useMyReports } from '@/hooks/use-citizen-queries';

interface Props {
  onOpenReportModal: () => void;
  onOpenAssistant: () => void;
}

export const CitizenPortalTab: React.FC<Props> = ({ onOpenReportModal, onOpenAssistant }) => {
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
      <div className="p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-slate-950 via-teal-950/20 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Citizen Emergency & Safety Portal</span>
          </div>
          <h2 className="text-xl font-bold text-white">Monsoon Flood Guard Center</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Report flood incidents, ask AI Assistant for real-time safety guidance, and view municipal emergency alerts for your ward.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Reports & Latest Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. My Reports Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">My Submitted Incident Reports ({reports.length})</span>
              <Button variant="outline" size="sm" onClick={onOpenReportModal} leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
                Submit New Report
              </Button>
            </div>

            {reports.length === 0 ? (
              <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/60 text-center text-slate-400 space-y-2">
                <FileText className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs font-mono">No reports submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <motion.div
                    key={rep.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{rep.title}</span>
                        <Badge variant={rep.severity === 'Critical' ? 'destructive' : 'warning'}>{rep.severity}</Badge>
                      </div>
                      <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${statusColors[rep.status]}`}>
                        {rep.status}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">{rep.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                      <span>📍 Ward: {rep.ward_name}</span>
                      <span>💧 Depth: {rep.water_depth_cm} cm</span>
                      <span>Priority: <strong className="text-teal-400">{rep.priority}</strong></span>
                      <span>{new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {rep.internal_notes && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-teal-300">
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
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">Latest System & Ward Alerts</span>
              <span className="text-[10px] font-mono text-teal-400">Live Notification Feed</span>
            </div>

            <div className="space-y-2">
              {(notifData?.notifications || []).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border flex items-start space-x-3 ${
                    notif.severity === 'Critical'
                      ? 'bg-red-950/20 border-red-500/30 text-red-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${notif.severity === 'Critical' ? 'text-red-400 animate-pulse' : 'text-teal-400'}`} />
                  <div className="space-y-0.5 text-xs font-mono flex-1">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{notif.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{notif.message}</p>
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
                <CardTitle className="text-sm text-emerald-400 font-mono uppercase">Recommended Shelter</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div className="font-bold text-base text-white">Gajuwaka Sports Stadium</div>
              <div className="text-slate-300">Ward: <strong>Gajuwaka</strong></div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Capacity Utilization</span>
                  <span className="text-emerald-400">950 / 1200 (79%)</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '79%' }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-slate-300">
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

              <Button variant="outline" size="sm" className="w-full mt-2" onClick={onOpenAssistant}>
                Ask Assistant for Directions →
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Helpline Contacts */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <CardTitle className="text-sm text-white font-mono uppercase">24x7 Emergency Helplines</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              {[
                { label: 'GVMC Disaster Cell', phone: '1077', detail: 'Toll-Free Control Room' },
                { label: 'NDRF Rescue Squad', phone: '0891-2567890', detail: 'Flood Evacuation' },
                { label: 'Fire & Rescue Service', phone: '101', detail: 'Emergency Response' },
                { label: 'Ambulance Medical', phone: '108', detail: 'Medical Emergency' },
              ].map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{c.label}</div>
                    <div className="text-[10px] text-slate-500">{c.detail}</div>
                  </div>
                  <a href={`tel:${c.phone}`} className="font-bold text-teal-400 hover:underline">
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
