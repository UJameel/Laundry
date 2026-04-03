---
tags: [hackathon, planning, setup, valon]
status: reviewed
created: 2026-04-03
valon-skill: setup-checklist
---

# Setup Checklist

## Before the Hackathon (DO TONIGHT)

### Git & Repo
- [x] GitHub repo created: https://github.com/UJameel/Laundry
- [x] Tej has push access
- [x] Taka has push access
- [x] Branch strategy: **main only** — keep it simple, commit often
- [x] .gitignore for Node/TypeScript added
- [x] Vercel linked to GitHub repo (auto-deploys on push)

### Sponsor Accounts & API Keys

#### Lovable
- [x] Account created at https://lovable.dev
- [x] Apply discount code `COMM-BUILD-3890` in Settings → Plans & Credits
- [x] Verify Pro Plan 1 active (100 credits)
- [x] Smoke test: create a test project, generate a simple page, confirm it works
- [x] Connect GitHub integration — Tej built full frontend in Lovable, merged into main repo

#### n8n
- [x] Account created at https://app.n8n.cloud
- [x] Apply voucher `2026-COMMUNITY-HACKATHON-SF-BFC634C3`
- [x] Verify Cloud Pro plan active
- [x] Smoke test: workflow created with 3 webhook flows (analyze, execute, briefing)
- [x] Add OpenAI API key in Credentials (switched from Anthropic due to billing — using GPT-4o)
- [x] Webhook base URL: `https://usmanjameel.app.n8n.cloud/webhook/`
- [x] Workflow published and active (ID: 3ZQ1rUxmixxFHyRD)
- [ ] Add Crossmint API key to execute HTTP Request node headers
- [ ] Add MiniMax API key to briefing HTTP Request node headers

#### Crossmint
- [x] Account created at https://staging.crossmint.com/console (STAGING — not production)
- [ ] Redeem `HAC15` at https://www.crossmint.com/console (production credits)
- [x] Create server API key with scopes: `wallets.create`, `wallets.read`, `wallets:transactions.create`, `wallets:balance.read`, `wallets.fund`
- [x] Save API key as `CROSSMINT_API_KEY` (in .env and GitHub secrets)
- [ ] **NOW: Create 2 wallets** — "company-treasury" (sender) and "contractor-wallet" (recipient)
- [ ] **NOW: Fund sender wallet** with 1000 USDXM (test stablecoin)
- [ ] **NOW: Test standalone transfer** via curl before wiring to n8n
- [ ] Save both wallet addresses/locators and share with Usman

#### MiniMax
- [x] Account created at https://platform.minimax.io
- [x] Group ID submitted via form
- [x] $30 credits confirmed in balance
- [x] API key obtained from platform
- [x] Save API key as `MINIMAX_API_KEY` (in .env and GitHub secrets)
- [ ] **NOW: Add MiniMax API key as Bearer token in n8n briefing HTTP Request node**
- [ ] **NOW: Test TTS endpoint returns audio data**
- [ ] Smoke test TTS:
  ```bash
  curl -X POST https://api.minimax.chat/v1/t2a_v2 \
    -H "Authorization: Bearer YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"speech-02-hd","text":"Treasury optimization complete. You saved fourteen thousand dollars."}'
  ```

#### Claude API / OpenAI API (for n8n AI Agent)
- [x] Anthropic API key saved but **billing too low** — not usable
- [x] Switched to OpenAI GPT-4o — key saved as `OPENAI_API_KEY`
- [x] GPT-4o credential configured in n8n and tested working
- [x] Analyze endpoint returns real AI route optimizations with structured output

### Communication
- [ ] Join hackathon Discord: https://discord.gg/mVE5MyNf
- [ ] Introduce yourself in #introductions
- [ ] Unlock channels in #event-access
- [ ] Share n8n webhook URLs with Tej once created

