---
tags: [hackathon, idea, strategy, valon]
status: reviewed
created: 2026-04-03
valon-skill: idea-engine
---

# Chosen Idea: AI Cross-Border Treasury Optimizer

## Elevator Pitch
Companies lose 3-7% on cross-border payments from stacked FX conversions. Our AI analyzes invoice batches, eliminates unnecessary conversions, and routes payments through USDC stablecoins — keeping transfers close to 1:1.

## Problem
- **Who:** CFOs, treasury teams, companies paying international contractors/vendors
- **Pain:** Every cross-border payment passes through banks, FX desks, and intermediaries — each adding fees and spreads. A batch of 5 invoices totaling $200K can lose $9,000+ in stacked conversions.
- **Why current solutions fail:** Banks and fintechs (Wise, Crebit) optimize individual transfers but don't optimize across a batch. They make the pipe cheaper — we reduce how often conversion happens.

## Solution
AI-powered system that:
1. Ingests invoices / payment requests
2. Analyzes currency flows across the batch
3. Determines optimal routing: convert to USDC and settle directly vs. traditional bank wire
4. Executes via Crossmint (on-ramp + stablecoin transfer)
5. Shows savings dashboard

## Key Differentiator
Not a cheaper pipe. A smarter brain. We minimize the NUMBER of conversions, not just the COST of each one.

## Compliance Approach
- System is recommendation/orchestration layer — does not hold funds or transmit money
- Crossmint handles KYC/AML/compliance on on-ramp
- Recipients hold USDC (no off-ramp needed today; off-ramp available as infrastructure expands)
- Target corridors where USDC settlement is preferred (inflation-heavy countries, crypto-native vendors, intra-company transfers)

## Sponsor Integration
| Sponsor | Role | How |
|---------|------|-----|
| **Lovable** | Frontend dashboard | Invoice upload, routing visualization, savings display |
| **n8n** | Backend orchestration | Workflow: invoice in → AI analysis → routing decision → execution |
| **Crossmint** | Payment execution | On-ramp (fiat→USDC), agent wallets, USDC transfers |
| **MiniMax** | Voice briefing | TTS summary of optimization results |

## Target Demo Corridor
US company → contractors in Argentina/Nigeria/Turkey where recipients prefer holding USDC over volatile local currency.
