import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Globe, Menu, X } from 'lucide-react';
import WaterTransition from '@/components/transitions/WaterTransition';

const navItems = [
  { label: 'Wallets', path: '/wallets' },
  { label: 'Load', path: '/' },
  { label: 'Wash', path: '/wash' },
  { label: 'Spin', path: '/spin' },
  { label: 'Rinse', path: '/rinse' },
  { label: 'Briefing', path: '/briefing' },
];

interface NavbarProps {
  statusText?: string;
  statusColor?: 'teal' | 'green' | 'muted' | 'red' | 'yellow';
}

const Navbar = ({ statusText = 'Idle', statusColor = 'muted' }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleNav = useCallback((path: string) => {
    if (path === location.pathname) return;
    setIsTransitioning(true);
    setPendingPath(path);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleTransitionComplete = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
    setTimeout(() => setIsTransitioning(false), 200);
  }, [pendingPath, navigate]);

  const colorMap: Record<string, string> = {
    teal: 'bg-[#14B8A6]/20 text-[#67E8F9] border-[#14B8A6]/30',
    green: 'bg-[#14B8A6]/20 text-[#67E8F9] border-[#14B8A6]/30',
    muted: 'bg-white/10 text-white/60 border-white/15',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    yellow: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  };

  return (
    <>
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              className="relative flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 32,
                height: 32,
                border: '2px solid rgba(20, 184, 166, 0.4)',
                background: 'linear-gradient(135deg, #1E3A8A, #14B8A6)',
                boxShadow: '0 2px 8px rgba(20, 184, 166, 0.25)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              {[0, 60, 120].map((deg) => (
                <div
                  key={deg}
                  className="absolute h-full w-[1px]"
                  style={{ background: 'rgba(255, 255, 255, 0.15)', transform: `rotate(${deg}deg)` }}
                />
              ))}
              <div className="absolute inset-[3px] rounded-full border border-white/15" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-white/50 top-1 left-1" />
            </motion.div>
            <span className="text-[15px] font-bold tracking-tight text-white font-display">
              Laundry
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`relative px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: '#14B8A6' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Status pill */}
            {statusText && (
              <div className={`hidden sm:flex items-center px-3 py-1 rounded-full text-[10px] font-medium tracking-wide border ${colorMap[statusColor]}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                  statusColor === 'teal' ? 'bg-[#14B8A6] animate-pulse' :
                  statusColor === 'green' ? 'bg-[#14B8A6]' :
                  statusColor === 'red' ? 'bg-red-400' :
                  statusColor === 'yellow' ? 'bg-yellow-400' :
                  'bg-white/40'
                }`} />
                {statusText}
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/8 text-white/50 text-[10px] font-mono border border-white/10">
              <Globe className="w-3 h-3" />
              Testnet
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/8 text-white text-[10px] font-mono border border-white/10">
              <Wallet className="w-3 h-3 text-[#14B8A6]" />
              $10,000
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-16 left-0 right-0 border-t border-white/10"
            style={{ background: '#0F172A' }}
          >
            <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`px-4 py-2.5 rounded-lg text-[13px] font-medium text-left transition-colors ${
                      isActive
                        ? 'text-white bg-[#14B8A6]'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