### Demo Tools
- [ ] Screen recording tool ready (QuickTime / OBS / Loom)
- [ ] Test a 30-second screen recording to confirm audio + screen capture works
- [ ] Laptop charged, charger packed

---

## .env Template

Create `.env` in project root (add to .gitignore first):

```bash
# Crossmint (staging)
CROSSMINT_API_KEY=sk_staging_...
CROSSMINT_BASE_URL=https://staging.crossmint.com/api
CROSSMINT_SENDER_WALLET=  # company treasury wallet locator
CROSSMINT_RECEIVER_WALLET=  # contractor wallet locator

# MiniMax
MINIMAX_API_KEY=
MINIMAX_API_HOST=https://api.minimax.chat

# Claude (for n8n — also add in n8n credentials UI)
ANTHROPIC_API_KEY=sk-ant-...

# n8n (webhook URLs — fill in after creating workflows)
N8N_OPTIMIZE_WEBHOOK=https://your-instance.app.n8n.cloud/webhook/optimize
N8N_EXECUTE_WEBHOOK=https://your-instance.app.n8n.cloud/webhook/execute
```

---

## Sample Invoice Data (Pre-load This)

Save as `data/sample-invoices.json` in the repo:

```json
[
  {
    "id": "INV-001",
    "vendor": "DevCo Buenos Aires",
    "country": "Argentina",
    "currency": "ARS",
    "amount_usd": 45000,
    "description": "Q1 software development services",
    "traditional_fx_spread": 0.05,
    "traditional_fee": 45
  },
  {
    "id": "INV-002",
    "vendor": "Design Studio Berlin",
    "country": "Germany",
    "currency": "EUR",
    "amount_usd": 62000,
    "description": "UX redesign project",
    "traditional_fx_spread": 0.03,
    "traditional_fee": 35
  },
  {
    "id": "INV-003",
    "vendor": "CloudOps Lagos",
    "country": "Nigeria",
    "currency": "NGN",
    "amount_usd": 28000,
    "description": "Infrastructure management",
    "traditional_fx_spread": 0.06,
    "traditional_fee": 75
  },
  {
    "id": "INV-004",
    "vendor": "Legal Counsel London",
    "country": "UK",
    "currency": "GBP",
    "amount_usd": 35000,
    "description": "Regulatory compliance review",
    "traditional_fx_spread": 0.02,
    "traditional_fee": 25
  },
  {
    "id": "INV-005",
    "vendor": "Consulting Tokyo",
    "country": "Japan",
    "currency": "JPY",
    "amount_usd": 37000,
    "description": "Market entry analysis",
    "traditional_fx_spread": 0.03,
    "traditional_fee": 30
  }
]
```

**Total: $207,000 | Traditional fees: ~$7,600 | Optimized: ~$2,070 | Savings: ~$5,530**

---

## Starter Repos to Consider

- **Crossmint Fintech Starter App:** https://github.com/crossmint/fintech-starter-app
  - Already has wallet creation, USDC transfers, tx history
  - Could use as a base instead of building from scratch in Lovable
  - Tradeoff: less Lovable usage (sponsor coverage) but faster Crossmint integration

- **Crossmint Agentic Finance Demos:** https://github.com/Crossmint/crossmint-agentic-finance
  - Reference code for agent wallets, x402 paywalls, agent-to-agent payments
  - Good for copy-pasting Crossmint API patterns

**Recommended approach:** Build UI in Lovable (max sponsor visibility), reference Crossmint starter repos for API patterns in n8n HTTP Request nodes.

---

## Morning-of Quick Checks (10:30 AM at venue)

- [ ] WiFi works, laptop connected
- [ ] Can access n8n Cloud (not blocked by venue network)
- [ ] Can access Lovable (not blocked)
- [ ] Can reach Crossmint staging API (curl test)
- [ ] Can reach MiniMax API (curl test)
- [ ] GitHub push works from venue WiFi
- [ ] Share this checklist with Tej
