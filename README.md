# Laundry

**AI-powered cross-border treasury optimizer that eliminates unnecessary FX conversions using stablecoin routing.**

> Companies lose 3–7% on every cross-border payment because money gets converted multiple times through banks and intermediaries. Laundry analyzes your entire payment batch, finds which conversions are unnecessary, and routes them through stablecoins — keeping transfers as close to 1:1 as possible.

---

## The Problem

Cross-border payments are broken. Not because the rails are slow — but because the conversions are wasteful.

When a company pays an international vendor, money typically passes through multiple banks, FX desks, and intermediaries. Each one adds a spread (0.5–5%) and a flat fee ($5–$75). On a batch of 5 invoices totaling $207,000, a company can lose **$7,600+** before a single dollar reaches the recipient.

The core issue isn't that transfers are expensive — it's that **value is lost repeatedly** during conversions and routing decisions that are made without optimization.

## The Solution

Laundry is an AI-driven treasury optimizer that minimizes FX losses by **reducing or eliminating unnecessary currency conversions**.

1. **Ingest** — Upload a batch of invoices or payment requests
2. **Analyze** — AI examines the full set of payments, compares traditional bank routing costs against stablecoin routes
3. **Optimize** — Recommends the cheapest compliant path for each payment: convert once to USDC and transfer directly, or use traditional rails when that's cheaper
4. **Execute** — Triggers real stablecoin transfers via Crossmint, with full transaction confirmation
5. **Brief** — AI-generated voice summary of your treasury optimization results

**Result:** A batch that would lose $7,600 through banks costs $2,070 through Laundry. **That's $5,530 saved — a 72% reduction in payment costs.**

## How We're Different

| | Traditional Banks | Fintech (Wise, Crebit) | **Laundry** |
|--|-------------------|------------------------|-------------|
| **Approach** | Fixed FX spreads + fees per transfer | Cheaper FX rates on individual transfers | AI optimizes the entire batch — eliminates conversions, not just cheapens them |
| **Unit of optimization** | Single payment | Single payment | **All payments together** |
| **Intelligence** | None | None | AI analyzes flows, recommends routing, executes |
| **Stablecoin usage** | None | Stablecoins as cheaper pipe | Stablecoins as conversion elimination — convert once, settle directly |
| **Target user** | Everyone | Consumers, students (B2C) | CFOs, treasury teams, companies (B2B) |

**The key insight:** Competitors make the pipe cheaper. We reduce how often you use the pipe. That's a fundamentally different optimization layer.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | [Lovable](https://lovable.dev) | Treasury dashboard — invoice view, routing visualization, savings display |
| **Orchestration** | [n8n](https://n8n.io) | Backend workflow — connects AI analysis, payment execution, and voice generation |
| **AI** | Claude (via n8n) | Routing intelligence — analyzes invoices, compares routes, recommends optimal path |
| **Payments** | [Crossmint](https://crossmint.com) | Stablecoin infrastructure — agent wallets, USDC on-ramp, transfers |
| **Voice** | [MiniMax](https://minimax.io) | Text-to-speech — AI-generated treasury briefings |

## Architecture

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
   (routing    (wallets +   (voice
    logic)     transfers)  briefing)
```

## Demo

**Sample scenario:** A US-based company has 5 pending international payments:

| Vendor | Country | Amount | Traditional Cost | Laundry Cost |
|--------|---------|--------|-----------------|-------------|
| DevCo Buenos Aires | Argentina | $45,000 | $2,250 (5%) | $450 (1%) |
| Design Studio Berlin | Germany | $62,000 | $1,860 (3%) | $620 (1%) |
| CloudOps Lagos | Nigeria | $28,000 | $1,680 (6%) | $280 (1%) |
| Legal Counsel London | UK | $35,000 | $700 (2%) | $350 (1%) |
| Consulting Tokyo | Japan | $37,000 | $1,110 (3%) | $370 (1%) |
| **Total** | | **$207,000** | **$7,600** | **$2,070** |

**Savings: $5,530 (72% reduction)**

## With More Time

- **Flow netting** — Match incoming and outgoing payments in the same currency to eliminate conversions entirely
- **Live FX rates** — Real-time rate comparison across bank, fintech, and stablecoin routes
- **Off-ramp execution** — Convert USDC back to local currency as infrastructure expands
- **Invoice OCR** — Drop a PDF, AI extracts payment details automatically
- **Historical analytics** — "Last quarter you lost $142,000 to unnecessary FX conversions"
- **Multi-company treasury** — Optimize flows across subsidiaries of a multinational

## Team

- **Usman** — Backend + AI orchestration (n8n, MiniMax)
- **Tej** — Frontend + Design (Lovable, Figma)
- **Taka** — Crossmint integration + Pitch

## Built At

[Vibe-Coding HACathon](https://luma.com/oeacjgyz) — Building AI for Finance  
Hosted by Hanwha AI Center (HAC) + AI Valley  
April 3, 2026 | San Francisco, CA
