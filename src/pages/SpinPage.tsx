import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ConversionPipeline from '@/components/invoices/ConversionPipeline';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import { invoices as defaultInvoices } from '@/data/invoices';
import { checkCountryCompliance, ComplianceResult } from '@/lib/api';

const riskIcon = (level: ComplianceResult['risk_level']) => {
  if (level === 'blocked') return <ShieldX className="w-3.5 h-3.5 text-destructive" />;
  if (level === 'high')    return <ShieldAlert className="w-3.5 h-3.5 text-warning" />;
  if (level === 'medium')  return <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />;
  return <ShieldCheck className="w-3.5 h-3.5 text-success" />;
};

const riskLabel: Record<ComplianceResult['risk_level'], string> = {
  blocked: 'BLOCKED',
  high:    'HIGH RISK',
  medium:  'MEDIUM RISK',
  low:     'COMPLIANT',
};

const riskColor: Record<ComplianceResult['risk_level'], string> = {
  blocked: 'text-destructive',
  high:    'text-warning',
  medium:  'text-yellow-400',
  low:     'text-success',
};

const SpinPage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { analysisResult, wallets, activeSenderId } = useLaundryStore();

  const activeSender = wallets.find((w) => w.id === activeSenderId && w.role === 'sender')
    ?? wallets.find((w) => w.role === 'sender');

  const [complianceResults, setComplianceResults] = useState<ComplianceResult[]>([]);
  const [complianceLoading, setComplianceLoading] = useState(true);
  const [complianceError, setComplianceError] = useState<string | null>(null);

  const routes = analysisResult?.routes ?? [];
  const summary = analysisResult?.batch_summary;
  const totalLaundryCost = summary?.total_optimized_cost ?? 0;
  const totalSavings = summary?.total_savings ?? 0;

  useEffect(() => {
    if (routes.length === 0) {
      setComplianceLoading(false);
      return;
    }
    const destinations = routes.map((r) => ({
      country: r.country,
      countryCode: defaultInvoices.find((d) => d.id === r.invoice_id)?.countryCode ?? '',
      amount_usd: r.amount_usd,
    }));
    checkCountryCompliance(destinations)
      .then(setComplianceResults)
      .catch((e: unknown) => setComplianceError(e instanceof Error ? e.message : 'Compliance check failed'))
      .finally(() => setComplianceLoading(false));
  }, [routes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasBlocked = complianceResults.some((r) => r.risk_level === 'blocked');
  const hasHighRisk = complianceResults.some((r) => r.risk_level === 'high');
  const complianceByCountry = Object.fromEntries(complianceResults.map((r) => [r.country, r]));

  return (
    <AppLayout
      statusText={
        complianceLoading
          ? 'Running MiniMax compliance check...'
          : hasBlocked
          ? 'Compliance blocked'
          : hasHighRisk
          ? 'High-risk destinations detected'
          : 'Compliance cleared'
      }
      statusColor={complianceLoading ? 'muted' : hasBlocked ? 'red' : hasHighRisk ? 'yellow' : 'green'}
    >
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card-elevated rounded-xl overflow-hidden">
          {/* Perforated top edge */}
          <div className="h-3 bg-muted/20" style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 40%, 98% 100%, 96% 40%, 94% 100%, 92% 40%, 90% 100%, 88% 40%, 86% 100%, 84% 40%, 82% 100%, 80% 40%, 78% 100%, 76% 40%, 74% 100%, 72% 40%, 70% 100%, 68% 40%, 66% 100%, 64% 40%, 62% 100%, 60% 40%, 58% 100%, 56% 40%, 54% 100%, 52% 40%, 50% 100%, 48% 40%, 46% 100%, 44% 40%, 42% 100%, 40% 40%, 38% 100%, 36% 40%, 34% 100%, 32% 40%, 30% 100%, 28% 40%, 26% 100%, 24% 40%, 22% 100%, 20% 40%, 18% 100%, 16% 40%, 14% 100%, 12% 40%, 10% 100%, 8% 40%, 6% 100%, 4% 40%, 2% 100%, 0 40%)'
          }} />

          <div className="p-8">
            <h2 className="text-base font-bold mb-1 font-mono uppercase tracking-wider" style={{ color: '#0F172A' }}>Pending Laundry Run</h2>
            <div className="my-4" style={{ height: '2px', background: 'linear-gradient(90deg, #14B8A6, transparent)' }} />

            <div className="space-y-2.5 font-mono text-[12px]">
              {[
                ['Batch ID', `LND-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`],
                ['Date', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                ['Sender Wallet', activeSender?.id ?? 'crossmint:company-hq-wallet'],
                ['Recipients', `${routes.length} vendor wallets`],
                ['Total', `$${totalLaundryCost.toLocaleString()} (via USDC routing)`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`text-foreground ${label === 'Total' ? 'text-teal font-semibold' : ''}`}>{val}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground/50 mt-4 mb-2 uppercase tracking-widest">{routes.length} payments queued</p>

            <div className="border-t border-dashed border-border/40 my-4" />

            {/* MiniMax Compliance Check Header */}
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {complianceLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>MiniMax compliance scan running...</span>
                </>
              ) : complianceError ? (
                <span className="text-yellow-400">Compliance check unavailable</span>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                  <span>MiniMax compliance scan complete</span>
                </>
              )}
            </div>

            {hasBlocked && (
              <div className="mb-4 px-3 py-2 rounded-lg border border-destructive/30 bg-destructive/8 font-mono text-[11px] text-destructive">
                One or more destinations are under active sanctions. Transfer blocked.
              </div>
            )}
            {!hasBlocked && hasHighRisk && (
              <div className="mb-4 px-3 py-2 rounded-lg border border-warning/30 bg-warning/8 font-mono text-[11px] text-warning">
                High-risk destination detected. Enhanced due diligence required.
              </div>
            )}

            <div className="space-y-4">
              {routes.map((route) => {
                const inv = defaultInvoices.find((d) => d.id === route.invoice_id) ?? defaultInvoices[0];
                const compliance = complianceByCountry[route.country];
                return (
                  <motion.div
                    key={route.invoice_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex justify-between items-center font-mono text-[12px] mb-1.5">
                      <span className="text-foreground font-medium">{route.vendor}</span>
                      <div className="flex items-center gap-2">
                        {compliance && !complianceLoading && (
                          <div
                            className={`flex items-center gap-1 ${riskColor[compliance.risk_level]}`}
                            title={compliance.reason}
                          >
                            {riskIcon(compliance.risk_level)}
                            <span className="text-[9px] font-semibold tracking-wider">
                              {riskLabel[compliance.risk_level]}
                            </span>
                          </div>
                        )}
                        <span className="text-foreground tabular-nums">${route.optimized_cost.toLocaleString()}</span>
                        <span className="text-[9px] text-teal font-semibold tracking-wider">USDC</span>
                      </div>
                    </div>
                    {compliance && !complianceLoading && compliance.risk_level !== 'low' && (
                      <p className={`font-mono text-[10px] mb-1.5 ${riskColor[compliance.risk_level]}`}>
                        {compliance.reason}
                      </p>
                    )}
                    {inv && (
                      <p className="text-[10px] text-muted-foreground/50 font-mono mb-1.5">
                        {'→'} crossmint:{inv.walletSlug}
                      </p>
                    )}
                    {inv && (
                      <ConversionPipeline
                        amountUSD={route.amount_usd}
                        amountUSDC={route.amount_usd}
                        targetCurrency={inv.currency}
                        fxRate={inv.fxRate}
                        localAmount={inv.localAmount}
                        compact
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="border-t border-dashed border-border/40 my-4" />

            <div className="flex justify-between font-mono text-[12px]">
              <span className="text-muted-foreground">Savings confirmed</span>
              <span className="text-success font-bold tabular-nums">${totalSavings.toLocaleString()}</span>
            </div>
          </div>

          {/* Perforated bottom edge */}
          <div className="h-3 bg-muted/20" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 60%, 98% 0, 96% 60%, 94% 0, 92% 60%, 90% 0, 88% 60%, 86% 0, 84% 60%, 82% 0, 80% 60%, 78% 0, 76% 60%, 74% 0, 72% 60%, 70% 0, 68% 60%, 66% 0, 64% 60%, 62% 0, 60% 60%, 58% 0, 56% 60%, 54% 0, 52% 60%, 50% 0, 48% 60%, 46% 0, 44% 60%, 42% 0, 40% 60%, 38% 0, 36% 60%, 34% 0, 32% 60%, 30% 0, 28% 60%, 26% 0, 24% 60%, 22% 0, 20% 60%, 18% 0, 16% 60%, 14% 0, 12% 60%, 10% 0, 8% 60%, 6% 0, 4% 60%, 2% 0, 0 60%)'
          }} />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigateWithWater('/wash')}
            className="flex-1 py-3 rounded-xl btn-ghost flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <motion.button
            onClick={() => !hasBlocked && !complianceLoading && navigateWithWater('/rinse')}
            disabled={complianceLoading || hasBlocked}
            className={`flex-[2] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${
              complianceLoading || hasBlocked
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : 'btn-brand'
            }`}
            whileHover={!complianceLoading && !hasBlocked ? { scale: 1.005 } : {}}
            whileTap={!complianceLoading && !hasBlocked ? { scale: 0.985 } : {}}
          >
            {complianceLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking compliance...
              </>
            ) : hasBlocked ? (
              <>
                <ShieldX className="w-4 h-4" />
                Transfer Blocked
              </>
            ) : (
              <>
                Execute Wash Run
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default SpinPage;
