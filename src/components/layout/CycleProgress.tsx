import { Check } from 'lucide-react';

const steps = [
  { label: 'Load', path: '/' },
  { label: 'Wash Cycle', path: '/wash' },
  { label: 'Spin', path: '/spin' },
  { label: 'Rinse', path: '/rinse' },
  { label: 'Briefing', path: '/briefing' },
];

interface CycleProgressProps {
  currentPath: string;
}

const CycleProgress = ({ currentPath }: CycleProgressProps) => {
  const currentIndex = steps.findIndex((s) => s.path === currentPath);

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture = i > currentIndex;

        return (
          <div key={step.path} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${isCompleted ? 'bg-teal/80 text-background' : ''}
                  ${isCurrent ? 'bg-foreground text-background ring-2 ring-primary/30' : ''}
                  ${isFuture ? 'bg-muted/50 text-muted-foreground' : ''}
                `}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium hidden sm:inline tracking-wide
                  ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                `}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px ${isCompleted ? 'bg-teal/60' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CycleProgress;
