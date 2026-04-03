import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, ArrowRightLeft, AlertTriangle, ShieldAlert } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DrumPorthole from '@/components/drum/DrumPorthole';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ConversionPipeline from '@/components/invoices/ConversionPipeline';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { invoices as defaultInvoices, totalSavings } from '@/data/invoices';

const LoadPage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const [amounts, setAmounts] = useState<Record<string, number>>(
    Object.fromEntries(defaultInvoices.map((inv) => [inv.id, inv.amountUSD]))
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const invoicesWithAmounts = useMemo(
    () => defaultInvoices.map((inv) => ({
      ...inv,
      amountUSD: amounts[inv.id] ?? inv.amountUSD,
      localAmount: Math.round((amounts[inv.id] ?? inv.amountUSD) * inv.fxRate),
    })),
    [amounts]
  );

  const totalAmount = invoicesWithAmounts.reduce((s, inv) => s + inv.amountUSD, 0);

  const handleAmountChange = (id: string, value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(num) && num >= 0) {
      setAmounts((prev) => ({ ...prev, [id]: num }));
    }
  };

  return (
    <AppLayout statusText="Idle — Ready to load" statusColor="muted">
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      {/* Dashboard Stats */}
      <DashboardStats
        totalUSD={totalAmount}
        currencies={invoicesWithAmounts.length}
        vendors={invoicesWithAmounts.length}
        estimatedSavings={totalSavings}
      />

      {/* Hero */}
      <motion.div
        className="flex items-center gap-8 mb-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DrumPorthole size={160} state="idle" />
        <div>
          <h1 className="text-[2rem] leading-tight font-bold tracking-tight text-foreground mb-2 font-display">
            Load the Machine
          </h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            {invoicesWithAmounts.length} invoices loaded.{' '}
            <span className="text-teal font-semibold tabular-nums">${totalAmount.toLocaleString()}</span>{' '}
            ready for USDC conversion and routing.
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-2 tracking-wide">
            Edit amounts below. Conversion rates update in real time.
          </p>
        </div>
      </motion.div>

      {/* Invoice Table */}
      <motion.div
        className="bg-card/60 rounded-xl border border-border overflow-hidden mb-5 backdrop-blur-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Invoice ID', 'Vendor', 'Country', 'Amount (USD)', 'Conversion', 'Status'].map((col, i) => (
                <th
                  key={col}
                  className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground ${
                    i === 3 ? 'text-right' : i === 4 ? 'text-center' : i === 5 ? 'text-center' : 'text-left'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoicesWithAmounts.map((inv, i) => (
              <>
                <motion.tr
                  key={inv.id}
                  className="border-b border-border/50 last:border-0 hover:bg-primary/[0.03] transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  onClick={() => setExpandedRow(expandedRow === inv.id ? null : inv.id)}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] text-muted-foreground">{inv.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[3px] h-7 rounded-full" style={{ background: inv.regionColor }} />
                      <div>
                        <span className="text-[13px] font-medium text-foreground block">{inv.vendor}</span>
                        <span className="text-[10px] text-muted-foreground">{inv.flag} {inv.currency} · Rate: {inv.fxRate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{inv.country}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-surface-raised/60 border border-border rounded-lg px-3 py-1.5">
                      <span className="text-[10px] text-muted-foreground">$</span>
                      <input
                        type="text"
                        value={amounts[inv.id]?.toLocaleString() ?? ''}
                        onChange={(e) => handleAmountChange(inv.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent text-[13px] font-mono font-medium text-foreground tabular-nums w-20 text-right outline-none focus:text-teal transition-colors"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRow(expandedRow === inv.id ? null : inv.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-teal/8 text-teal text-[10px] font-medium hover:bg-teal/15 transition-colors border border-teal/10"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      View Route
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {inv.riskFlag === 'red' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-[10px] font-semibold uppercase tracking-wider border border-red-500/20">
                        <ShieldAlert className="w-3 h-3" />
                        High Risk
                      </span>
                    ) : inv.riskFlag === 'yellow' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 text-[10px] font-semibold uppercase tracking-wider border border-yellow-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        Caution
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-semibold uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3" />
                        Dirty
                      </span>
                    )}
                  </td>
                </motion.tr>
                {expandedRow === inv.id && (
                  <tr key={`${inv.id}-expand`} className="border-b border-border/50">
                    <td colSpan={6} className="px-5 py-4 bg-surface-raised/30">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-3 font-semibold">Conversion Pipeline</p>
                        <ConversionPipeline
                          amountUSD={inv.amountUSD}
                          amountUSDC={inv.amountUSD}
                          targetCurrency={inv.currency}
                          fxRate={inv.fxRate}
                          localAmount={inv.localAmount}
                        />
                      </motion.div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        <div className="px-5 py-3 bg-surface-raised/50 border-t border-border flex justify-between items-center">
          <span className="text-[11px] text-muted-foreground">
            Total: <span className="text-foreground font-semibold tabular-nums">${totalAmount.toLocaleString()}</span> across {invoicesWithAmounts.length} corridors
          </span>
          <span className="text-[10px] text-teal font-mono tabular-nums">
            {totalAmount.toLocaleString()} USDC
          </span>
        </div>
      </motion.div>

      <p className="text-[10px] text-muted-foreground/50 text-center mb-5 tracking-wide">
        Pre-loaded demo batch. In production, drop a PDF or CSV.
      </p>

      {/* CTA */}
      <motion.button
        onClick={() => navigateWithWater('/wash')}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-tight hover:brightness-110 transition-all glow-blue flex items-center justify-center gap-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        Start Wash Cycle
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </AppLayout>
  );
};

export default LoadPage;
