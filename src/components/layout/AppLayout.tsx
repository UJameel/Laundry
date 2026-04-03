import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CycleProgress from './CycleProgress';

interface AppLayoutProps {
  children: ReactNode;
  statusText?: string;
  statusColor?: 'teal' | 'green' | 'muted';
}

const AppLayout = ({ children, statusText, statusColor }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background dot-grid">
      <Navbar statusText={statusText} statusColor={statusColor} />
      <Sidebar currentPath={location.pathname} />
      <main className="ml-60 pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <CycleProgress currentPath={location.pathname} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
