---
tags: [hackathon, sponsors, strategy, valon]
status: reviewed
created: 2026-04-03
source: Sponsor research compilation
valon-skill: sponsor-research
---

# Sponsor Playbook

## Overview

| Sponsor | What They Offer | Pre-built MCPs | API Key? | Integration Effort | Judge Impact |
|---------|----------------|----------------|----------|-------------------|--------------|
| **Lovable** | AI app builder (React + Supabase) | Unofficial MCP | No (web platform) | **Low** | **High** |
| **n8n** | Workflow automation + AI agents | Native MCP (client + server) | Cloud login | **Low** | **High** |
| **Crossmint** | Stablecoin wallets + agent payments | Official MCP + n8n node + fintech starter app + agentic finance demos | Yes (console) | **Low-Medium** | **Medium-High** |
| **MiniMax** | Multimodal AI (text, speech, video) | Official MCP (TTS, video, image) | Yes (API key) | **Medium** | **Medium** |

## Sponsors Requiring Early Action

| Sponsor | Action | Status |
|---------|--------|--------|
| Lovable | Apply code `COMM-BUILD-3890` in Settings → Plans & Credits | Claim NOW |
| n8n | Apply voucher `2026-COMMUNITY-HACKATHON-SF-BFC634C3` on cloud signup | Claim NOW |
| Crossmint | Redeem code `HAC15` at crossmint.com/console | Claim NOW |
| MiniMax | Submit Group ID via form, wait for credit approval | **CRITICAL — may have delay** |

## Recommended Architecture Stack

```
┌─────────────────────────────────────────┐
│          LOVABLE (Frontend)             │
│  React + TypeScript + Tailwind + shadcn │
│  Supabase (DB, Auth, Storage)           │
└────────────────┬────────────────────────┘
                 │ Webhook / API calls
                 ▼
┌─────────────────────────────────────────┐
│            n8n (Backend/Orchestrator)    │
│  AI Agent nodes + workflow automation   │
│  Connects to external APIs + LLMs      │
└────────┬───────────────┬────────────────┘
         │               │
         ▼               ▼
┌────────────────┐ ┌─────────────────────┐
│   MINIMAX      │ │    CROSSMINT        │
│   Speech/Video │ │    Agent Wallets    │
│   AI Models    │ │    USDC Payments    │
└────────────────┘ └─────────────────────┘
```

**This stack uses all 4 sponsors meaningfully:**
- Lovable = what judges SEE (UI, demo quality)
- n8n = what makes it WORK (orchestration, AI logic)
- MiniMax = what makes it MEMORABLE (voice, video)
- Crossmint = what makes it REAL (actual money movement)

## Creative Combinations

### Combo 1: "AI Financial Advisor That Speaks and Pays"
Lovable frontend → user asks financial question → n8n agent processes → MiniMax speaks the answer → Crossmint executes recommended transaction. **Hits all 4 sponsors + multiple judging criteria.**

### Combo 2: "Automated Compliance Auditor"
Lovable dashboard → upload financial docs → n8n workflow runs compliance checks → MiniMax generates audio summary of findings → results stored in Supabase. **Strong on Real-World Impact (25pts).**

### Combo 3: "Voice-First Finance Copilot"
MiniMax speech input → n8n processes request → AI agent queries financial data → Crossmint checks wallet balances → Lovable displays results + MiniMax reads them aloud. **Accessibility angle = judge differentiator.**

## Integration Priority (Given 4 Hours of Build Time)

| Priority | Sponsor | Time Budget | Why |
|----------|---------|-------------|-----|
| 1 | **Lovable** | 2 hours | Judges see this first. Must be polished. |
| 2 | **n8n** | 1.5 hours | Backend logic. Even a simple 3-node workflow counts. |
| 3 | **MiniMax** | 30 min | One TTS integration = instant "wow." Don't overcomplicate. |
| 4 | **Crossmint** | 30 min | One wallet/payment demo = "this is real." Use testnet. |

## Shortcut: Crossmint Fintech Starter App

Crossmint ships a **fintech starter app** that includes email login, auto-wallet, card top-up, USDC transfer, tx history, and DeFi yield — out of the box:
```bash
git clone https://github.com/crossmint/fintech-starter-app.git
cd fintech-starter-app && npm install && cp .env.template .env && npm run dev
```
Plus an **agentic finance demo repo** with x402 paywalls, agent-to-agent payments, and MCP-based demos: https://github.com/Crossmint/crossmint-agentic-finance

These repos alone could be the foundation of a winning project.

## Key Insight

You don't need deep integration with every sponsor. A shallow-but-working integration with all 4 beats a deep integration with 2. The goal is to show judges you understood and used the ecosystem.

**The winning formula:** Beautiful Lovable UI + n8n workflow logic + MiniMax voice output + Crossmint payment capability = all 4 sponsors, all 5 judging criteria covered.
