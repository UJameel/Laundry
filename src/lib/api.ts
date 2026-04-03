const N8N_BASE = 'https://usmanjameel.app.n8n.cloud/webhook';

export interface AnalyzeRequest {
  invoices: {
    id: string;
    vendor: string;
    country: string;
    currency: string;
    amount_usd: number;
    traditional_fx_spread: number;
    traditional_fee: number;
  }[];
}

export interface RouteResult {
  invoice_id: string;
  vendor: string;
  country: string;
  amount_usd: number;
  recommended_route: string;
  traditional_cost: number;
  optimized_cost: number;
  savings: number;
  reasoning: string;
}

export interface AnalyzeResponse {
  success: boolean;
  optimization: {
    batch_summary: {
      total_invoices: number;
      total_amount_usd: number;
      total_traditional_cost: number;
      total_optimized_cost: number;
      total_savings: number;
      savings_percentage: number;
    };
    routes: RouteResult[];
    executive_summary: string;
  };
}

export interface ExecuteResponse {
  success: boolean;
  transfer: Record<string, unknown>;
}

export interface BriefingResponse {
  success: boolean;
  audio: Record<string, unknown>;
}

export async function analyzeInvoices(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const res = await fetch(`${N8N_BASE}/laundry-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Analyze failed: ${res.status}`);
  return res.json();
}

export async function executeTransfers(routes: RouteResult[]): Promise<ExecuteResponse> {
  const res = await fetch(`${N8N_BASE}/laundry-execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routes }),
  });
  if (!res.ok) throw new Error(`Execute failed: ${res.status}`);
  return res.json();
}

export async function generateBriefing(executiveSummary: string, batchSummary: AnalyzeResponse['optimization']['batch_summary']): Promise<BriefingResponse> {
  const res = await fetch(`${N8N_BASE}/laundry-briefing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      executive_summary: executiveSummary,
      batch_summary: batchSummary,
    }),
  });
  if (!res.ok) throw new Error(`Briefing failed: ${res.status}`);
  return res.json();
}
