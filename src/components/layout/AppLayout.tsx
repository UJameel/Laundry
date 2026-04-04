import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import CycleProgress from './CycleProgress';

interface AppLayoutProps {
  children: ReactNode;
  statusText?: string;
  statusColor?: 'teal' | 'green' | 'muted' | 'red' | 'yellow';
}

const AppLayout = ({ children, statusText, statusColor }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen ambient-bg grain">
      <Navbar statusText={statusText} statusColor={statusColor} />
      <main className="relative z-[1] pt-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-16">
          <CycleProgress currentPath={location.pathname} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
