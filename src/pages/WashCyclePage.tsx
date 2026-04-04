import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingDown, Droplets } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DrumPorthole from '@/components/drum/DrumPorthole';
import ConversionPipeline from '@/components/invoices/ConversionPipeline';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import { analyzeInvoices } from '@/lib/api';
import { invoices as defaultInvoices } from '@/data/invoices';
import { useMemo } from 'react';

const statusMessages = [
  'Inspecting flows...',
  'Calculating spreads...',
  'Finding clean routes...',
  'Consulting AI optimizer...',
  'Almost done...',
];

const fxSpreadMap: Record<string, { spread: number; fee: number }> = {
  'ARS': { spread: 0.05, fee: 45 },
  'EUR': { spread: 0.03, fee: 35 },
  'NGN': { spread: 0.06, fee: 75 },
  'GBP': { spread: 0.02, fee: 25 },
  'JPY': { spread: 0.03, fee: 30 },
  'TRY': { spread: 0.06, fee: 60 },
  'USD': { spread: 0.01, fee: 60 },
};

const WashCyclePage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { setAnalysisResult, analysisResult, excludedInvoiceIds } = useLaundryStore();

  const activeInvoices = useMemo(
    () => defaultInvoices.filter((inv) => !excludedInvoiceIds.includes(inv.id)),
    [excludedInvoiceIds]
  );
  const [analyzing, setAnalyzing] = useState(true);
  const [statusIndex, setStatusIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const callApi = async () => {
      try {
        const result = await analyzeInvoices({
          invoices: activeInvoices.map((inv) => ({
            id: inv.id,
            vendor: inv.vendor,
            country: inv.country,
            currency: inv.currency,
            amount_usd: inv.amountUSD,
            traditional_fx_spread: fxSpreadMap[inv.currency]?.spread ?? 0.03,
            traditional_fee: fxSpreadMap[inv.currency]?.fee ?? 30,
          })),
        });
        setAnalysisResult(result.optimization);
      } catch (e) {
        console.error('Analysis failed:', e);
        setError('Analysis failed — using fallback data');
      } finally {
        setAnalyzing(false);
      }
    };
    callApi();
  }, [setAnalysisResult]);

  useEffect(() => {
    if (!analyzing) return;
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % statusMessages.length);
    }, 700);
    return () => clearInterval(interval);
  }, [analyzing]);

  useEffect(() => {
    if (analyzing || !analysisResult) return;
    const interval = setInterval(() => {
      setVisibleCards((c) => {
        if (c >= analysisResult.routes.length) { clearInterval(interval); return c; }
        return c + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [analyzing, analysisResult]);

  const routes = analysisResult?.routes ?? [];
  const summary = analysisResult?.batch_summary;
  const allCardsVisible = visibleCards >= routes.length;

  const totalBankCost = summary?.total_traditional_cost ?? 0;
  const totalLaundryCost = summary?.total_optimized_cost ?? 0;
  const totalSavings = summary?.total_savings ?? 0;
  const savingsPercent = Math.round(summary?.savings_percentage ?? 0);

  return (
    <AppLayout
      statusText={analyzing ? statusMessages[statusIndex] : `Analysis complete — ${routes.length} routes optimized`}
      statusColor={analyzing ? 'teal' : 'green'}
    >
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      <AnimatePresence>
        {analyzing && (
          <motion.div
            className="flex flex-col items-center py-16 relative"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(20, 184, 166, 0.06) 0%, transparent 60%)' }} />
            <DrumPorthole size={200} state="analyzing" className="mb-8 relative z-10" />
            <motion.p
              className="text-base text-teal font-medium"
              key={statusIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {statusMessages[statusIndex]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-destructive text-xs text-center mb-4">{error}</p>
      )}

      {!analyzing && analysisResult && (
        <div className="space-y-3">
          <motion.h2
            className="text-xl font-bold text-foreground mb-5 font-display tracking-[-0.02em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Route Recommendations
          </motion.h2>

          {routes.map((route, i) => {
            const inv = defaultInvoices.find((d) => d.id === route.invoice_id) ?? defaultInvoices[i];
            return (
              <AnimatePresence key={route.invoice_id}>
                {i < visibleCards && (
                  <motion.div
                    className="glass-card rounded-xl p-5 hover-glow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{route.vendor}</h3>
                        <span className="text-[11px] text-muted-foreground">{inv?.flag} {inv?.currency} · ${route.amount_usd.toLocaleString()}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal/8 text-teal text-[10px] font-semibold uppercase tracking-wider border border-teal/12">
                        <Droplets className="w-3 h-3" />
                        {route.recommended_route === 'stablecoin' ? 'USDC Route' : 'Bank Route'}
                      </span>
                    </div>

                    {inv && (
                      <div className="mb-4">
                        <ConversionPipeline
                          amountUSD={route.amount_usd}
                          amountUSDC={route.amount_usd}
                          targetCurrency={inv.currency}
                          fxRate={inv.fxRate}
                          localAmount={inv.localAmount}
                          compact
                        />
                      </div>
                    )}

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground w-28 shrink-0">Traditional Bank</span>
                        <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                          <div className="h-full bg-destructive/40 rounded-full" style={{ width: '100%' }} />
                        </div>
                        <span className="text-[11px] font-mono text-destructive w-16 text-right tabular-nums">${route.traditional_cost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground w-28 shrink-0">Laundry Route</span>
                        <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-teal rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${route.traditional_cost > 0 ? (route.optimized_cost / route.traditional_cost) * 100 : 0}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-teal w-16 text-right tabular-nums">${route.optimized_cost.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-3.5 h-3.5 text-success" />
                      <span className="text-success font-bold text-sm">${route.savings.toLocaleString()} saved</span>
                      <span className="text-[10px] text-success/50">({route.traditional_cost > 0 ? Math.round((route.savings / route.traditional_cost) * 100) : 0}% cleaner)</span>
                    </div>

                    <p className="text-[10px] text-muted-foreground/60 mt-2 italic">{route.reasoning}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          <AnimatePresence>
            {allCardsVisible && (
              <motion.div
                className="glass-card-elevated rounded-xl p-8 mt-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Traditional Cost</p>
                    <p className="text-2xl font-bold text-destructive font-display tabular-nums">${totalBankCost.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-px bg-border relative">
                    <ArrowRight className="w-4 h-4 text-muted-foreground absolute -right-2 -top-2" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1">Laundry Cost</p>
                    <p className="text-2xl font-bold text-teal font-display tabular-nums">${totalLaundryCost.toLocaleString()}</p>
                  </div>
                </div>

                <div className="text-center mb-5">
                  <CountUp target={totalSavings} className="text-5xl font-bold text-foreground tracking-[-0.03em] font-display" />
                  <p className="text-xs text-muted-foreground mt-1.5">scrubbed from your payment costs</p>
                </div>

                <div className="flex justify-center mb-5">
                  <span className="px-3 py-1 rounded-lg bg-success/8 text-success text-xs font-semibold border border-success/12">
                    {savingsPercent}% cleaner than your bank
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span className="uppercase tracking-widest">Cleanliness level</span>
                    <span className="font-mono">{savingsPercent}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal to-success rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${savingsPercent}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={() => navigateWithWater('/spin')}
                  className="w-full mt-6 py-3.5 rounded-xl btn-brand text-sm flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.985 }}
                >
                  Proceed to Spin
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AppLayout>
  );
};

const CountUp = ({ target, className }: { target: number; className: string }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return <p className={className}>${value.toLocaleString()}</p>;
};

export default WashCyclePage;
