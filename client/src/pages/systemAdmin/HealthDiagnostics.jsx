import { useState, useEffect } from 'react';
import { 
  HiOutlineArrowPath, 
  HiOutlineHeart, 
  HiOutlineCircleStack, 
  HiOutlineExclamationCircle, 
  HiOutlineCpuChip, 
  HiOutlineLockClosed 
} from 'react-icons/hi2';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getHealthDiagnosticsApi } from '../../api/models/systemAdmin.api';

export default function HealthDiagnostics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHealth = () => {
    setLoading(true);
    setError('');
    getHealthDiagnosticsApi()
      .then((res) => {
        setData(res.data?.data || null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch detailed health diagnostics');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const overallStatus = data?.status || 'unknown';
  let overallColor = 'badge-neutral';
  let overallBg = 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800';
  if (overallStatus === 'ok') {
    overallColor = 'badge-success text-emerald-700 bg-emerald-100';
    overallBg = 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50';
  } else if (overallStatus === 'degraded') {
    overallColor = 'badge-warning text-amber-700 bg-amber-100';
    overallBg = 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50';
  } else if (overallStatus === 'down') {
    overallColor = 'badge-error text-rose-700 bg-rose-100';
    overallBg = 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50';
  }

  const infraChecks = data?.checks?.infra ? Object.entries(data.checks.infra) : [];
  const moduleChecks = data?.checks?.modules ? Object.entries(data.checks.modules) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-headline-lg font-headline-lg text-on-surface dark:text-zinc-100 text-[24px] font-bold tracking-tight">
            Detailed Infrastructure Diagnostics
          </h2>
          <p className="text-body-md text-on-surface-variant dark:text-zinc-400 text-[14px]">
            Live connectivity checks, write transaction verifications, external gateways, and system parameters.
          </p>
        </div>
        <Button onClick={fetchHealth} variant="primary" loading={loading}>
          <HiOutlineArrowPath className="text-lg" /> Refresh Diagnostics
        </Button>
      </div>

      {error && (
        <div className="alert alert-error rounded-lg flex items-center gap-2 shadow-xs text-xs">
          <HiOutlineExclamationCircle className="text-lg shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="h-32 skeleton rounded-lg"></div>
            <div className="h-72 skeleton rounded-lg"></div>
          </div>
          <div className="lg:col-span-8">
            <div className="h-[450px] skeleton rounded-lg"></div>
          </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: System Status Overview */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status card */}
            <div className={`p-6 rounded-2xl border flex items-center justify-between ${overallBg}`}>
              <div className="space-y-1.5">
                <span className="text-xs text-on-surface-variant dark:text-zinc-400 uppercase tracking-widest font-bold">Platform State</span>
                <h3 className="text-3xl font-black text-on-surface dark:text-zinc-100 tracking-tight flex items-center gap-2">
                  <HiOutlineHeart className={overallStatus === 'ok' ? 'text-emerald-500 animate-pulse' : overallStatus === 'degraded' ? 'text-amber-500' : 'text-rose-500'} />
                  {overallStatus.toUpperCase()}
                </h3>
              </div>
              <div className={`badge ${overallColor} font-bold px-3 py-2 text-xs`}>
                Diagnostics Check
              </div>
            </div>

            {/* Platform metrics */}
            <Card className="p-4 flex flex-col gap-4">
              <h4 className="font-bold text-sm text-on-surface dark:text-zinc-200 border-b border-border-base dark:border-zinc-900 pb-2 flex items-center gap-1.5">
                <HiOutlineCpuChip className="text-lg text-primary" /> System Details
              </h4>
              <div className="text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-border-base/50 dark:border-zinc-900/50">
                  <span className="text-on-surface-variant">Diagnostics Timestamp</span>
                  <span className="font-mono">{new Date(data.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-base/50 dark:border-zinc-900/50">
                  <span className="text-on-surface-variant">Runtime Uptime</span>
                  <span className="font-semibold">{Math.floor(data.uptime / 3600)}h {Math.floor((data.uptime % 3600) / 60)}m {Math.floor(data.uptime % 60)}s</span>
                </div>
                {data.checks?.infra?.diskSpace && (
                  <div className="py-1">
                    <span className="text-on-surface-variant block mb-1">Local SSD Disk Space</span>
                    <span className="font-mono text-zinc-500 dark:text-zinc-400 text-[11px] block bg-zinc-550/5 dark:bg-zinc-900/50 p-2 rounded-lg border border-border-base dark:border-zinc-900">
                      {data.checks.infra.diskSpace.details}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Infrastructure Checks */}
            <Card className="p-4 flex flex-col gap-4">
              <h4 className="font-bold text-sm text-on-surface dark:text-zinc-200 border-b border-border-base dark:border-zinc-900 pb-2 flex items-center gap-1.5">
                <HiOutlineCircleStack className="text-lg text-primary" /> Core Integrations
              </h4>
              <div className="space-y-3.5">
                {infraChecks
                  .filter(([key]) => key !== 'diskSpace')
                  .map(([name, check]) => {
                    let statusVariant = 'neutral';
                    if (check.status === 'ok') statusVariant = 'success';
                    if (check.status === 'down') statusVariant = 'error';

                    return (
                      <div key={name} className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-xs text-on-surface dark:text-zinc-200 capitalize">{name}</span>
                          <span className="text-[10px] text-on-surface-variant block leading-snug">{check.details}</span>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={statusVariant} className="text-[10px] uppercase font-mono">{check.status}</Badge>
                          {check.responseTimeMs !== undefined && (
                            <span className="text-[10px] text-zinc-400 block font-mono">{check.responseTimeMs}ms</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>

          {/* Right Column: Database Model checks */}
          <Card className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border-base dark:border-zinc-900 pb-2">
              <h4 className="font-bold text-sm text-on-surface dark:text-zinc-200 flex items-center gap-1.5">
                <HiOutlineCpuChip className="text-lg text-primary" /> Mongoose Models Read/Write Verifications
              </h4>
              <Badge variant="info" className="text-xs">Deep Write Mode Active</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {moduleChecks.map(([name, check]) => {
                let checkVariant = 'neutral';
                if (check.status === 'ok') checkVariant = 'success';
                if (check.status === 'down') checkVariant = 'error';

                // Identify if read-only or read/write
                const isReadOnly = check.details?.includes('Read check succeeded') || check.details?.includes('read-only');

                return (
                  <div key={name} className="p-3 rounded-xl border border-border-base dark:border-zinc-900 flex justify-between items-start gap-4 bg-surface-container-lowest dark:bg-zinc-950/20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs capitalize text-on-surface dark:text-zinc-200">{name}</span>
                        {isReadOnly && (
                          <span className="badge badge-xs badge-ghost text-[8px] font-semibold flex items-center gap-0.5" title="Relational Model - Run as Read-only to avoid FKey errors">
                            <HiOutlineLockClosed className="text-[9px]" /> R/O
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-on-surface-variant block leading-snug">{check.details}</span>
                    </div>
                    
                    <div className="text-right space-y-1 shrink-0">
                      <Badge variant={checkVariant} className="text-[9px] uppercase font-mono">{check.status}</Badge>
                      <span className="text-[9px] text-zinc-400 block font-mono">{check.responseTimeMs}ms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-xs text-on-surface-variant">Click Refresh Diagnostics to pull live metrics from the backend.</p>
        </Card>
      )}
    </div>
  );
}
