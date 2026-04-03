import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ConversionPipeline from '@/components/invoices/ConversionPipeline';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import { invoices as defaultInvoices } from '@/data/invoices';

const SpinPage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { analysisResult } = useLaundryStore();

  const routes = analysisResult?.routes ?? [];
  const summary = analysisResult?.batch_summary;
  const totalLaundryCost = summary?.total_optimized_cost ?? 0;
  const totalSavings = summary?.total_savings ?? 0;

  return (
    <AppLayout statusText="Pending execution — Review batch" statusColor="muted">
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="h-3 bg-surface-raised" style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 40%, 98% 100%, 96% 40%, 94% 100%, 92% 40%, 90% 100%, 88% 40%, 86% 100%, 84% 40%, 82% 100%, 80% 40%, 78% 100%, 76% 40%, 74% 100%, 72% 40%, 70% 100%, 68% 40%, 66% 100%, 64% 40%, 62% 100%, 60% 40%, 58% 100%, 56% 40%, 54% 100%, 52% 40%, 50% 100%, 48% 40%, 46% 100%, 44% 40%, 42% 100%, 40% 40%, 38% 100%, 36% 40%, 34% 100%, 32% 40%, 30% 100%, 28% 40%, 26% 100%, 24% 40%, 22% 100%, 20% 40%, 18% 100%, 16% 40%, 14% 100%, 12% 40%, 10% 100%, 8% 40%, 6% 100%, 4% 40%, 2% 100%, 0 40%)'
          }} />

          <div className="p-8">
            <h2 className="text-base font-bold text-foreground mb-1 font-mono uppercase tracking-wider">Pending Laundry Run</h2>
            <div className="h-px bg-border my-4" />

            <div className="space-y-2.5 font-mono text-[12px]">
              {[
                ['Batch ID', 'LND-2026-0403-001'],
                ['Date', 'April 3, 2026'],
                ['Sender Wallet', 'crossmint:company-wallet'],
                ['Total', `$${totalLaundryCost.toLocaleString()} (via USDC routing)`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`text-foreground ${label === 'Total' ? 'text-teal font-semibold' : ''}`}>{val}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground/60 mt-4 mb-2 uppercase tracking-widest">{routes.length} payments queued</p>

            <div className="border-t border-dashed border-border my-4" />

            <div className="space-y-4">
              {routes.map((route) => {
                const inv = defaultInvoices.find((d) => d.id === route.invoice_id) ?? defaultInvoices[0];
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
                        <span className="text-foreground tabular-nums">${route.optimized_cost.toLocaleString()}</span>
                        <span className="text-[9px] text-teal font-semibold tracking-wider">USDC</span>
                      </div>
                    </div>
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

            <div className="border-t border-dashed border-border my-4" />

            <div className="flex justify-between font-mono text-[12px]">
              <span className="text-muted-foreground">Savings confirmed</span>
              <span className="text-success font-bold tabular-nums">${totalSavings.toLocaleString()}</span>
            </div>
          </div>

          <div className="h-3 bg-surface-raised" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 60%, 98% 0, 96% 60%, 94% 0, 92% 60%, 90% 0, 88% 60%, 86% 0, 84% 60%, 82% 0, 80% 60%, 78% 0, 76% 60%, 74% 0, 72% 60%, 70% 0, 68% 60%, 66% 0, 64% 60%, 62% 0, 60% 60%, 58% 0, 56% 60%, 54% 0, 52% 60%, 50% 0, 48% 60%, 46% 0, 44% 60%, 42% 0, 40% 60%, 38% 0, 36% 60%, 34% 0, 32% 60%, 30% 0, 28% 60%, 26% 0, 24% 60%, 22% 0, 20% 60%, 18% 0, 16% 60%, 14% 0, 12% 60%, 10% 0, 8% 60%, 6% 0, 4% 60%, 2% 0, 0 60%)'
          }} />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigateWithWater('/wash')}
            className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted/20 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <motion.button
            onClick={() => navigateWithWater('/rinse')}
            className="flex-[2] py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-blue flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            Execute Wash Run
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default SpinPage;
