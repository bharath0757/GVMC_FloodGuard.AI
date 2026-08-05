import * as React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@floodguard/ui';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
      {/* Background Animated Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-30 [background-size:24px_24px]" />

      <div className="relative z-10 max-w-lg space-y-6 text-center">
        <div className="inline-block rounded-full border border-red-500/30 bg-red-500/10 p-4 text-red-500 shadow-xl">
          <ShieldAlert className="h-16 w-16" />
        </div>

        <div className="space-y-2">
          <h1 className="font-mono text-7xl font-extrabold tracking-tight text-white">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-300">
            Flood Telemetry Route Not Found
          </h2>
          <p className="text-sm text-slate-400">
            The requested spatial telemetry coordinate or URL route does not
            exist within the FloodGuard AI engine.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="default"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-900"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Return Home
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="default"
              className="w-full"
              leftIcon={<LayoutDashboard className="h-4 w-4" />}
            >
              Go to Command Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
