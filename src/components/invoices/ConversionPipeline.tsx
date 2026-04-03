import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ConversionPipelineProps {
  amountUSD: number;
  amountUSDC: number;
  targetCurrency: string;
  fxRate: number;
  localAmount: number;
  compact?: boolean;
}

const ConversionPipeline = ({
  amountUSD,
  amountUSDC,
  targetCurrency,
  fxRate,
  localAmount,
  compact = false,
}: ConversionPipelineProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
        <span className="text-foreground">${amountUSD.toLocaleString()}</span>
        <ArrowRight className="w-2.5 h-2.5 text-teal" />
        <span className="text-teal">{amountUSDC.toLocaleString()} USDC</span>
        <ArrowRight className="w-2.5 h-2.5 text-indigo" />
        <span className="text-indigo">{localAmount.toLocaleString()} {targetCurrency}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* USD */}
      <div className="flex-1 bg-surface-raised/60 border border-border rounded-lg p-3 text-center">
        <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">USD</p>
        <p className="text-sm font-bold text-foreground font-mono tabular-nums">${amountUSD.toLocaleString()}</p>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <ArrowRight className="w-3.5 h-3.5 text-teal" />
        <span className="text-[8px] text-teal font-mono">1:1</span>
      </div>

      {/* USDC */}
      <div className="flex-1 bg-teal/5 border border-teal/15 rounded-lg p-3 text-center">
        <p className="text-[9px] uppercase tracking-[0.12em] text-teal/70 mb-1">USDC</p>
        <p className="text-sm font-bold text-teal font-mono tabular-nums">{amountUSDC.toLocaleString()}</p>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <ArrowRight className="w-3.5 h-3.5 text-indigo" />
        <span className="text-[8px] text-indigo font-mono">{fxRate}</span>
      </div>

      {/* Local currency */}
      <div className="flex-1 bg-indigo/5 border border-indigo/15 rounded-lg p-3 text-center">
        <p className="text-[9px] uppercase tracking-[0.12em] text-indigo/70 mb-1">{targetCurrency}</p>
        <p className="text-sm font-bold text-indigo font-mono tabular-nums">{localAmount.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ConversionPipeline;
