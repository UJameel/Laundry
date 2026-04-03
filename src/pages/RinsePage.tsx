import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DrumPorthole from '@/components/drum/DrumPorthole';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import { executeTransfers } from '@/lib/api';

const subSteps = [
  'Converting to USDC',
  'Routing via Crossmint',
  'Settling on chain',
  'Confirming balances',
];

const RinsePage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { analysisResult, setTransferResult } = useLaundryStore();
  const [executing, setExecuting] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const totalLaundryCost = analysisResult?.batch_summary?.total_optimized_cost ?? 0;
  const totalSavings = analysisResult?.batch_summary?.total_savings ?? 0;

  // Call execute API and animate steps in parallel
  useEffect(() => {
    if (!executing) return;

    // Animate steps
    const interval = setInterval(() => {
      setActiveStep((s) => {
        if (s >= subSteps.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 700);

    // Call API
    const callExecute = async () => {
      try {
        if (analysisResult?.routes) {
          const result = await executeTransfers(analysisResult.routes);
          setTransferResult(result.transfer);
        }
      } catch (e) {
        console.error('Execute failed:', e);
      }
      // Wait for animation to finish before showing complete
      setTimeout(() => setExecuting(false), 3000);
    };
    callExecute();

    return () => clearInterval(interval);
  }, [analysisResult, setTransferResult, executing]);

  return (
    <AppLayout
      statusText={executing ? 'Transferring USDC to 5 wallets…' : 'Wash complete'}
      statusColor={executing ? 'teal' : 'green'}
    >
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          {executing ? (
            <motion.div
              key="executing"
              className="flex flex-col items-center py-8"
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DrumPorthole size={240} state="executing" className="mb-8" />
              <p className="text-base text-teal font-medium mb-6">Transferring USDC to {analysisResult?.routes?.length ?? 5} wallets…</p>
              <div className="space-y-3">
                {subSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i <= activeStep ? 'bg-teal scale-110' : 'bg-muted'
                    }`} />
                    <span className={`text-[13px] transition-colors ${
                      i <= activeStep ? 'text-foreground' : 'text-muted-foreground'
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

              <div className="bg-card border border-border rounded-xl p-8 w-full font-mono text-[12px]">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <h2 className="text-base font-bold text-foreground font-display">Wash Complete</h2>
                </div>
                <div className="h-px bg-border mb-4" />
                <div className="space-y-2.5">
                  {[
                    ['Transaction Hash', '0x4a3f…bc92'],
                    ['Network', 'Base (Testnet)'],
                    ['Sender', 'crossmint:company-wallet'],
                    ['Recipient', 'crossmint:contractor-wallet'],
                    ['Amount', `$${totalLaundryCost.toLocaleString()} USDC`],
                    ['Status', 'CONFIRMED'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className={`text-foreground ${label === 'Status' ? 'text-success font-semibold' : ''}`}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-border my-4" />
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

              <motion.button
                onClick={() => navigateWithWater('/briefing')}
                className="w-full mt-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-blue flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
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
