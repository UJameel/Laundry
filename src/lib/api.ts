import { mockExecuteTransfers } from '@/lib/mockWallets';

const N8N_BASE = 'https://usmanjameel.app.n8n.cloud/webhook';
const MINIMAX_HOST = import.meta.env.VITE_MINIMAX_API_HOST ?? 'https://api.minimax.chat';
// Set VITE_USE_MOCK_TRANSFERS=true in .env to use fake wallets instead of Crossmint.
// Flip to false (or remove) once the real Crossmint integration is live.
const USE_MOCK_TRANSFERS = import.meta.env.VITE_USE_MOCK_TRANSFERS === 'true';

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
  if (USE_MOCK_TRANSFERS) {
    // Simulate network latency so the animation plays out naturally
    await new Promise((r) => setTimeout(r, 2800));
    return { success: true, transfer: mockExecuteTransfers(routes) as unknown as Record<string, unknown> };
  }
  const res = await fetch(`${N8N_BASE}/laundry-execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routes }),
  });
  if (!res.ok) throw new Error(`Execute failed: ${res.status}`);
  return res.json();
}

// --- MiniMax Compliance Check ---

export interface ComplianceResult {
  country: string;
  countryCode: string;
  compliant: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'blocked';
  reason: string;
  flags: string[];
}

/**
 * Uses MiniMax M2.7 LLM to assess regulatory compliance for each destination
 * country before executing cross-border USDC transfers.
 *
 * Checks against: OFAC SDN list, FATF blacklist/greylist, UN & EU sanctions.
 * Returns a ComplianceResult per destination — "blocked" risk_level means the
 * transfer must NOT proceed.
 */
export async function checkCountryCompliance(
  destinations: { country: string; countryCode: string; amount_usd: number }[]
): Promise<ComplianceResult[]> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
  if (!apiKey) throw new Error('VITE_MINIMAX_API_KEY is not set');

  const userPrompt = `You are a compliance officer specialising in cross-border money transfers and AML regulations.

Assess the compliance risk for sending USDC cryptocurrency payments to the following destination countries. Evaluate each against:
1. OFAC SDN (Specially Designated Nationals) sanctions list
2. FATF blacklist and greylist
3. UN Security Council sanctions
4. EU consolidated sanctions list
5. General AML/CFT (counter-financing of terrorism) risk profile

Destinations:
${JSON.stringify(destinations, null, 2)}

Respond with ONLY a valid JSON array — no markdown, no explanation — in exactly this format:
[
  {
    "country": "Country Name",
    "countryCode": "XX",
    "compliant": true,
    "risk_level": "low",
    "reason": "One-sentence assessment.",
    "flags": ["any specific regulatory notes"]
  }
]

risk_level values:
- "blocked" → active OFAC/UN/EU sanctions — transfer PROHIBITED
- "high"    → FATF greylist or significant AML concerns — enhanced due diligence required
- "medium"  → elevated-risk jurisdiction — standard due diligence required
- "low"     → standard jurisdiction — normal compliance procedures apply

Set compliant=false only when risk_level is "blocked".`;

  const res = await fetch(`${MINIMAX_HOST}/v1/text/chatcompletion_v2`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'MiniMax-Text-01',
      messages: [
        {
          role: 'system',
          content: 'You are a financial compliance expert. Respond with valid JSON only — no markdown.',
        },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) throw new Error(`MiniMax compliance check failed: ${res.status}`);

  const data = await res.json();
  // MiniMax v2 wraps reply in choices[0].message.content; older API uses data.reply
  const content: string = data.choices?.[0]?.message?.content ?? data.reply ?? '';

  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('MiniMax returned an unexpected compliance response format');

  return JSON.parse(jsonMatch[0]) as ComplianceResult[];
}

// ---------------------------------

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
