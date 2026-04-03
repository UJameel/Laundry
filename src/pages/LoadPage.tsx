import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertCircle, ArrowRightLeft, AlertTriangle, ShieldAlert, Building2, X, ChevronDown } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DrumPorthole from '@/components/drum/DrumPorthole';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ConversionPipeline from '@/components/invoices/ConversionPipeline';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import { invoices as defaultInvoices, totalSavings } from '@/data/invoices';

const LoadPage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { wallets, activeSenderId, setActiveSenderId, excludedInvoiceIds, setExcludedInvoiceIds } = useLaundryStore();

  const [amounts, setAmounts] = useState<Record<string, number>>(
    Object.fromEntries(defaultInvoices.map((inv) => [inv.id, inv.amountUSD]))
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [senderOpen, setSenderOpen] = useState(false);

  const senderWallets = wallets.filter((w) => w.role === 'sender');
  const activeSender = senderWallets.find((w) => w.id === activeSenderId) ?? senderWallets[0];

  const toggleExclude = (id: string) => {
    setExcludedInvoiceIds(
      excludedInvoiceIds.includes(id)
        ? excludedInvoiceIds.filter((x) => x !== id)
        : [...excludedInvoiceIds, id]
    );
  };

  const invoicesWithAmounts = useMemo(
    () => defaultInvoices.map((inv) => ({
      ...inv,
      amountUSD: amounts[inv.id] ?? inv.amountUSD,
      localAmount: Math.round((amounts[inv.id] ?? inv.amountUSD) * inv.fxRate),
    })),
    [amounts]
  );

  const activeInvoices = invoicesWithAmounts.filter((inv) => !excludedInvoiceIds.includes(inv.id));
  const totalAmount = activeInvoices.reduce((s, inv) => s + inv.amountUSD, 0);

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
        currencies={activeInvoices.length}
        vendors={activeInvoices.length}
        estimatedSavings={totalSavings}
      />

      {/* Hero */}
      <motion.div
        className="flex items-center gap-8 mb-8"
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
            {activeInvoices.length} invoice{activeInvoices.length !== 1 ? 's' : ''} queued.{' '}
            <span className="text-teal font-semibold tabular-nums">${totalAmount.toLocaleString()}</span>{' '}
            ready for USDC conversion and routing.
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-2 tracking-wide">
            Edit amounts below. Click × to exclude a recipient from this run.
          </p>
        </div>
      </motion.div>

      {/* Sender Wallet Selector */}
      <motion.div
        className="mb-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Sender Wallet</span>
          {senderWallets.length > 1 && (
            <button
              onClick={() => setSenderOpen((o) => !o)}
              className="flex items-center gap-1 text-[10px] text-teal hover:text-teal/80 transition-colors"
            >
              Change
              <ChevronDown className={`w-3 h-3 transition-transform ${senderOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <div className="px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground">{activeSender?.label ?? 'No sender configured'}</p>
            <p className="text-[10px] font-mono text-muted-foreground truncate">{activeSender?.id ?? '—'}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[13px] font-mono font-semibold text-foreground tabular-nums">
              {activeSender?.balance.toLocaleString()} {activeSender?.currency}
            </p>
            <p className="text-[10px] text-muted-foreground">available</p>
          </div>
        </div>

        <AnimatePresence>
          {senderOpen && senderWallets.length > 1 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="p-3 space-y-1.5">
                {senderWallets.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => { setActiveSenderId(w.id); setSenderOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      w.id === activeSenderId
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-muted/20 border border-transparent'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-foreground">{w.label}</p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate">{w.id}</p>
                    </div>
                    <span className="text-[11px] font-mono text-foreground tabular-nums shrink-0">
                      {w.balance.toLocaleString()} {w.currency}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              {['Invoice ID', 'Vendor', 'Country', 'Amount (USD)', 'Conversion', 'Status', ''].map((col, i) => (
                <th
                  key={`${col}-${i}`}
                  className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground ${
                    i === 3 ? 'text-right' : i === 4 ? 'text-center' : i === 5 ? 'text-center' : i === 6 ? 'text-center w-8' : 'text-left'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoicesWithAmounts.map((inv, i) => {
              const excluded = excludedInvoiceIds.includes(inv.id);
              return (
                <>
                  <motion.tr
                    key={inv.id}
                    className={`border-b border-border/50 last:border-0 transition-colors cursor-pointer ${
                      excluded ? 'opacity-40' : 'hover:bg-primary/[0.03]'
                    }`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: excluded ? 0.4 : 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    onClick={() => !excluded && setExpandedRow(expandedRow === inv.id ? null : inv.id)}
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
                          disabled={excluded}
                          className="bg-transparent text-[13px] font-mono font-medium text-foreground tabular-nums w-20 text-right outline-none focus:text-teal transition-colors disabled:opacity-50"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!excluded) setExpandedRow(expandedRow === inv.id ? null : inv.id);
                        }}
                        disabled={excluded}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-teal/8 text-teal text-[10px] font-medium hover:bg-teal/15 transition-colors border border-teal/10 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ArrowRightLeft className="w-3 h-3" />
                        View Route
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {excluded ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/30 text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                          Excluded
                        </span>
                      ) : inv.riskFlag === 'red' ? (
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
                    <td className="px-3 py-3.5 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleExclude(inv.id); }}
                        title={excluded ? 'Re-include in batch' : 'Exclude from batch'}
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                          excluded
                            ? 'bg-teal/10 text-teal hover:bg-teal/20'
                            : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                        }`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </td>
                  </motion.tr>
                  {expandedRow === inv.id && !excluded && (
                    <tr key={`${inv.id}-expand`} className="border-b border-border/50">
                      <td colSpan={7} className="px-5 py-4 bg-surface-raised/30">
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
              );
            })}
          </tbody>
        </table>

        <div className="px-5 py-3 bg-surface-raised/50 border-t border-border flex justify-between items-center">
          <span className="text-[11px] text-muted-foreground">
            <span className="text-foreground font-semibold tabular-nums">${totalAmount.toLocaleString()}</span>
            {' '}across {activeInvoices.length} of {invoicesWithAmounts.length} corridors
            {excludedInvoiceIds.length > 0 && (
              <button
                onClick={() => setExcludedInvoiceIds([])}
                className="ml-3 text-teal hover:text-teal/80 transition-colors"
              >
                restore all
              </button>
            )}
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
        disabled={activeInvoices.length === 0}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-tight hover:brightness-110 transition-all glow-blue flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100"
        whileHover={activeInvoices.length > 0 ? { scale: 1.01 } : {}}
        whileTap={activeInvoices.length > 0 ? { scale: 0.98 } : {}}
      >
        Start Wash Cycle
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </AppLayout>
  );
};

export default LoadPage;
