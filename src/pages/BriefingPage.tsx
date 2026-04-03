import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DrumPorthole from '@/components/drum/DrumPorthole';
import WaterTransition from '@/components/transitions/WaterTransition';
import { useWaterTransition } from '@/hooks/useWaterTransition';
import { useLaundryStore } from '@/hooks/useLaundryStore';

const BriefingPage = () => {
  const { isTransitioning, navigateWithWater, handleTransitionComplete } = useWaterTransition();
  const { analysisResult, reset } = useLaundryStore();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use the AI-generated executive summary, or fallback
  const transcript = analysisResult?.executive_summary
    ?? `Good morning. Your treasury has processed 5 pending payments totaling $207,000. I identified significant savings through USDC routing — reducing payment costs compared to traditional bank transfers. All transfers have settled on chain. Your batch is clean.`;

  const togglePlay = () => setPlaying(!playing);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { setPlaying(false); return 100; }
          return p + 0.5;
        });
      }, 50);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const visibleChars = Math.floor((progress / 100) * transcript.length);

  return (
    <AppLayout statusText="Briefing ready" statusColor="green">
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      <motion.div
        className="max-w-2xl mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DrumPorthole size={140} state="idle" className="mb-8" />

        <h1 className="text-2xl font-bold text-foreground mb-1 font-display tracking-tight">Laundry Report</h1>
        <p className="text-muted-foreground text-xs mb-8">Hear your laundry report</p>

        <div className="flex items-end gap-[2px] h-12 mb-6">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[2px] rounded-full bg-teal/70"
              animate={playing ? {
                scaleY: [0.2, 0.4 + Math.random() * 0.6, 0.2],
              } : { scaleY: 0.2 }}
              transition={{
                duration: 0.35 + Math.random() * 0.25,
                repeat: playing ? Infinity : 0,
                repeatType: 'reverse',
              }}
              style={{ height: 40, transformOrigin: 'bottom' }}
            />
          ))}
        </div>

        <motion.button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-teal/90 flex items-center justify-center mb-2 hover:bg-teal transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {playing ? <Pause className="w-5 h-5 text-background" /> : <Play className="w-5 h-5 text-background ml-0.5" />}
        </motion.button>
        <p className="text-[10px] text-muted-foreground mb-6 font-mono tabular-nums">
          {Math.floor(progress / 100 * 10)}s / 10s
        </p>

        <div className="w-full h-[3px] bg-muted rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-card/60 border border-border rounded-xl p-6 w-full mb-8 backdrop-blur-sm">
          <h3 className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3 font-semibold">Transcript</h3>
          <p className="text-[13px] leading-relaxed text-foreground">
            {progress > 0 ? (
              <>
                <span>{transcript.slice(0, visibleChars)}</span>
                <span className="text-muted-foreground/20">{transcript.slice(visibleChars)}</span>
              </>
            ) : (
              <span className="text-muted-foreground/50">{transcript}</span>
            )}
          </p>
        </div>

        <motion.button
          onClick={() => {
            setPlaying(false);
            setProgress(0);
            reset();
            navigateWithWater('/');
          }}
          className="w-full py-3.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted/20 transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Start New Run
        </motion.button>

        <p className="text-[9px] text-muted-foreground/40 mt-6 uppercase tracking-[0.15em]">
          Testnet — we are not actually laundering anything
        </p>
      </motion.div>
    </AppLayout>
  );
};

export default BriefingPage;
