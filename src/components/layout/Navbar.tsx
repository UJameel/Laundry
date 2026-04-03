import { motion } from 'framer-motion';
import { Wallet, Globe } from 'lucide-react';

interface NavbarProps {
  statusText?: string;
  statusColor?: 'teal' | 'green' | 'muted';
}

const Navbar = ({ statusText = 'Idle — Ready to load', statusColor = 'muted' }: NavbarProps) => {
  const colorMap = {
    teal: 'bg-teal/15 text-teal border border-teal/20',
    green: 'bg-success/15 text-success border border-success/20',
    muted: 'bg-muted/50 text-muted-foreground border border-border',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 34,
            height: 34,
            border: '2px solid rgba(255,255,255,0.18)',
            background: 'radial-gradient(circle, hsl(222 40% 12%), hsl(222 47% 7%))',
            boxShadow: '0 0 12px rgba(6,182,212,0.15), inset 0 0 8px rgba(0,0,0,0.4)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          {/* Drum fins */}
          {[0, 60, 120].map((deg) => (
            <div
              key={deg}
              className="absolute h-full w-[1px]"
              style={{ background: 'rgba(255,255,255,0.08)', transform: `rotate(${deg}deg)` }}
            />
          ))}
          {/* Inner ring */}
          <div className="absolute inset-[3px] rounded-full border border-white/[0.08]" />
        </motion.div>
        <span className="text-base font-bold tracking-tight text-foreground font-display">Laundry</span>
      </div>

      {/* Status pill */}
      <div className={`px-3.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${colorMap[statusColor]}`}>
        {statusText}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 text-muted-foreground text-[11px] font-mono border border-border">
          <Globe className="w-3 h-3" />
          Testnet
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-raised text-foreground text-[11px] font-mono border border-border">
          <Wallet className="w-3 h-3 text-teal" />
          $10,000
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-indigo/40 flex items-center justify-center text-[10px] font-bold text-foreground ring-1 ring-border">
          L
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
