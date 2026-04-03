import { createContext, useContext } from 'react';
import type { AnalyzeResponse } from '@/lib/api';

export interface LaundryState {
  analysisResult: AnalyzeResponse['optimization'] | null;
  setAnalysisResult: (result: AnalyzeResponse['optimization']) => void;
  transferResult: Record<string, unknown> | null;
  setTransferResult: (result: Record<string, unknown>) => void;
  briefingAudio: Record<string, unknown> | null;
  setBriefingAudio: (audio: Record<string, unknown>) => void;
  reset: () => void;
}

export const LaundryContext = createContext<LaundryState | null>(null);

export function useLaundryStore(): LaundryState {
  const ctx = useContext(LaundryContext);
  if (!ctx) throw new Error('useLaundryStore must be used within LaundryProvider');
  return ctx;
}
