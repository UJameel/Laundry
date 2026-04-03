---
tags: [hackathon, mvp, strategy, valon]
status: reviewed
created: 2026-04-03
valon-skill: scope-cutter
---

# MVP Spec

## The One Thing
> The demo must show an AI analyzing a batch of invoices, recommending stablecoin routing to save money, and executing a real USDC transfer — with a dashboard showing the savings.

If everything else fails, the dashboard showing "You saved $X by routing through USDC" with one live Crossmint transfer must work.

---

## Core Features (4 features, all demoable, all use sponsors)

### 1. Treasury Dashboard (Lovable)
- **What:** Upload/view a batch of invoices, see currency flows, see AI routing recommendations, see total savings
- **Why MVP:** This is what judges SEE. 25pts for demo quality starts here.
- **Sponsor:** Lovable (React + Tailwind + shadcn)
- **Build time:** 1.5h
- **Owner:** Tej
- **Data:** Pre-loaded sample invoices (5 invoices, 3 currencies, ~$200K total). Do NOT build real invoice upload/parsing.
- **Key screens:**
  - Invoice batch view (table with vendor, amount, currency, country)
  - AI routing recommendation (side-by-side: traditional route cost vs. optimized route)
  - Savings summary (big number: "$14,200 saved")
  - Execute button → triggers Crossmint transfer

### 2. AI Routing Engine (n8n + Claude)
- **What:** n8n workflow receives invoice batch data → Claude analyzes → returns routing recommendation (which invoices go USDC, which go traditional, total savings)
- **Why MVP:** This is the intelligence. Without it, it's just a payment app.
- **Sponsor:** n8n (workflow orchestration) + Claude (AI reasoning)
- **Build time:** 1h
- **Owner:** Usman
- **How it works:**
  - Webhook trigger receives invoice batch JSON from Lovable frontend
  - AI Agent node with system prompt containing FX rate data + routing logic
  - Claude compares: traditional bank cost (hardcoded FX spreads 1-5% per currency) vs. USDC route cost (Crossmint on-ramp ~1% + zero transfer fee)
  - Returns JSON: per-invoice recommendation + total savings
- **Key decision:** Hardcode FX rates and fee structures. Don't waste time on live rate APIs.

### 3. Live USDC Transfer (Crossmint)
- **What:** Execute one real USDC transfer on testnet via Crossmint. Dashboard shows transaction hash + confirmation.
- **Why MVP:** This is the wow moment. "It doesn't just recommend — it executes." Real money moving (on testnet) makes judges lean forward.
- **Sponsor:** Crossmint (agent wallet + USDC transfer)
- **Build time:** 1h
- **Owner:** Usman
- **How it works:**
  - Create 2 agent wallets (sender company, recipient contractor)
  - Fund sender wallet with test USDXM on staging
  - When user clicks "Execute" in dashboard → n8n calls Crossmint API → transfer happens → return tx confirmation
  - Dashboard shows: "Payment sent. Tx: 0x... Recipient wallet balance: $X USDXM"

### 4. Voice Treasury Briefing (MiniMax)
- **What:** AI-generated voice summary: "Good morning. Your treasury has 5 pending payments totaling $207,000. I've identified $14,200 in avoidable FX costs. Here's my recommended routing..."
- **Why MVP:** Instant differentiation. Every other team shows text. You have a voice. 15pts for Technical Creativity.
- **Sponsor:** MiniMax (TTS via official MCP or API)
- **Build time:** 30min
- **Owner:** Usman
- **How it works:**
  - After AI routing analysis completes, generate a text summary
  - Send to MiniMax TTS API → get audio file back
  - Play in dashboard with a "Listen to briefing" button

---

## Out of Scope (DO NOT BUILD)

- **Invoice OCR/parsing** — Use pre-loaded sample data. Building real OCR wastes 2+ hours on something judges can't see.
- **Real FX rate APIs** — Hardcode realistic rates. The AI logic is the same whether rates are live or hardcoded.
- **Flow netting algorithm** — Too complex for 4 hours. Mention in pitch as "with more time."
- **User authentication** — No login needed for a demo. Wastes 30 min.
- **Off-ramp (USDC → local fiat)** — Not available. Framed as roadmap.
- **Multi-tenant / multi-company** — Demo is single company view.
- **Real compliance checks** — Mention Crossmint handles KYC/AML. Don't build it.

---

## With More Time (Pitch Slide Material)

- **Flow netting engine** — Automatically match incoming and outgoing payments in the same currency to eliminate conversions entirely. "If you're receiving EUR and paying EUR, why convert at all?"
- **Live FX rate integration** — Real-time rate comparison across bank, Wise, and stablecoin routes. Dynamic re-optimization as rates shift.
- **Off-ramp execution** — As Crossmint expands off-ramp partners, recipients can convert USDC to local currency directly from their wallet.
- **Invoice OCR with MiniMax** — Drop a PDF invoice, MiniMax extracts vendor, amount, currency, due date automatically.
- **Historical analytics** — "Last quarter you lost $142,000 to unnecessary FX conversions. Here's the trend."
- **Multi-company treasury** — Multinational parent company optimizing flows across all subsidiaries.

