import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useWaterTransition = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const navigateWithWater = useCallback((path: string) => {
    setIsTransitioning(true);
    setPendingPath(path);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
    // Small delay before hiding overlay so new page renders underneath
    setTimeout(() => setIsTransitioning(false), 200);
  }, [pendingPath, navigate]);

  return { isTransitioning, navigateWithWater, handleTransitionComplete };
};
