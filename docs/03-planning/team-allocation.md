---
tags: [hackathon, planning, team, valon]
status: reviewed
created: 2026-04-03
valon-skill: task-splitter
---

# Team Allocation

## Usman — Backend + AI Orchestration (n8n + MiniMax)

| Time | Task | Duration |
|------|------|----------|
| 10:30 | Clone repo, confirm all API keys work | 10min |
| 10:40 | Set up n8n Cloud Pro + create empty workflow with webhook trigger | 10min |
| 10:50 | Build AI routing workflow in n8n (webhook → Claude AI Agent → response) | 30min |
| 11:20 | Add MiniMax TTS node to n8n workflow | 15min |
| 11:35 | Test routing workflow end-to-end (curl webhook, verify AI response + audio) | 15min |
| 11:50 | Help Taka connect Crossmint transfer node into n8n workflow | 20min |
| 12:00 | **Lunch** — sketch integration plan with team | 30min |
| 12:30 | Test full n8n flow: optimize + transfer + TTS all in one workflow | 20min |
| 12:50 | Share webhook URLs with Tej, help connect frontend → backend | 20min |
| 1:10 | Debug integration issues (frontend ↔ n8n ↔ Crossmint) | 30min |
| 1:40 | Prepare fallback responses (hardcoded backup if APIs flake) | 15min |
| 1:55 | E2E smoke test with full team | 15min |
| 2:10 | Fix bugs from smoke test | 30min |
| 2:40 | Final code push to GitHub | 5min |
| 2:45 | Break / prep | 15min |
| 3:00 | **HARD STOP — Demo prep** | |
| 3:00 | Write demo script with team | 15min |
| 3:15 | Record demo video | 15min |
| 3:30 | Rehearse live demo | 15min |

**Total build: ~3.5h | Demo prep: 45min**

## Tej — Frontend + Design + Demo (Lovable)

| Time | Task | Duration |
|------|------|----------|
| 10:30 | Open Lovable, start dashboard project: "Cross-border treasury optimizer" | 10min |
| 10:40 | Build invoice batch table (5 pre-loaded invoices: vendor, amount, currency, country) | 20min |
| 11:00 | Build routing recommendation panel (side-by-side: traditional cost vs optimized cost) | 20min |
| 11:20 | Build savings summary hero card (big number: "$5,530 saved" + percentage) | 10min |
| 11:30 | Polish layout, colors, typography, branding | 20min |
| 11:50 | Break / review webhook URLs from Usman | 10min |
| 12:00 | **Lunch** — sketch integration plan with team | 30min |
| 12:30 | Add "Optimize" button → call n8n optimize webhook with invoice JSON | 15min |
| 12:45 | Display AI routing results in recommendation panel from webhook response | 20min |
| 1:05 | Add "Execute Payment" button → call n8n execute webhook (Crossmint) | 15min |
| 1:20 | Display tx confirmation (hash, recipient balance, success state) | 15min |
| 1:35 | Add audio player for MiniMax voice briefing | 10min |
| 1:45 | Loading states, error handling, transitions | 15min |
| 2:00 | E2E smoke test with full team | 15min |
| 2:15 | Final UI polish — make it screenshot-worthy | 30min |
| 2:45 | Export code from Lovable → push to GitHub | 15min |
| 3:00 | **HARD STOP — Demo prep** | |
| 3:00 | Write demo script with team | 15min |
| 3:15 | Record demo video (voiceover) | 15min |
| 3:30 | Rehearse live demo | 15min |

**Total build: ~3.5h | Demo prep: 45min**

## Taka — Crossmint Integration + Pitch (Crossmint + Support)

| Time | Task | Duration |
|------|------|----------|
| 10:30 | Clone repo, read MVP spec (docs/02-strategy/mvp-spec.md) | 10min |
| 10:40 | Create Crossmint staging API key + configure scopes | 10min |
| 10:50 | Create 2 agent wallets (company-treasury sender + contractor-wallet recipient) | 15min |
| 11:05 | Fund sender wallet with 1000 USDXM test stablecoins | 10min |
| 11:15 | Test wallet-to-wallet USDC transfer via curl (verify it works standalone) | 15min |
| 11:30 | Build Crossmint transfer as n8n HTTP Request node (work with Usman) | 20min |
| 11:50 | Test Crossmint node in n8n workflow — verify transfer executes from webhook | 15min |
| 12:00 | **Lunch** — sketch integration plan with team | 30min |
| 12:30 | Research pitch angle: realistic FX spread data, competitor comparison | 30min |
| 1:00 | Help Tej wire "Execute Payment" button to Crossmint transfer endpoint | 20min |
| 1:20 | Build tx confirmation display: parse Crossmint response, show wallet balances | 20min |
| 1:40 | Write pitch script draft (problem → solution → demo flow → future vision) | 20min |
| 2:00 | E2E smoke test with full team | 15min |
| 2:15 | Polish pitch script, prepare any supplementary slides if needed | 30min |
| 2:45 | Push final code to GitHub | 5min |
| 2:50 | Break / prep | 10min |
| 3:00 | **HARD STOP — Demo prep** | |
| 3:00 | Finalize demo script with team | 15min |
| 3:15 | Record demo video | 15min |
| 3:30 | Rehearse live demo (Taka can present if strongest presenter) | 15min |

**Total build: ~3.5h | Demo prep: 45min**

## Parallel Track Summary

```
10:30 - 12:00 — Maximum parallelism (3 independent tracks):
  Usman: n8n setup → AI routing workflow → MiniMax TTS
  Tej:   Lovable dashboard → invoice table → recommendations → savings card
  Taka:  Crossmint wallets → fund → test transfer → build n8n node

12:00 - 12:30 — Lunch (all together, sketch integration on paper)

12:30 - 2:00 — Integration (dependencies converge):
  Usman: Test full n8n flow → help connect frontend
  Tej:   Wire buttons to webhooks → display responses
  Taka:  Help wire Crossmint → draft pitch script

2:00 - 3:00 — Polish + Test (joint):
  All:   E2E smoke test → fix bugs → polish → push code

3:00 - 3:45 — Demo Prep (joint, non-negotiable):
  All:   Script → record video → rehearse
```

## Communication Plan

- **Slack/Discord channel:** Create a team channel on day-of for quick URL/key sharing
- **Key handoffs:**
  - Usman → Tej: n8n webhook URLs (by 12:30 latest)
  - Taka → Usman: Crossmint wallet locators + API key (by 11:30)
  - Taka → Tej: Crossmint response format for tx confirmation display (by 1:00)
- **Integration checkpoint at 12:30:** After lunch, verify all webhooks work before frontend connection
- **2:00 PM checkpoint:** Full team tests the complete flow. If something's broken, decide what to cut.
- **3:00 PM hard stop:** No exceptions. Demo prep begins.

## Why 3 People Changes Everything

With 2 people, Crossmint integration was squeezed into Usman's already-packed schedule. With Taka:

- **Usman focuses purely on n8n + AI.** No context-switching to Crossmint.
- **Taka owns Crossmint end-to-end.** Setup, testing, integration, and debugging.
- **Taka also owns the pitch draft.** This was previously unfunded time — now someone is actively writing the pitch during the build phase.
- **Net effect:** Higher quality on all 4 sponsor integrations + a better pitch.
