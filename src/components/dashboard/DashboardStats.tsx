import { motion } from 'framer-motion';
import { DollarSign, Globe, TrendingDown, Zap } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  delay: number;
}

const StatCard = ({ icon: Icon, label, value, sub, accentColor, glowColor, borderColor, delay }: StatCardProps) => (
  <motion.div
    className="glass-card rounded-xl p-5 relative overflow-hidden group hover-glow"
    style={{ borderLeft: `3px solid ${borderColor}` }}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
  >
    {/* Ambient glow */}
    <div
      className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
      style={{ background: glowColor }}
    />
    <div className="relative">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
        style={{ background: accentColor }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1 font-medium">{label}</p>
      <p className="text-xl font-bold text-foreground font-display tabular-nums tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

interface DashboardStatsProps {
  totalUSD: number;
  currencies: number;
  vendors: number;
  estimatedSavings: number;
}

const DashboardStats = ({ totalUSD, currencies, vendors, estimatedSavings }: DashboardStatsProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
    <StatCard
      icon={DollarSign}
      label="Total Batch"
      value={`$${totalUSD.toLocaleString()}`}
      sub="USD equivalent"
      accentColor="rgba(30, 58, 138, 0.1)"
      glowColor="rgba(30, 58, 138, 0.08)"
      borderColor="#1E3A8A"
      delay={0}
    />
    <StatCard
      icon={Globe}
      label="Corridors"
      value={`${currencies}`}
      sub={`${vendors} vendors`}
      accentColor="rgba(20, 184, 166, 0.1)"
      glowColor="rgba(20, 184, 166, 0.08)"
      borderColor="#14B8A6"
      delay={0.05}
    />
    <StatCard
      icon={Zap}
      label="USDC Conversion"
      value="1:1"
      sub="Zero slippage"
      accentColor="rgba(96, 165, 250, 0.12)"
      glowColor="rgba(96, 165, 250, 0.08)"
      borderColor="#60A5FA"
      delay={0.1}
    />
    <StatCard
      icon={TrendingDown}
      label="Est. Savings"
      value={`$${estimatedSavings.toLocaleString()}`}
      sub="vs traditional"
      accentColor="rgba(103, 232, 249, 0.12)"
      glowColor="rgba(103, 232, 249, 0.08)"
      borderColor="#67E8F9"
      delay={0.15}
    />
  </div>
);

export default DashboardStats;
