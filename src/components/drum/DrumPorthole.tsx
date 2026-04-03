import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

type DrumState = 'idle' | 'analyzing' | 'executing' | 'complete';

interface DrumPortholeProps {
  size?: number;
  state?: DrumState;
  className?: string;
  targetCurrency?: string;
}

// Dollar symbols that tumble, then morph into USDC, then into target currency
const dollarPositions = [
  { angle: 0, radius: 0.28 },
  { angle: 45, radius: 0.22 },
  { angle: 90, radius: 0.32 },
  { angle: 135, radius: 0.18 },
  { angle: 180, radius: 0.3 },
  { angle: 225, radius: 0.25 },
  { angle: 270, radius: 0.2 },
  { angle: 315, radius: 0.26 },
  { angle: 30, radius: 0.15 },
  { angle: 160, radius: 0.12 },
  { angle: 200, radius: 0.35 },
  { angle: 340, radius: 0.16 },
];

const DrumPorthole = ({ size = 240, state = 'idle', className = '', targetCurrency = 'EUR' }: DrumPortholeProps) => {
  const innerSize = size - 16;
  const center = size / 2;

  return (
    <div
      className={`drum-porthole relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="drum-porthole-inner" />

      {/* Drum fins — always visible */}
      <motion.div
        className="absolute inset-3 flex items-center justify-center"
        animate={{ rotate: state === 'idle' ? 360 : state === 'analyzing' ? 360 : 0 }}
        transition={{
          duration: state === 'analyzing' ? 2 : 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[0, 60, 120].map((deg) => (
          <div
            key={deg}
            className="absolute h-full w-[1px] opacity-[0.06]"
            style={{
              background: 'white',
              transform: `rotate(${deg}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Analyzing state: dollars tumbling inside the drum */}
      {state === 'analyzing' && (
        <div className="absolute inset-0" style={{ width: size, height: size }}>
          {dollarPositions.map((pos, i) => {
            const rad = (pos.angle * Math.PI) / 180;
            const maxR = innerSize * 0.38;
            const r = maxR * pos.radius / 0.35;
            const iconSize = Math.max(10, size * 0.06);

            return (
              <motion.div
                key={i}
                className="absolute flex items-center justify-center"
                style={{
                  left: center - iconSize / 2,
                  top: center - iconSize / 2,
                  width: iconSize,
                  height: iconSize,
                }}
                animate={{
                  x: [
                    r * Math.cos(rad),
                    r * Math.cos(rad + Math.PI * 0.7),
                    r * Math.cos(rad + Math.PI * 1.4),
                    r * Math.cos(rad + Math.PI * 2),
                  ],
                  y: [
                    r * Math.sin(rad),
                    r * Math.sin(rad + Math.PI * 0.7),
                    r * Math.sin(rad + Math.PI * 1.4),
                    r * Math.sin(rad + Math.PI * 2),
                  ],
                  rotate: [0, 180, 360],
                  scale: [1, 0.8, 1.1, 1],
                }}
                transition={{
                  duration: 2.2 + (i % 4) * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }}
              >
                {/* Phase 1: $ signs, Phase 2: USDC, Phase 3: target currency */}
                <motion.span
                  className="font-mono font-bold text-teal/60"
                  style={{ fontSize: iconSize * 0.9 }}
                  animate={{
                    opacity: [0.3, 0.7, 0.4, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.06,
                  }}
                >
                  $
                </motion.span>
              </motion.div>
            );
          })}

          {/* Center conversion text that cycles: $ → USDC → currency */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="flex flex-col items-center gap-0.5"
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span
                className="font-mono text-teal font-bold"
                style={{ fontSize: size * 0.07 }}
                animate={{
                  opacity: [1, 0, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.33, 1] }}
              >
                USD $
              </motion.span>
              <motion.span
                className="font-mono text-primary font-bold"
                style={{ fontSize: size * 0.07 }}
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, times: [0.3, 0.5, 0.7] }}
              >
                USDC
              </motion.span>
              <motion.span
                className="font-mono text-indigo font-bold"
                style={{ fontSize: size * 0.07 }}
                animate={{
                  opacity: [0, 0, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, times: [0, 0.65, 1] }}
              >
                {targetCurrency}
              </motion.span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Idle state: a few floating $ at low opacity */}
      {state === 'idle' && (
        <div className="absolute inset-0">
          {dollarPositions.slice(0, 6).map((pos, i) => {
            const rad = (pos.angle * Math.PI) / 180;
            const maxR = innerSize * 0.3;
            const r = maxR * pos.radius / 0.35;
            const iconSize = Math.max(10, size * 0.055);

            return (
              <motion.div
                key={i}
                className="absolute flex items-center justify-center"
                style={{
                  left: center - iconSize / 2,
                  top: center - iconSize / 2,
                  width: iconSize,
                  height: iconSize,
                }}
                animate={{
                  x: [r * Math.cos(rad), r * Math.cos(rad + 0.3), r * Math.cos(rad)],
                  y: [r * Math.sin(rad), r * Math.sin(rad + 0.3), r * Math.sin(rad)],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span
                  className="font-mono font-bold text-muted-foreground/20"
                  style={{ fontSize: iconSize * 0.9 }}
                >
                  $
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Water fill when executing — with dollar signs floating up in the water */}
      {state === 'executing' && (
        <>
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-full overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, hsla(217,91%,53%,0.25), hsla(187,94%,43%,0.35))',
            }}
            initial={{ height: 0 }}
            animate={{ height: innerSize }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          {/* Dollars converting inside the water */}
          {dollarPositions.slice(0, 8).map((pos, i) => {
            const iconSize = Math.max(8, size * 0.045);
            return (
              <motion.div
                key={`exec-${i}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: center - iconSize / 2 + (Math.random() - 0.5) * innerSize * 0.5,
                  width: iconSize,
                  height: iconSize,
                }}
                initial={{ top: center + innerSize * 0.3, opacity: 0 }}
                animate={{
                  top: [center + innerSize * 0.3, center - innerSize * 0.1, center - innerSize * 0.3],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.3 + i * 0.2,
                  ease: 'easeOut',
                }}
              >
                <span className="font-mono font-bold text-teal/50" style={{ fontSize: iconSize }}>
                  $
                </span>
              </motion.div>
            );
          })}
        </>
      )}

      {/* Complete: checkmark + currency symbols bursting inside */}
      {state === 'complete' && (
        <>
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-full"
            style={{ background: 'hsla(160, 84%, 39%, 0.12)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <motion.svg
              width={size * 0.25}
              height={size * 0.25}
              viewBox="0 0 24 24"
              fill="none"
              stroke="hsl(160 84% 39%)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </motion.svg>
          </motion.div>

          {/* Currency symbols bursting outward from center, staying inside the drum */}
          {['$', '€', '£', '¥', '₦', 'USDC', '$', '€', '£', '¥', '$', '₦', '$', 'USDC', '€', '£'].map((symbol, i) => {
            const angle = (i / 16) * Math.PI * 2 + (i % 3) * 0.3;
            const maxRadius = innerSize * 0.35;
            const radius = maxRadius * (0.4 + (i % 5) * 0.12);
            const symbolSize = symbol === 'USDC' ? size * 0.035 : size * 0.055;

            return (
              <motion.span
                key={`curr-${i}`}
                className="absolute font-mono font-bold pointer-events-none"
                style={{
                  left: center,
                  top: center,
                  fontSize: symbolSize,
                  color: ['hsl(187 94% 43%)', 'hsl(217 91% 53%)', 'hsl(160 84% 39%)', 'hsl(239 84% 67%)'][i % 4],
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(angle) * radius,
                  y: Math.sin(angle) * radius,
                  opacity: [0, 0.7, 0.5],
                  scale: [0, 1.3, 0.9],
                }}
                transition={{
                  duration: 1,
                  delay: 0.2 + i * 0.05,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default DrumPorthole;
