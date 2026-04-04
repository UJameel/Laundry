import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DrumPorthole from '@/components/drum/DrumPorthole';
import PoliceChase from '@/components/transitions/PoliceChase';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import { executeTransfers } from '@/lib/api';
import type { MockTransferResult } from '@/lib/mockWallets';

const subSteps = [
  'Converting to USDC',
  'Routing via Crossmint',
  'Settling on chain',
  'Confirming balances',
];

const RinsePage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { analysisResult, setTransferResult, transferResult } = useLaundryStore();
  const [executing, setExecuting] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [showChase, setShowChase] = useState(false);

  const dismissChase = useCallback(() => setShowChase(false), []);

  const totalLaundryCost = analysisResult?.batch_summary?.total_optimized_cost ?? 0;
  const totalSavings = analysisResult?.batch_summary?.total_savings ?? 0;

  useEffect(() => {
    if (!executing) return;

    const interval = setInterval(() => {
      setActiveStep((s) => {
        if (s >= subSteps.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 700);

    const callExecute = async () => {
      try {
        if (analysisResult?.routes) {
          const result = await executeTransfers(analysisResult.routes);
          setTransferResult(result.transfer);
        }
      } catch (e) {
        console.error('Execute failed:', e);
      }
      setTimeout(() => {
        setShowChase(true);
        setExecuting(false);
        setTimeout(() => setShowChase(false), 4000);
      }, 3000);
    };
    callExecute();

    return () => clearInterval(interval);
  }, [analysisResult, setTransferResult, executing]);

  return (
    <AppLayout
      statusText={executing ? 'Transferring USDC...' : 'Wash complete'}
      statusColor={executing ? 'teal' : 'green'}
    >
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />
      <PoliceChase isActive={showChase} onDismiss={dismissChase} />

      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          {executing ? (
            <motion.div
              key="executing"
              className="flex flex-col items-center py-8 relative"
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 35%, rgba(20, 184, 166, 0.06) 0%, transparent 55%)' }} />
              <DrumPorthole size={240} state="executing" className="mb-8 relative z-10" />
              <p className="text-base text-teal font-medium mb-6">Transferring USDC to {analysisResult?.routes?.length ?? 5} wallets...</p>
              <div className="space-y-3">
                {subSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full transition-transform duration-300 ${
                      i <= activeStep ? 'bg-teal scale-110' : 'bg-muted/50'
                    }`} />
                    <span className={`text-[13px] transition-colors ${
                      i <= activeStep ? 'text-foreground' : 'text-muted-foreground/50'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              className="flex flex-col items-center py-8 w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <DrumPorthole size={180} state="complete" className="mb-8" />

              {(() => {
                const mockResult = transferResult as unknown as MockTransferResult | null;
                const transfers = mockResult?.transfers ?? [];
                const remainingBalance = mockResult?.remaining_sender_balance;

                return (
                  <div className="glass-card-elevated rounded-xl p-8 w-full font-mono text-[12px]">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <h2 className="text-base font-bold text-foreground font-display">Wash Complete</h2>
                    </div>
                    <div className="mb-4" style={{ height: '2px', background: 'linear-gradient(90deg, #14B8A6, transparent)' }} />

                    <div className="space-y-2.5 mb-4">
                      {[
                        ['Network', 'Base (Testnet)'],
                        ['Sender', 'crossmint:company-hq-wallet'],
                        ['Transfers', `${transfers.length || analysisResult?.routes?.length || 5} payments`],
                        ['Total USDC sent', `$${totalLaundryCost.toLocaleString()} USDC`],
                        ...(remainingBalance != null ? [['Sender balance after', `$${remainingBalance.toLocaleString()} USDC`]] : []),
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground tabular-nums">{val}</span>
                        </div>
                      ))}
                    </div>

                    {transfers.length > 0 && (
                      <>
                        <div className="h-px bg-border/60 mb-3" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Transfer receipts</p>
                        <div className="space-y-3">
                          {transfers.map((tx) => (
                            <div key={tx.tx_hash} className="rounded-lg border border-border/40 px-3 py-2.5 space-y-1.5 bg-muted/5">
                              <div className="flex justify-between items-center">
                                <span className="text-foreground font-medium">{tx.vendor}</span>
                                <span className="text-success font-semibold">CONFIRMED</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>To</span>
                                <span className="text-foreground truncate max-w-[180px]">{tx.to_wallet}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Amount</span>
                                <span className="text-foreground tabular-nums">
                                  ${tx.amount_usdc.toLocaleString()} USDC {'→'} {tx.amount_local.toLocaleString()} {tx.currency}
                                </span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Tx hash</span>
                                <span className="text-foreground/60">{tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-6)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="h-px bg-border/60 my-4" />
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fees paid</span>
                        <span className="text-foreground tabular-nums">${totalLaundryCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fees avoided</span>
                        <span className="text-success font-bold tabular-nums">${totalSavings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <motion.button
                onClick={() => navigateWithWater('/briefing')}
                className="w-full mt-6 py-3.5 rounded-xl btn-brand text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.985 }}
              >
                View Full Briefing
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default RinsePage;
