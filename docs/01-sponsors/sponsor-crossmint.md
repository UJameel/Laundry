---
tags: [hackathon, sponsor, crossmint, valon]
status: reviewed
created: 2026-04-03
source: Web research + GitHub repos + event slides
valon-skill: sponsor-research
---

# Sponsor: Crossmint

## What They Offer
All-in-one stablecoin infrastructure platform: wallets, payments, onramps, and **AI agent wallets**. Think Stripe for USDC onchain. You call REST APIs or use their TypeScript SDK — Crossmint handles wallet creation, signing, gas, and settlement across 50+ chains.

## Credits
- **Redemption:** crossmint.com/console → redeem code: `HAC15`
- **Note:** `HAC15` applies to **production console**, not staging. Staging is free regardless.
- **What you get:** Console credits for API usage (wallets + transactions)

## Key Capabilities

| Pillar | What It Does |
|--------|-------------|
| **Smart Wallets** | Create wallets for users or AI agents. Identified by email, userId, phone. No raw key management. |
| **Checkout** | Programmatic purchase API. MCP server available for Claude. |
| **Onramp** | Credit/debit card → USDC onchain. Users fund wallets without needing crypto. |
| **Agent Commerce (x402)** | HTTP payment protocol — APIs return `402 Payment Required`, agents autonomously pay USDC to get the response. |

- **Supported chains:** Ethereum, Base, Polygon, Arbitrum, Optimism, Solana, Stellar, + 40 more
- **Best chain for hackathon:** Base Sepolia (EVM, low fees, all demos default to it)
- **Test stablecoin:** `USDXM` on staging (not real USDC)

## Pre-built Skills & Tooling (RICH ECOSYSTEM)

- **MCP Server:** `Crossmint/mcp-crossmint-checkout` (OFFICIAL)
  - Tools: `create-order`, `check-order`, `get-usd-balance`
  - Source: https://github.com/Crossmint/mcp-crossmint-checkout
  - Supports test and production modes

- **Agent Knowledge Skill:** `npx skills add crossmint/agent-skills`
  - Teaches agents about Crossmint products, wallet types, chain selection
  - Works with Claude Code, Cursor, Codex, Windsurf
  - Source: https://github.com/Crossmint/agent-skills

- **n8n Integration Node:** `n8n-nodes-crossmint`
  - Wallets and checkout as n8n workflow nodes — **DOUBLE SPONSOR SYNERGY**
  - Source: https://github.com/Crossmint/n8n-nodes-crossmint

- **Lobster CLI:** Agent wallet + virtual card from command line
  ```bash
  npm install @crossmint/lobster-cli
  lobstercash setup       # creates Solana wallet
  lobstercash balance
  lobstercash send --to <addr> --amount 10 --token usdc
  lobstercash x402 fetch <url>   # auto-pays x402 endpoints
  ```

- **Agentic Finance Reference Repo:** https://github.com/Crossmint/crossmint-agentic-finance
  - x402 HTTP paywalls (Express, Base Sepolia)
  - Agent-to-agent payments (A2A protocol + EIP-3009)
  - MCP-based autonomous event booking
  - **THIS IS GOLD FOR THE HACKATHON — runnable demos directly relevant to the theme**

- **Fintech Starter App:** https://github.com/Crossmint/fintech-starter-app
  ```bash
  git clone https://github.com/crossmint/fintech-starter-app.git
  cd fintech-starter-app && npm install
  cp .env.template .env && npm run dev
  ```
  Includes: email login, auto-wallet, card top-up, USDC transfer, tx history, DeFi yield.

## SDKs

| Package | Install |
|---------|---------|
| `@crossmint/wallets-sdk` | `npm install @crossmint/wallets-sdk` |
| `@crossmint/client-sdk-react-ui` | `npm install @crossmint/client-sdk-react-ui` |
| `@crossmint/server-sdk` | `npm install @crossmint/server-sdk` |

## Quick Start (Fastest Path)

**Step 1: API key (2 min)**
- Staging console (free, testnets): https://staging.crossmint.com/console
- Create server key. Enable scopes: `wallets.create`, `wallets.read`, `wallets:transactions.create`, `wallets:balance.read`, `wallets.fund`

**Step 2: Create a wallet**
```bash
curl --request POST \
  --url https://staging.crossmint.com/api/2025-06-09/wallets \
  --header 'Content-Type: application/json' \
  --header 'X-API-KEY: YOUR_API_KEY' \
  --data '{"type":"smart","chainType":"evm","config":{"adminSigner":{"type":"api-key"}}}'
```

**Step 3: Fund on staging (test tokens)**
```bash
curl --request POST \
  --url "https://staging.crossmint.com/api/v1-alpha2/wallets/email:user@example.com:evm-smart-wallet/balances" \
  --header 'X-API-KEY: YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"amount": 100, "currency": "usdxm"}'
```

**Step 4: Or just clone the fintech starter (5 min full-stack)**
```bash
git clone https://github.com/crossmint/fintech-starter-app.git
cd fintech-starter-app && npm install && cp .env.template .env && npm run dev
```

## Integration Ideas for Finance Hackathon
- **AI Financial Advisor with Execution.** Agent analyzes portfolio, gives advice, executes USDC transfers when authorized. Claude = reasoning, Crossmint = execution.
- **x402 Pay-Per-Query Financial Data API.** Build a financial data API that requires USDC micropayment per query. Demonstrates agent-to-agent commerce.
- **Agent Treasury Manager.** AI agent monitors stablecoin balances, routes vendor payments, rebalances across chains.
- **Automated Invoice Payment Agent.** Agent reads invoices, extracts payment details, executes USDC payments with human approval step.
- **Crossmint + n8n Double Sponsor.** Use the `n8n-nodes-crossmint` package for workflow automation + wallet ops in one demo.

## Gotchas
- **Staging vs Production is non-negotiable.** Stay on `staging.crossmint.com` for the hackathon. Fund wallet endpoint only works on staging.
- **USDXM ≠ USDC.** `USDXM` is the test stablecoin, staging only. For real USDC on testnets, use Circle faucet: https://faucet.circle.com/
- **API key scopes are granular.** Wrong scopes = cryptic 403 errors. Double-check scopes before building.
- **x402 is v0.1 spec.** Good enough for a hackathon demo, not battle-tested. Expect rough edges in multi-agent flows.
- **Scope creep:** Payments are exciting but complex. A simple "AI agent sends USDC" demo is more impressive than a half-built payment system.

## Key Links

| Resource | URL |
|----------|-----|
| Docs | https://docs.crossmint.com |
| LLM-optimized docs | https://docs.crossmint.com/llms.txt |
| Staging Console | https://staging.crossmint.com/console |
| Production Console | https://www.crossmint.com/console |
| Agentic Finance Demos | https://github.com/Crossmint/crossmint-agentic-finance |
| Fintech Starter App | https://github.com/Crossmint/fintech-starter-app |
| Circle USDC Faucet | https://faucet.circle.com/ |

## Why Judges Care
Crossmint is the **crypto/stablecoin sponsor** with the richest pre-built ecosystem. The `crossmint-agentic-finance` repo is directly on-theme. An AI agent that can actually move money = "wow factor" for judges. The n8n integration node means you can showcase 2 sponsors in one workflow.
