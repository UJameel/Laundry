import { motion } from 'framer-motion';

type DrumState = 'idle' | 'analyzing' | 'executing' | 'complete';

interface DrumPortholeProps {
  size?: number;
  state?: DrumState;
  className?: string;
  targetCurrency?: string;
}

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
  // The size prop controls the overall machine width
  const machineWidth = size;
  const machineHeight = machineWidth * 1.2;
  const topPanelHeight = machineHeight * 0.17;
  const drumDiameter = machineWidth * 0.55;
  const drumRadius = drumDiameter / 2;
  const drumCenter = drumDiameter / 2;
  const isActive = state === 'analyzing' || state === 'executing';

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Machine vibration wrapper */}
      <motion.div
        className="relative"
        animate={isActive ? {
          x: [0, 1, -1, 1, 0],
          y: [0, -1, 1, 0, -1],
        } : {}}
        transition={isActive ? {
          duration: 0.15,
          repeat: Infinity,
          ease: 'linear',
        } : {}}
      >
        {/* Machine body */}
        <div
          className="relative rounded-[16px] border-2 border-white/10 overflow-hidden"
          style={{
            width: machineWidth,
            height: machineHeight,
            background: 'linear-gradient(180deg, hsl(222 35% 20%) 0%, hsl(222 40% 14%) 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top panel with controls */}
          <div
            className="flex items-center justify-between px-4 border-b border-white/7"
            style={{
              height: topPanelHeight,
              background: 'hsl(222 30% 17%)',
              borderRadius: '14px 14px 0 0',
            }}
          >
            {/* Control knob */}
            <div
              className="rounded-full border-2"
              style={{
                width: machineWidth * 0.1,
                height: machineWidth * 0.1,
                background: 'hsl(var(--accent-indigo))',
                borderColor: 'hsl(239 84% 75%)',
                boxShadow: '0 0 8px hsla(239, 84%, 67%, 0.5)',
              }}
            />

            {/* LED indicator dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: Math.max(5, machineWidth * 0.035),
                    height: Math.max(5, machineWidth * 0.035),
                    background: i === 1
                      ? 'hsl(var(--accent-indigo))'
                      : 'hsl(var(--accent-teal))',
                  }}
                  animate={{
                    opacity: isActive ? [0.4, 1, 0.4] : [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Drum window area — centered below top panel */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
            style={{
              top: topPanelHeight + (machineHeight - topPanelHeight - drumDiameter) * 0.35,
              width: drumDiameter,
              height: drumDiameter,
              background: 'radial-gradient(circle, hsl(222 40% 8%), hsl(222 47% 5%))',
              border: '3px solid hsl(222 25% 30%)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            }}
          >
            {/* Inner ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: 4,
                border: '2px solid rgba(255,255,255,0.06)',
              }}
            />

            {/* Drum fins — always rotating */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{
                duration: state === 'analyzing' ? 2 : state === 'executing' ? 3 : 10,
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

            {/* ===== STATE: idle ===== */}
            {state === 'idle' && (
              <div className="absolute inset-0">
                {dollarPositions.slice(0, 6).map((pos, i) => {
                  const rad = (pos.angle * Math.PI) / 180;
                  const maxR = drumDiameter * 0.3;
                  const r = maxR * pos.radius / 0.35;
                  const iconSize = Math.max(8, drumDiameter * 0.09);

                  return (
                    <motion.div
                      key={i}
                      className="absolute flex items-center justify-center"
                      style={{
                        left: drumCenter - iconSize / 2,
                        top: drumCenter - iconSize / 2,
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

            {/* ===== STATE: analyzing ===== */}
            {state === 'analyzing' && (
              <div className="absolute inset-0" style={{ width: drumDiameter, height: drumDiameter }}>
                {/* Water sloshing effect */}
                <div className="machine-water-slosh" />

                {/* Bubbles rising */}
                <div className="absolute inset-0">
                  {[
                    { left: '20%', bottom: '30%', delay: 0, sz: 6 },
                    { left: '50%', bottom: '25%', delay: 0.7, sz: 5 },
                    { left: '70%', bottom: '35%', delay: 1.3, sz: 8 },
                    { left: '35%', bottom: '20%', delay: 0.4, sz: 4 },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="machine-bubble absolute rounded-full"
                      style={{
                        left: b.left,
                        bottom: b.bottom,
                        width: b.sz,
                        height: b.sz,
                        animationDelay: `${b.delay}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Tumbling money symbols */}
                {dollarPositions.map((pos, i) => {
                  const rad = (pos.angle * Math.PI) / 180;
                  const maxR = drumDiameter * 0.35;
                  const r = maxR * pos.radius / 0.35;
                  const iconSize = Math.max(8, drumDiameter * 0.09);

                  return (
                    <motion.div
                      key={i}
                      className="absolute flex items-center justify-center"
                      style={{
                        left: drumCenter - iconSize / 2,
                        top: drumCenter - iconSize / 2,
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
                      <motion.span
                        className="font-mono font-bold text-teal/60"
                        style={{ fontSize: iconSize * 0.9 }}
                        animate={{ opacity: [0.3, 0.7, 0.4, 0.7] }}
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

                {/* Center conversion text that cycles: $ -> USDC -> currency */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    className="flex flex-col items-center gap-0.5"
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.span
                      className="font-mono text-teal font-bold"
                      style={{ fontSize: drumDiameter * 0.09 }}
                      animate={{ opacity: [1, 0, 0] }}
                      transition={{ duration: 3, repeat: Infinity, times: [0, 0.33, 1] }}
                    >
                      USD $
                    </motion.span>
                    <motion.span
                      className="font-mono text-primary font-bold"
                      style={{ fontSize: drumDiameter * 0.09 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: Infinity, times: [0.3, 0.5, 0.7] }}
                    >
                      USDC
                    </motion.span>
                    <motion.span
                      className="font-mono text-indigo font-bold"
                      style={{ fontSize: drumDiameter * 0.09 }}
                      animate={{ opacity: [0, 0, 1] }}
                      transition={{ duration: 3, repeat: Infinity, times: [0, 0.65, 1] }}
                    >
                      {targetCurrency}
                    </motion.span>
                  </motion.div>
                </div>
              </div>
            )}

            {/* ===== STATE: executing ===== */}
            {state === 'executing' && (
              <>
                {/* Water filling up */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, hsla(217,91%,53%,0.25), hsla(187,94%,43%,0.35))',
                    borderRadius: '0 0 50% 50%',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: drumDiameter }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />

                {/* Water sloshing on top */}
                <div className="machine-water-slosh" />

                {/* Bubbles */}
                <div className="absolute inset-0">
                  {[
                    { left: '25%', bottom: '20%', delay: 0, sz: 5 },
                    { left: '60%', bottom: '30%', delay: 0.5, sz: 7 },
                    { left: '40%', bottom: '15%', delay: 1.0, sz: 4 },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="machine-bubble absolute rounded-full"
                      style={{
                        left: b.left,
                        bottom: b.bottom,
                        width: b.sz,
                        height: b.sz,
                        animationDelay: `${b.delay}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Currency symbols floating up in the water */}
                {dollarPositions.slice(0, 8).map((_, i) => {
                  const iconSize = Math.max(8, drumDiameter * 0.07);
                  return (
                    <motion.div
                      key={`exec-${i}`}
                      className="absolute flex items-center justify-center"
                      style={{
                        left: drumCenter - iconSize / 2 + (Math.random() - 0.5) * drumDiameter * 0.5,
                        width: iconSize,
                        height: iconSize,
                      }}
                      initial={{ top: drumCenter + drumDiameter * 0.3, opacity: 0 }}
                      animate={{
                        top: [drumCenter + drumDiameter * 0.3, drumCenter - drumDiameter * 0.1, drumCenter - drumDiameter * 0.3],
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

            {/* ===== STATE: complete ===== */}
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
                    width={drumDiameter * 0.3}
                    height={drumDiameter * 0.3}
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

                {/* Currency symbols bursting */}
                {['$', '\u20AC', '\u00A3', '\u00A5', '\u20A6', 'USDC', '$', '\u20AC', '\u00A3', '\u00A5', '$', '\u20A6', '$', 'USDC', '\u20AC', '\u00A3'].map((symbol, i) => {
                  const angle = (i / 16) * Math.PI * 2 + (i % 3) * 0.3;
                  const maxRad = drumDiameter * 0.35;
                  const rad = maxRad * (0.4 + (i % 5) * 0.12);
                  const symbolSize = symbol === 'USDC' ? drumDiameter * 0.05 : drumDiameter * 0.07;

                  return (
                    <motion.span
                      key={`curr-${i}`}
                      className="absolute font-mono font-bold pointer-events-none"
                      style={{
                        left: drumCenter,
                        top: drumCenter,
                        fontSize: symbolSize,
                        color: ['hsl(187 94% 43%)', 'hsl(217 91% 53%)', 'hsl(160 84% 39%)', 'hsl(239 84% 67%)'][i % 4],
                      }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{
                        x: Math.cos(angle) * rad,
                        y: Math.sin(angle) * rad,
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

          {/* Machine feet */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-[15%]">
            <div
              className="rounded-b-md"
              style={{
                width: machineWidth * 0.1,
                height: machineWidth * 0.035,
                background: 'hsl(222 25% 30%)',
              }}
            />
            <div
              className="rounded-b-md"
              style={{
                width: machineWidth * 0.1,
                height: machineWidth * 0.035,
                background: 'hsl(222 25% 30%)',
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DrumPorthole;
