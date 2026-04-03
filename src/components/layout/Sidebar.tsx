import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Inbox, Settings, RotateCw, CheckCircle, Mic } from 'lucide-react';
import WaterTransition from '@/components/transitions/WaterTransition';

const navItems = [
  { icon: Wallet, label: 'Wallets', path: '/wallets' },
  { icon: Inbox, label: 'Load', path: '/' },
  { icon: Settings, label: 'Wash Cycle', path: '/wash' },
  { icon: RotateCw, label: 'Spin', path: '/spin' },
  { icon: CheckCircle, label: 'Rinse', path: '/rinse' },
  { icon: Mic, label: 'Briefing', path: '/briefing' },
];

interface SidebarProps {
  currentPath: string;
}

const Sidebar = ({ currentPath }: SidebarProps) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleNav = useCallback((path: string) => {
    if (path === currentPath) return;
    setIsTransitioning(true);
    setPendingPath(path);
  }, [currentPath]);

  const handleTransitionComplete = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
    setTimeout(() => setIsTransitioning(false), 200);
  }, [pendingPath, navigate]);

  return (
    <>
      <WaterTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />
      <aside className="fixed left-0 top-16 bottom-0 w-60 bg-card border-r border-border flex flex-col py-6 z-40">
        <nav className="flex-1 flex flex-col gap-0.5 px-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all relative
                  ${isActive
                    ? 'text-foreground bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-primary rounded-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-6 pt-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground/60 text-center tracking-widest uppercase">
            100% legal. 0% laundering.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
