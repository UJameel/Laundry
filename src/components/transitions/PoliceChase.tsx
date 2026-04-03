import { useEffect, useState } from 'react';

interface PoliceChaseProps {
  isActive: boolean;
  onDismiss: () => void;
}

/** Skyline buildings — positioned across a 200% wide container so the scroll loops */
const buildings = [
  { left: '2%', width: 30, height: 45 },
  { left: '6%', width: 20, height: 55 },
  { left: '10%', width: 35, height: 35 },
  { left: '16%', width: 25, height: 50 },
  { left: '22%', width: 15, height: 40 },
  { left: '26%', width: 40, height: 60 },
  { left: '33%', width: 20, height: 30 },
  { left: '38%', width: 30, height: 50 },
  { left: '44%', width: 18, height: 42 },
  // Second half mirrors the first so the loop is seamless
  { left: '52%', width: 30, height: 45 },
  { left: '56%', width: 20, height: 55 },
  { left: '60%', width: 35, height: 35 },
  { left: '66%', width: 25, height: 50 },
  { left: '72%', width: 15, height: 40 },
  { left: '76%', width: 40, height: 60 },
  { left: '83%', width: 20, height: 30 },
  { left: '88%', width: 30, height: 50 },
  { left: '94%', width: 18, height: 42 },
];

const PoliceChase = ({ isActive, onDismiss }: PoliceChaseProps) => {
  const [showCriminalMsg, setShowCriminalMsg] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowCriminalMsg(false);
      return;
    }
    // Show the "criminal" message after a short delay
    const timer = setTimeout(() => setShowCriminalMsg(true), 800);
    return () => clearTimeout(timer);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden cursor-pointer chase-ambient-flash"
      style={{ background: 'rgba(10, 14, 26, 0.95)' }}
      onClick={onDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Escape' || e.key === ' ') onDismiss(); }}
    >
      {/* Title text — flashing red/gold */}
      <p
        className="text-lg font-bold mb-2 z-[2]"
        style={{ animation: 'chaseTitleFlash 0.5s infinite alternate' }}
      >
        STOP RIGHT THERE!
      </p>

      {/* Criminal message */}
      {showCriminalMsg && (
        <div className="chase-criminal-text z-[10] px-5 mb-3">
          CONGRATULATIONS YOU ARE A CRIMINAL!
        </div>
      )}

      {/* Subtitle */}
      <p className="text-[13px] text-muted-foreground mb-8 z-[2] text-center px-4">
        Your funds are being escorted to the destination...
      </p>

      {/* Chase scene */}
      <div className="relative w-full h-[200px] overflow-hidden">
        {/* Scrolling city skyline */}
        <div className="chase-skyline absolute bottom-[80px] w-[200%] h-[60px]">
          {buildings.map((b, i) => (
            <div
              key={i}
              className="absolute bottom-0"
              style={{
                left: b.left,
                width: b.width,
                height: b.height,
                background: '#16213e',
                border: '1px solid #1e2a45',
              }}
            />
          ))}
        </div>

        {/* Road */}
        <div
          className="absolute bottom-0 w-full h-[80px]"
          style={{ background: '#1a1a2e', borderTop: '3px solid #444' }}
        >
          {/* Yellow dashed center line — scrolling */}
          <div
            className="chase-road-line absolute w-[200%] h-[4px]"
            style={{
              top: 37,
              left: 0,
              background: 'repeating-linear-gradient(90deg, #fdcb6e 0px, #fdcb6e 30px, transparent 30px, transparent 60px)',
            }}
          />
        </div>

        {/* Runner with money bags */}
        <div
          className="chase-runner absolute z-[10]"
          style={{
            bottom: 75,
            left: '30%',
            fontSize: 48,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
          }}
        >
          <span role="img" aria-label="runner">🏃💰</span>
        </div>

        {/* Flying cash behind runner */}
        {[0, 0.3, 0.6, 0.9, 1.2].map((delay, i) => (
          <div
            key={i}
            className="chase-cash-item absolute z-[9]"
            style={{
              bottom: 95 + (i % 3) * 10,
              left: `${26 - i * 2}%`,
              fontSize: 20,
              animationDelay: `${delay}s`,
            }}
          >
            <span role="img" aria-label="cash">💵</span>
          </div>
        ))}

        {/* Police car */}
        <div
          className="chase-police-car absolute z-[10]"
          style={{
            bottom: 68,
            left: '60%',
            fontSize: 52,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
          }}
        >
          <span role="img" aria-label="police car">🚔</span>
        </div>

        {/* Siren lights above police car */}
        <div
          className="absolute z-[11]"
          style={{
            bottom: 130,
            left: '63%',
            width: 30,
            height: 12,
            animation: 'chasePoliceBounce 0.25s ease-in-out infinite alternate',
          }}
        >
          <div
            className="chase-siren-red absolute rounded-full"
            style={{
              width: 14,
              height: 14,
              left: 0,
              top: 0,
              background: '#ff4444',
              boxShadow: '0 0 20px #ff4444, 0 0 40px #ff4444',
            }}
          />
          <div
            className="chase-siren-blue absolute rounded-full"
            style={{
              width: 14,
              height: 14,
              right: 0,
              top: 0,
              background: '#4444ff',
              boxShadow: '0 0 20px #4444ff, 0 0 40px #4444ff',
            }}
          />
        </div>

        {/* Dust clouds behind police car */}
        {[0, 0.3, 0.6].map((delay, i) => (
          <div
            key={i}
            className="chase-dust-cloud absolute z-[8] opacity-40"
            style={{
              bottom: 78,
              left: `${72 + i * 4}%`,
              fontSize: 24,
              animationDelay: `${delay}s`,
            }}
          >
            <span role="img" aria-label="dust">💨</span>
          </div>
        ))}
      </div>

      {/* Dismiss hint */}
      <p className="text-[12px] text-muted-foreground mt-6 z-[2] transition-colors hover:text-foreground">
        Click anywhere to dismiss
      </p>
    </div>
  );
};

export default PoliceChase;
