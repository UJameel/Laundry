import { motion } from 'framer-motion';
import { Check, Wallet, Inbox, Zap, RotateCw, Droplets, Mic } from 'lucide-react';

const steps = [
  { label: 'Wallets', path: '/wallets', icon: Wallet },
  { label: 'Load', path: '/', icon: Inbox },
  { label: 'Wash', path: '/wash', icon: Zap },
  { label: 'Spin', path: '/spin', icon: RotateCw },
  { label: 'Rinse', path: '/rinse', icon: Droplets },
  { label: 'Briefing', path: '/briefing', icon: Mic },
];

interface CycleProgressProps {
  currentPath: string;
}

const CycleProgress = ({ currentPath }: CycleProgressProps) => {
  const currentIndex = steps.findIndex((s) => s.path === currentPath);

  return (
    <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-1 -mx-1 px-1">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.path} className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold relative ${
                  isCompleted
                    ? 'text-white'
                    : isCurrent
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-muted/30 text-muted-foreground/60 border border-border'
                }`}
                style={isCompleted ? { background: '#14B8A6' } : undefined}
                animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                transition={isCurrent ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" />
                )}
              </motion.div>
              <span
                className={`text-[11px] font-medium hidden sm:inline ${
                  isCurrent ? 'text-foreground' : isCompleted ? 'text-[#14B8A6]' : 'text-muted-foreground/60'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-6 lg:w-10 h-[2px] rounded-full"
                style={
                  isCompleted
                    ? { background: 'linear-gradient(90deg, #1E3A8A, #14B8A6)' }
                    : { background: '#E2E8F0' }
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CycleProgress;
