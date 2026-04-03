import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Plus, Wallet, X, ChevronDown, ChevronUp,
  Building2, User, CheckCircle2, FlaskConical,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import type { WalletEntry } from '@/hooks/useLaundryStore';

const CURRENCY_OPTIONS = [
  'USDC', 'USD', 'EUR', 'GBP', 'JPY', 'ARS', 'NGN', 'BRL', 'MXN', 'INR', 'SGD', 'AED',
];

const FLAG_MAP: Record<string, string> = {
  US: '🇺🇸', AR: '🇦🇷', DE: '🇩🇪', NG: '🇳🇬', GB: '🇬🇧', JP: '🇯🇵',
  BR: '🇧🇷', MX: '🇲🇽', IN: '🇮🇳', SG: '🇸🇬', AE: '🇦🇪',
};

function truncateAddress(address: string): string {
  if (address.startsWith('crossmint:')) return address;
  if (address.length <= 18) return address;
  return `${address.slice(0, 10)}…${address.slice(-6)}`;
}

interface WalletCardProps {
  wallet: WalletEntry;
  onRemove?: () => void;
}

const WalletCard = ({ wallet, onRemove }: WalletCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isSender = wallet.role === 'sender';
  const flag = FLAG_MAP[wallet.countryCode] ?? '🌐';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`relative rounded-xl border overflow-hidden ${
        isSender ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
      }`}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isSender ? 'bg-primary' : 'bg-teal/40'}`} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isSender ? 'bg-primary/15 text-primary' : 'bg-teal/10 text-teal'
            }`}>
              {isSender ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-semibold text-foreground">{wallet.label}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  wallet.isDemo
                    ? 'bg-muted/60 text-muted-foreground'
                    : 'bg-success/15 text-success'
                }`}>
                  {wallet.isDemo ? 'Demo' : 'Connected'}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {truncateAddress(wallet.address)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[13px] font-mono font-semibold text-foreground tabular-nums">
                {flag} {wallet.balance.toLocaleString()} {wallet.currency}
              </div>
              <div className="text-[10px] text-muted-foreground capitalize">{wallet.role}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="p-1 rounded hover:bg-muted/30 text-muted-foreground transition-colors"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {!wallet.isDemo && onRemove && (
                <button
                  onClick={onRemove}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5 font-mono text-[11px]">
                {[
                  ['Wallet ID', wallet.id],
                  ['Full Address', wallet.address],
                  ['Currency', wallet.currency],
                  ['Country', wallet.countryCode || '—'],
                  ['Network', 'Base (Testnet)'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="text-foreground/80 truncate text-right">{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------

const emptyForm = {
  label: '',
  address: '',
  currency: 'USDC',
  countryCode: '',
  balance: '',
  role: 'recipient' as 'sender' | 'recipient',
};

const WalletPage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { wallets, setWallets } = useLaundryStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const senderWallets = wallets.filter((w) => w.role === 'sender');
  const recipientWallets = wallets.filter((w) => w.role === 'recipient');

  const removeWallet = (id: string) => setWallets(wallets.filter((w) => w.id !== id));

  const handleAddWallet = () => {
    setFormError(null);
    if (!form.label.trim()) return setFormError('Label is required.');
    if (!form.address.trim()) return setFormError('Wallet address is required.');
    if (!form.currency) return setFormError('Currency is required.');

    const newWallet: WalletEntry = {
      id: `custom:${Date.now()}`,
      label: form.label.trim(),
      address: form.address.trim(),
      currency: form.currency,
      countryCode: form.countryCode.trim().toUpperCase().slice(0, 2),
      balance: parseFloat(form.balance) || 0,
      role: form.role,
      isDemo: false,
    };

    setWallets([...wallets, newWallet]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <AppLayout statusText="Wallet setup — Select accounts" statusColor="muted">
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground font-display tracking-tight">Wallet Setup</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Configure sender and recipient wallets before running a wash cycle.
            </p>
          </div>
        </div>

        {/* Demo notice */}
        <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-border/60 bg-muted/20">
          <FlaskConical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            Demo wallets are pre-loaded with mock balances on Base Testnet.
            Add real Crossmint wallet IDs below when your integration is live.
          </p>
        </div>

        {/* Sender */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Sender — {senderWallets.length} wallet{senderWallets.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {senderWallets.map((w) => (
                <WalletCard key={w.id} wallet={w} onRemove={() => removeWallet(w.id)} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Recipients */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Recipients — {recipientWallets.length} wallet{recipientWallets.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {recipientWallets.map((w) => (
                <WalletCard key={w.id} wallet={w} onRemove={() => removeWallet(w.id)} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Add Wallet */}
        <div className="mb-8">
          <button
            onClick={() => { setShowForm((s) => !s); setFormError(null); }}
            className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/40 rounded-xl px-4 py-3 w-full justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl border border-border bg-card p-5 space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    New Wallet
                  </p>

                  {/* Role toggle */}
                  <div className="flex gap-2">
                    {(['sender', 'recipient'] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setForm((f) => ({ ...f, role }))}
                        className={`flex-1 py-2 rounded-lg text-[12px] font-medium capitalize transition-colors ${
                          form.role === role
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Vendor Berlin"
                        value={form.label}
                        onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                        className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Wallet Address</label>
                      <input
                        type="text"
                        placeholder="0x… or crossmint:…"
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Currency</label>
                      <select
                        value={form.currency}
                        onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                        className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono outline-none focus:border-primary/50 transition-colors"
                      >
                        {CURRENCY_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Country Code</label>
                      <input
                        type="text"
                        placeholder="e.g. DE"
                        maxLength={2}
                        value={form.countryCode}
                        onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
                        className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors uppercase"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Starting Balance (optional)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.balance}
                        onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))}
                        className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p className="text-[11px] text-destructive font-mono">{formError}</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(null); }}
                      className="flex-1 py-2 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddWallet}
                      className="flex-[2] py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors hover:brightness-110"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Add Wallet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Continue */}
        <motion.button
          onClick={() => navigateWithWater('/')}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-blue flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue to Load Invoices
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-[10px] text-muted-foreground/50 text-center mt-4 tracking-wide">
          {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} configured ·{' '}
          {senderWallets.length} sender · {recipientWallets.length} recipient{recipientWallets.length !== 1 ? 's' : ''}
        </p>
      </motion.div>
    </AppLayout>
  );
};

export default WalletPage;
