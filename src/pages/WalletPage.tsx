import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Plus, Wallet, X, ChevronDown, ChevronUp,
  Building2, User, CheckCircle2, FlaskConical, ShieldCheck,
  ShieldAlert, ShieldX, Loader2, Info,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';
import type { WalletEntry } from '@/hooks/useLaundryStore';
import { checkCountryCompliance } from '@/lib/api';

// ---------------------------------------------------------------------------
// Country list — name + ISO code + default currency
// ---------------------------------------------------------------------------
const COUNTRIES: { name: string; code: string; currency: string }[] = [
  { name: 'Argentina', code: 'AR', currency: 'ARS' },
  { name: 'Australia', code: 'AU', currency: 'AUD' },
  { name: 'Brazil', code: 'BR', currency: 'BRL' },
  { name: 'Canada', code: 'CA', currency: 'CAD' },
  { name: 'Chile', code: 'CL', currency: 'CLP' },
  { name: 'China', code: 'CN', currency: 'CNY' },
  { name: 'Colombia', code: 'CO', currency: 'COP' },
  { name: 'Egypt', code: 'EG', currency: 'EGP' },
  { name: 'Ethiopia', code: 'ET', currency: 'ETB' },
  { name: 'France', code: 'FR', currency: 'EUR' },
  { name: 'Germany', code: 'DE', currency: 'EUR' },
  { name: 'Ghana', code: 'GH', currency: 'GHS' },
  { name: 'India', code: 'IN', currency: 'INR' },
  { name: 'Indonesia', code: 'ID', currency: 'IDR' },
  { name: 'Iran', code: 'IR', currency: 'IRR' },
  { name: 'Japan', code: 'JP', currency: 'JPY' },
  { name: 'Kenya', code: 'KE', currency: 'KES' },
  { name: 'Malaysia', code: 'MY', currency: 'MYR' },
  { name: 'Mexico', code: 'MX', currency: 'MXN' },
  { name: 'Morocco', code: 'MA', currency: 'MAD' },
  { name: 'Netherlands', code: 'NL', currency: 'EUR' },
  { name: 'Nigeria', code: 'NG', currency: 'NGN' },
  { name: 'North Korea', code: 'KP', currency: 'KPW' },
  { name: 'Pakistan', code: 'PK', currency: 'PKR' },
  { name: 'Philippines', code: 'PH', currency: 'PHP' },
  { name: 'Poland', code: 'PL', currency: 'PLN' },
  { name: 'Russia', code: 'RU', currency: 'RUB' },
  { name: 'Saudi Arabia', code: 'SA', currency: 'SAR' },
  { name: 'Senegal', code: 'SN', currency: 'XOF' },
  { name: 'Singapore', code: 'SG', currency: 'SGD' },
  { name: 'South Africa', code: 'ZA', currency: 'ZAR' },
  { name: 'South Korea', code: 'KR', currency: 'KRW' },
  { name: 'Spain', code: 'ES', currency: 'EUR' },
  { name: 'Sweden', code: 'SE', currency: 'SEK' },
  { name: 'Switzerland', code: 'CH', currency: 'CHF' },
  { name: 'Tanzania', code: 'TZ', currency: 'TZS' },
  { name: 'Thailand', code: 'TH', currency: 'THB' },
  { name: 'Turkey', code: 'TR', currency: 'TRY' },
  { name: 'UAE', code: 'AE', currency: 'AED' },
  { name: 'Uganda', code: 'UG', currency: 'UGX' },
  { name: 'Ukraine', code: 'UA', currency: 'UAH' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP' },
  { name: 'United States', code: 'US', currency: 'USD' },
  { name: 'Venezuela', code: 'VE', currency: 'VES' },
  { name: 'Vietnam', code: 'VN', currency: 'VND' },
  { name: 'Zimbabwe', code: 'ZW', currency: 'ZWL' },
];

const FLAG_MAP: Record<string, string> = {
  US: '🇺🇸', AR: '🇦🇷', DE: '🇩🇪', NG: '🇳🇬', GB: '🇬🇧', JP: '🇯🇵',
  BR: '🇧🇷', MX: '🇲🇽', IN: '🇮🇳', SG: '🇸🇬', AE: '🇦🇪', FR: '🇫🇷',
  AU: '🇦🇺', CA: '🇨🇦', CL: '🇨🇱', CN: '🇨🇳', CO: '🇨🇴', EG: '🇪🇬',
  ET: '🇪🇹', GH: '🇬🇭', ID: '🇮🇩', IR: '🇮🇷', KE: '🇰🇪', KP: '🇰🇵',
  KR: '🇰🇷', MA: '🇲🇦', MY: '🇲🇾', NL: '🇳🇱', PH: '🇵🇭', PK: '🇵🇰',
  PL: '🇵🇱', RU: '🇷🇺', SA: '🇸🇦', SE: '🇸🇪', SN: '🇸🇳', ES: '🇪🇸',
  CH: '🇨🇭', TH: '🇹🇭', TR: '🇹🇷', TZ: '🇹🇿', UA: '🇺🇦', UG: '🇺🇬',
  VE: '🇻🇪', VN: '🇻🇳', ZA: '🇿🇦', ZW: '🇿🇼',
};

// ---------------------------------------------------------------------------
// Compliance badge helpers
// ---------------------------------------------------------------------------
type RiskLevel = 'low' | 'medium' | 'high' | 'blocked';

const riskBadge: Record<RiskLevel, { label: string; className: string; icon: React.ReactNode }> = {
  low:     { label: 'Compliant',   className: 'bg-success/15 text-success',      icon: <ShieldCheck className="w-3 h-3" /> },
  medium:  { label: 'Med Risk',    className: 'bg-yellow-400/15 text-yellow-400', icon: <ShieldAlert className="w-3 h-3" /> },
  high:    { label: 'High Risk',   className: 'bg-warning/15 text-warning',       icon: <ShieldAlert className="w-3 h-3" /> },
  blocked: { label: 'Blocked',     className: 'bg-destructive/15 text-destructive', icon: <ShieldX className="w-3 h-3" /> },
};

// ---------------------------------------------------------------------------
// WalletCard
// ---------------------------------------------------------------------------
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
  const risk = wallet.complianceRisk;
  const badge = risk ? riskBadge[risk] : null;

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
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[13px] font-semibold text-foreground">{wallet.label}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  wallet.isDemo ? 'bg-muted/60 text-muted-foreground' : 'bg-success/15 text-success'
                }`}>
                  {wallet.isDemo ? 'Demo' : 'Connected'}
                </span>
                {badge && (
                  <span className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${badge.className}`}>
                    {badge.icon}{badge.label}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {flag} {wallet.countryName || wallet.countryCode} · {truncateAddress(wallet.address)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[13px] font-mono font-semibold text-foreground tabular-nums">
                {wallet.balance.toLocaleString()} {wallet.currency}
              </div>
              <div className="text-[10px] text-muted-foreground capitalize">{wallet.role}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => setExpanded((e) => !e)} className="p-1 rounded hover:bg-muted/30 text-muted-foreground transition-colors">
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {!wallet.isDemo && onRemove && (
                <button onClick={onRemove} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
                  ['Country', wallet.countryName || wallet.countryCode || '—'],
                  ['Network', 'Base (Testnet)'],
                  ...(wallet.complianceReason ? [['Compliance note', wallet.complianceReason]] : []),
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="text-foreground/80 text-right">{val}</span>
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
// WalletPage
// ---------------------------------------------------------------------------
const emptyForm = {
  label: '',
  address: '',
  countryCode: '',
  currency: 'USDC',
  balance: '',
  role: 'recipient' as 'sender' | 'recipient',
};

const WalletPage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { wallets, setWallets } = useLaundryStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [checking, setChecking] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const senderWallets = wallets.filter((w) => w.role === 'sender');
  const recipientWallets = wallets.filter((w) => w.role === 'recipient');

  const removeWallet = (id: string) => setWallets(wallets.filter((w) => w.id !== id));

  const selectedCountry = COUNTRIES.find((c) => c.code === form.countryCode);

  const handleCountryChange = (code: string) => {
    const country = COUNTRIES.find((c) => c.code === code);
    setForm((f) => ({
      ...f,
      countryCode: code,
      currency: country?.currency ?? f.currency,
    }));
  };

  const handleAddWallet = async () => {
    setFormError(null);
    if (!form.label.trim()) return setFormError('Label is required.');
    if (!form.address.trim()) return setFormError('Wallet address is required.');
    if (form.role === 'recipient' && !form.countryCode) return setFormError('Country is required for recipient wallets.');

    const countryName = selectedCountry?.name ?? form.countryCode;

    // Run MiniMax compliance check for recipient wallets
    let complianceRisk: WalletEntry['complianceRisk'] = undefined;
    let complianceReason: string | undefined = undefined;

    if (form.role === 'recipient' && form.countryCode) {
      setChecking(true);
      try {
        const results = await checkCountryCompliance([{
          country: countryName,
          countryCode: form.countryCode,
          amount_usd: 0, // wallet registration — no amount yet
        }]);
        const result = results[0];
        if (result) {
          complianceRisk = result.risk_level;
          complianceReason = result.reason;
          if (result.risk_level === 'blocked') {
            setFormError(`Cannot add wallet — ${countryName} is under active sanctions (OFAC/UN/EU). Transfers are prohibited.`);
            setChecking(false);
            return;
          }
        }
      } catch {
        // Compliance API unavailable — allow add but flag for manual review
        complianceReason = 'Compliance check unavailable — manual review required before transfer.';
      } finally {
        setChecking(false);
      }
    }

    const newWallet: WalletEntry = {
      id: `custom:${Date.now()}`,
      label: form.label.trim(),
      address: form.address.trim(),
      currency: form.currency,
      countryCode: form.countryCode,
      countryName,
      balance: parseFloat(form.balance) || 0,
      role: form.role,
      isDemo: false,
      complianceRisk,
      complianceReason,
    };

    setWallets([...wallets, newWallet]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <AppLayout statusText="Wallet setup — Select accounts" statusColor="muted">
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground font-display tracking-tight">Wallet Setup</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">Configure sender and recipient wallets before running a wash cycle.</p>
          </div>
        </div>

        {/* Flow note */}
        <div className="mb-5 rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            <Info className="w-3.5 h-3.5" />
            How the transfer works
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-foreground/80 flex-wrap">
            <span className="px-2 py-1 rounded bg-primary/10 text-primary">Your USD</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="px-2 py-1 rounded bg-teal/10 text-teal">USDC on Base</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="px-2 py-1 rounded bg-surface-raised border border-border text-foreground">Recipient wallet overseas</span>
          </div>
          <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
            Crossmint converts USD → USDC, which is then routed to recipient wallets on Base Testnet.
            Recipients hold USDC — fiat offramp is not yet supported in this demo and will be added in a future phase.
            All destinations are screened by MiniMax AI for OFAC, FATF, and UN/EU sanctions compliance.
          </p>
        </div>

        {/* Demo notice */}
        <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg border border-border/60 bg-muted/10">
          <FlaskConical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            Demo wallets use mock balances on Base Testnet. Paste real Crossmint wallet addresses below to connect live accounts.
          </p>
        </div>

        {/* Sender wallets */}
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

        {/* Recipient wallets */}
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
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Connect Wallet</p>

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

                  {/* Label */}
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Vendor Berlin"
                      value={form.label}
                      onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                      className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Wallet address */}
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Wallet Address</label>
                    <input
                      type="text"
                      placeholder="Paste 0x… or crossmint:… address"
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Country + Currency row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                        Country / Region
                        {form.role === 'recipient' && <span className="text-destructive ml-0.5">*</span>}
                      </label>
                      <select
                        value={form.countryCode}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="">Select country…</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {FLAG_MAP[c.code] ?? '🌐'} {c.name}
                          </option>
                        ))}
                      </select>
                      {form.role === 'recipient' && form.countryCode && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          MiniMax will screen this country for sanctions before adding.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Currency</label>
                      <input
                        type="text"
                        placeholder="e.g. EUR"
                        value={form.currency}
                        onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value.toUpperCase() }))}
                        className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Balance */}
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Starting Balance (optional)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.balance}
                      onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))}
                      className="w-full bg-surface-raised/50 border border-border rounded-lg px-3 py-2 text-[12px] text-foreground font-mono placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {formError && (
                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-destructive/40 bg-destructive/10">
                      <ShieldX className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-[11px] text-destructive font-mono">{formError}</p>
                    </div>
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
                      disabled={checking}
                      className="flex-[2] py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {checking ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Checking compliance…
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Add Wallet
                        </>
                      )}
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