---

## Technical Approach

### Architecture
```
┌─────────────────────────────────────┐
│     LOVABLE (Dashboard UI)          │
│  Invoice view → Routing viz →       │
│  Savings display → Execute button   │
│  Voice briefing player              │
└──────────────┬──────────────────────┘
               │ Webhook calls
               ▼
┌─────────────────────────────────────┐
│     n8n (Orchestration)             │
│  Webhook → AI Agent (Claude) →      │
│  Crossmint API → MiniMax TTS →     │
│  Response to frontend               │
└──────┬──────────┬──────────┬────────┘
       │          │          │
       ▼          ▼          ▼
   Claude AI   Crossmint   MiniMax
   (routing    (wallets,   (voice
    logic)     transfers)  briefing)
```

### Data Flow
1. Dashboard loads pre-loaded invoice batch (5 invoices, 3 currencies)
2. User clicks "Optimize" → Lovable calls n8n webhook with invoice JSON
3. n8n AI Agent (Claude) analyzes batch, compares routes, returns recommendations
4. n8n calls MiniMax TTS with summary text → returns audio URL
5. n8n returns full response to Lovable (recommendations + audio + savings total)
6. Dashboard displays routing recommendations + savings + plays voice briefing
7. User clicks "Execute" on a recommended payment → n8n calls Crossmint → USDC transfer → tx confirmation displayed

### Sample Invoice Data (Pre-loaded)

| # | Vendor | Country | Currency | Amount | Traditional Cost | Optimized Cost |
|---|--------|---------|----------|--------|-----------------|----------------|
| 1 | DevCo Argentina | Argentina | ARS | $45,000 | $2,250 (5% spread) | $450 (1% on-ramp) |
| 2 | Design Studio Berlin | Germany | EUR | $62,000 | $1,860 (3% spread) | $620 (1% on-ramp) |
| 3 | Cloud Infra Lagos | Nigeria | NGN | $28,000 | $1,680 (6% spread) | $280 (1% on-ramp) |
| 4 | Legal Counsel London | UK | GBP | $35,000 | $700 (2% spread) | $350 (1% on-ramp) |
| 5 | Consulting Tokyo | Japan | JPY | $37,000 | $1,110 (3% spread) | $370 (1% on-ramp) |
| | **TOTAL** | | | **$207,000** | **$7,600 lost** | **$2,070 fees** |

**Savings shown: $5,530 (72% reduction in payment costs)**

---

## Sponsor Integration Points

| Feature | Sponsor | How It's Used | Integration Path |
|---------|---------|--------------|-----------------|
| Dashboard UI | Lovable | Generate full React dashboard via prompts | Lovable web platform |
| Workflow orchestration | n8n | Webhook → AI Agent → API calls → response | n8n Cloud Pro |
| AI routing logic | Claude (via n8n) | Analyze invoices, compare routes, recommend | n8n Anthropic Chat Model node |
| Payment execution | Crossmint | Agent wallet creation + USDC transfer on staging | Crossmint REST API via n8n HTTP Request |
| Voice briefing | MiniMax | TTS of optimization summary | MiniMax TTS API via n8n HTTP Request |

---

## Time Budget

```
Available build time:     4.0 hours
Demo prep reserved:       0.75 hours (45 min — video recording + rehearsal)
Actual build time:        3.25 hours

Feature 1 (Dashboard):   1.5h  — Tej
Feature 2 (AI routing):  1.0h  — Usman
Feature 3 (Crossmint):   0.75h — Usman (parallel with Feature 2 in n8n)
Feature 4 (MiniMax TTS): 0.25h — Usman (after routing works, add TTS call)
Integration buffer:       0.5h  — connecting frontend ↔ backend
                          ────
Total build:              4.0h (Tej: 1.5h | Usman: 2.5h | overlap saves time)

Status: TIGHT BUT FEASIBLE
```

**Fallback plan:** If Crossmint integration takes too long, fake the transfer confirmation in the UI and show the Crossmint wallet setup as a "here's the execution layer" slide. If MiniMax TTS fails, skip voice — it's a nice-to-have.

---

## Demo Story (Preview — 3 minutes)

1. **Problem** (30s): "Companies lose 3-7% on every cross-border payment. Here's a real company with 5 invoices totaling $207K — they're about to lose $7,600 in FX fees."
2. **Solution** (20s): "Our AI analyzes the entire batch, finds the optimal route for each payment, and eliminates unnecessary conversions by routing through stablecoins."
3. **Dashboard + AI** (60s): Show dashboard → click "Optimize" → AI returns recommendations → savings number drops from $7,600 to $2,070 → "That's $5,530 saved."
4. **Voice Briefing** (20s): Click play → MiniMax voice reads the treasury briefing. Judges hear AI speaking.
5. **Live Execution** (30s): Click "Execute" on Argentina payment → Crossmint transfers USDC → tx confirmation appears. "Real money just moved."
6. **With More Time** (20s): "Flow netting, live FX rates, off-ramp execution, invoice OCR. The platform gets smarter with every batch."
