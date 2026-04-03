import { motion } from 'framer-motion';
import { DollarSign, Globe, TrendingDown, Zap } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accentClass: string;
  delay: number;
}

const StatCard = ({ icon: Icon, label, value, sub, accentClass, delay }: StatCardProps) => (
  <motion.div
    className="bg-card/60 border border-border rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-primary/20 transition-colors"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
      <Icon className="w-full h-full" />
    </div>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accentClass}`}>
      <Icon className="w-4 h-4" />
    </div>
    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-1 font-medium">{label}</p>
    <p className="text-xl font-bold text-foreground font-display tabular-nums tracking-tight">{value}</p>
    {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
  </motion.div>
);

interface DashboardStatsProps {
  totalUSD: number;
  currencies: number;
  vendors: number;
  estimatedSavings: number;
}

const DashboardStats = ({ totalUSD, currencies, vendors, estimatedSavings }: DashboardStatsProps) => (
  <div className="grid grid-cols-4 gap-3 mb-8">
    <StatCard
      icon={DollarSign}
      label="Total Batch"
      value={`$${totalUSD.toLocaleString()}`}
      sub="USD equivalent"
      accentClass="bg-primary/15 text-primary"
      delay={0}
    />
    <StatCard
      icon={Globe}
      label="Corridors"
      value={`${currencies}`}
      sub={`${vendors} vendors`}
      accentClass="bg-indigo/15 text-indigo"
      delay={0.05}
    />
    <StatCard
      icon={Zap}
      label="USDC Conversion"
      value="1:1"
      sub="Zero slippage"
      accentClass="bg-teal/15 text-teal"
      delay={0.1}
    />
    <StatCard
      icon={TrendingDown}
      label="Est. Savings"
      value={`$${estimatedSavings.toLocaleString()}`}
      sub="vs traditional"
      accentClass="bg-success/15 text-success"
      delay={0.15}
    />
  </div>
);

export default DashboardStats;
