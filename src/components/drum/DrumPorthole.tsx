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
          className="relative rounded-[16px] overflow-hidden"
          style={{
            width: machineWidth,
            height: machineHeight,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
            border: '2px solid rgba(203, 213, 225, 0.7)',
            boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
          }}
        >
          {/* Top panel with controls */}
          <div
            className="flex items-center justify-between px-4"
            style={{
              height: topPanelHeight,
              background: 'rgba(30, 58, 138, 0.06)',
              borderBottom: '1px solid rgba(203, 213, 225, 0.5)',
              borderRadius: '14px 14px 0 0',
            }}
          >
            {/* Control knob */}
            <div
              className="rounded-full"
              style={{
                width: machineWidth * 0.1,
                height: machineWidth * 0.1,
                background: 'linear-gradient(135deg, #1E3A8A, #14B8A6)',
                border: '2px solid rgba(109, 165, 250, 0.4)',
                boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)',
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
                      ? '#6DA5FA'
                      : '#14B8A6',
                    boxShadow: `0 0 4px ${i === 1 ? 'rgba(109, 165, 250, 0.4)' : 'rgba(20, 184, 166, 0.4)'}`,
                  }}
                  animate={{
                    opacity: isActive ? [0.5, 1, 0.5] : [0.4, 0.7, 0.4],
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

          {/* Drum window area */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
            style={{
              top: topPanelHeight + (machineHeight - topPanelHeight - drumDiameter) * 0.35,
              width: drumDiameter,
              height: drumDiameter,
              background: 'radial-gradient(circle, rgba(241, 245, 249, 0.9), #E2E8F0)',
              border: '3px solid rgba(30, 58, 138, 0.15)',
              boxShadow: 'inset 0 2px 12px rgba(30, 58, 138, 0.06), 0 2px 8px rgba(15, 23, 42, 0.06)',
            }}
          >
            {/* Inner ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: 4,
                border: '2px solid rgba(109, 165, 250, 0.12)',
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
                  className="absolute h-full w-[1px]"
                  style={{
                    background: 'rgba(30, 58, 138, 0.08)',
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
                        className="font-mono font-bold"
                        style={{ fontSize: iconSize * 0.9, color: 'rgba(30, 58, 138, 0.2)' }}
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
                        className="font-mono font-bold text-teal/70"
                        style={{ fontSize: iconSize * 0.9 }}
                        animate={{ opacity: [0.4, 0.8, 0.5, 0.8] }}
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
                    background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.15), rgba(20, 184, 166, 0.3))',
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
                        opacity: [0, 0.7, 0],
                      }}
                      transition={{
                        duration: 1.8,
                        delay: 0.3 + i * 0.2,
                        ease: 'easeOut',
                      }}
                    >
                      <span className="font-mono font-bold text-teal/60" style={{ fontSize: iconSize }}>
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
                  style={{ background: 'rgba(20, 184, 166, 0.1)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <motion.svg
                    width={drumDiameter * 0.3}
                    height={drumDiameter * 0.3}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#14B8A6"
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
                        color: ['#14B8A6', '#1E3A8A', '#67E8F9', '#6DA5FA'][i % 4],
                      }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{
                        x: Math.cos(angle) * rad,
                        y: Math.sin(angle) * rad,
                        opacity: [0, 0.8, 0.6],
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
                background: 'rgba(30, 58, 138, 0.15)',
              }}
            />
            <div
              className="rounded-b-md"
              style={{
                width: machineWidth * 0.1,
                height: machineWidth * 0.035,
                background: 'rgba(30, 58, 138, 0.15)',
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DrumPorthole;
