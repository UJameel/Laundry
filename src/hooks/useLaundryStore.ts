import { createContext, useContext } from 'react';
import type { AnalyzeResponse } from '@/lib/api';

export interface WalletEntry {
  id: string;
  label: string;
  address: string;
  currency: string;
  countryCode: string;
  balance: number;
  role: 'sender' | 'recipient';
  isDemo: boolean;
}

export interface LaundryState {
  analysisResult: AnalyzeResponse['optimization'] | null;
  setAnalysisResult: (result: AnalyzeResponse['optimization']) => void;
  transferResult: Record<string, unknown> | null;
  setTransferResult: (result: Record<string, unknown>) => void;
  briefingAudio: Record<string, unknown> | null;
  setBriefingAudio: (audio: Record<string, unknown>) => void;
  wallets: WalletEntry[];
  setWallets: (wallets: WalletEntry[]) => void;
  reset: () => void;
}

export const LaundryContext = createContext<LaundryState | null>(null);

export function useLaundryStore(): LaundryState {
  const ctx = useContext(LaundryContext);
  if (!ctx) throw new Error('useLaundryStore must be used within LaundryProvider');
  return ctx;
}
