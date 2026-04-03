import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LaundryContext } from "@/hooks/useLaundryStore";
import type { WalletEntry } from "@/hooks/useLaundryStore";
import type { AnalyzeResponse } from "@/lib/api";
import { SENDER_WALLET, RECIPIENT_WALLETS } from "@/lib/mockWallets";
import LoadPage from "./pages/LoadPage";
import WalletPage from "./pages/WalletPage";
import WashCyclePage from "./pages/WashCyclePage";
import SpinPage from "./pages/SpinPage";
import RinsePage from "./pages/RinsePage";
import BriefingPage from "./pages/BriefingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const defaultWallets: WalletEntry[] = [
  { ...SENDER_WALLET, countryName: SENDER_WALLET.countryName, role: 'sender', isDemo: true },
  ...Object.values(RECIPIENT_WALLETS).map((w) => ({ ...w, countryName: w.countryName, role: 'recipient' as const, isDemo: true })),
];

const App = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse['optimization'] | null>(null);
  const [transferResult, setTransferResult] = useState<Record<string, unknown> | null>(null);
  const [briefingAudio, setBriefingAudio] = useState<Record<string, unknown> | null>(null);
  const [wallets, setWallets] = useState<WalletEntry[]>(defaultWallets);
  const reset = () => { setAnalysisResult(null); setTransferResult(null); setBriefingAudio(null); };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LaundryContext.Provider value={{ analysisResult, setAnalysisResult, transferResult, setTransferResult, briefingAudio, setBriefingAudio, wallets, setWallets, reset }}>
          <BrowserRouter>
            <Routes>
              <Route path="/wallets" element={<WalletPage />} />
              <Route path="/" element={<LoadPage />} />
              <Route path="/wash" element={<WashCyclePage />} />
              <Route path="/spin" element={<SpinPage />} />
              <Route path="/rinse" element={<RinsePage />} />
              <Route path="/briefing" element={<BriefingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LaundryContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
