import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WaterTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
}

const WaterTransition = ({ isActive, onComplete }: WaterTransitionProps) => {
  const [bubbles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: 6 + Math.random() * 18,
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 0.3,
      duration: 0.6 + Math.random() * 0.4,
    }))
  );

  useEffect(() => {
    if (isActive && onComplete) {
      const timer = setTimeout(onComplete, 1100);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {/* Main wave */}
          <motion.div
            className="absolute inset-y-0 w-[140%]"
            style={{
              background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.75) 0%, rgba(20, 184, 166, 0.6) 40%, rgba(20, 184, 166, 0.2) 80%, transparent 100%)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: '-40%' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* Secondary wave */}
          <motion.div
            className="absolute inset-y-0 w-[130%]"
            style={{
              background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.85) 0%, rgba(109, 165, 250, 0.4) 50%, transparent 100%)',
            }}
            initial={{ x: '110%' }}
            animate={{ x: '-30%' }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }}
          />

          {/* Wave edge */}
          <motion.div
            className="absolute inset-y-0 w-32"
            initial={{ x: 'calc(100vw + 128px)' }}
            animate={{ x: '-200px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <svg viewBox="0 0 100 800" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M100,0 C60,100 90,200 50,300 C10,400 80,500 40,600 C0,700 70,750 100,800 L0,800 L0,0 Z"
                fill="rgba(20, 184, 166, 0.4)"
              />
            </svg>
          </motion.div>

          {/* Bubbles */}
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute rounded-full"
              style={{
                width: bubble.size,
                height: bubble.size,
                top: `${bubble.y}%`,
                background: 'radial-gradient(circle at 30% 30%, rgba(103, 232, 249, 0.5), rgba(30, 58, 138, 0.2))',
                border: '1px solid rgba(103, 232, 249, 0.3)',
              }}
              initial={{ x: `${100 + bubble.x}vw`, scale: 0, opacity: 0 }}
              animate={{
                x: `${-20 - bubble.x * 0.3}vw`,
                scale: [0, 1.2, 0.8, 1],
                opacity: [0, 0.8, 0.6, 0],
                y: [0, -20, 10, -30],
              }}
              transition={{
                duration: bubble.duration + 0.4,
                delay: bubble.delay,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Foam particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`foam-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: 'rgba(103, 232, 249, 0.6)',
                top: `${15 + Math.random() * 70}%`,
              }}
              initial={{ x: '100vw' }}
              animate={{ x: '-10vw', opacity: [0, 1, 0] }}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.04,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaterTransition;
