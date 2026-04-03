---
tags: [hackathon, planning, tasks, valon]
status: reviewed
created: 2026-04-03
valon-skill: task-splitter
---

# Task Breakdown

## Time Budget

```
Total hackathon:      5.5 hours (10:30 AM - 4:00 PM)
Build time:           3.75 hours (225 min)
Demo prep:            0.75 hours (45 min) — NON-NEGOTIABLE
Hard stop coding:     3:00 PM
Demo prep starts:     3:00 PM
Presentations:        4:00 PM
Team size:            3 (Usman, Tej, Taka)
```

## Task Table

| # | Task | Est. | Depends On | Owner | Sponsor | Status |
|---|------|------|------------|-------|---------|--------|
| **SETUP (10:30 - 10:50)** |
| 1 | Clone repo, confirm all API keys work | 10min | — | Usman | — | ✅ |
| 2 | Create Crossmint staging API key + 2 agent wallets (sender + recipient) | 10min | — | Taka | Crossmint | ⚠️ API key exists, wallets NOT created |
| 3 | Set up n8n Cloud Pro + create empty workflow with webhook trigger | 10min | — | Usman | n8n | ✅ |
| 4 | Open Lovable, start new project: "Treasury dashboard for cross-border payments" | 10min | — | Tej | Lovable | ✅ |
| 5 | Fund sender wallet with 1000 USDXM, test wallet-to-wallet transfer via curl | 15min | 2 | Taka | Crossmint | ❌ Blocked on wallet creation |
| **PARALLEL BUILD (10:50 - 12:00) — 3 independent tracks** |
| 6 | Lovable: Build invoice batch table (5 pre-loaded invoices with vendor, amount, currency, country) | 20min | 4 | Tej | Lovable | ✅ |
| 7 | Lovable: Build routing recommendation panel (side-by-side: traditional cost vs optimized cost per invoice) | 20min | 6 | Tej | Lovable | ✅ |
| 8 | Lovable: Build savings summary hero card (big number: "$5,530 saved" + percentage) | 10min | 7 | Tej | Lovable | ✅ |
| 9 | Lovable: Polish layout, colors, typography, branding | 20min | 8 | Tej | Lovable | ✅ |
| 10 | n8n: Build AI routing workflow — webhook receives invoice JSON → GPT-4o AI Agent analyzes → returns routing recommendations JSON | 30min | 3 | Usman | n8n | ✅ Using GPT-4o (Anthropic billing issue) |
| 11 | n8n: Add MiniMax TTS node — send summary text → get audio URL back | 15min | 10 | Usman | MiniMax | ⚠️ Node exists but returns empty — needs credential config in n8n UI |
| 12 | n8n: Test routing workflow end-to-end (curl webhook, verify AI + TTS response) | 15min | 11 | Usman | n8n | ✅ Analyze works, TTS untested |
| 13 | Build Crossmint transfer as n8n HTTP Request node (with Usman) | 20min | 5, 10 | Taka | Crossmint + n8n | ⚠️ Node exists but returns empty — needs credential config + wallet locators |
| 14 | Test Crossmint node in n8n — verify USDC transfer executes from webhook call | 15min | 13 | Taka | Crossmint | ❌ |
| **LUNCH + CONNECT (12:00 - 12:30)** |
| 15 | Eat lunch. Sketch integration plan: which buttons call which webhooks. Share all URLs. | 30min | — | All | — | ✅ |
| **INTEGRATION (12:30 - 2:00)** |
| 16 | Lovable: Add "Optimize" button → call n8n optimize webhook with invoice batch JSON | 15min | 9, 12 | Tej | Lovable + n8n | ✅ Wired in WashCyclePage.tsx |
| 17 | Lovable: Display AI routing response — populate recommendation panel with n8n results | 20min | 16 | Tej | Lovable | ✅ Real AI data displayed |
| 18 | Lovable: Add "Execute Payment" button → calls n8n Crossmint transfer endpoint | 15min | 14, 17 | Tej + Taka | Lovable + Crossmint | ✅ Button wired, but execute endpoint returns empty |
| 19 | Lovable: Display transaction confirmation (tx hash, recipient balance, success) | 15min | 18 | Tej + Taka | Lovable + Crossmint | ⚠️ UI exists with hardcoded tx hash — needs real Crossmint data |
| 20 | Lovable: Add "Listen to Briefing" audio player for MiniMax TTS | 10min | 11, 17 | Tej | Lovable + MiniMax | ⚠️ Transcript display exists, audio player NOT wired (TTS endpoint broken) |
| 21 | n8n: Test full flow end-to-end — optimize + transfer + TTS all in one | 20min | 14, 12 | Usman | All | ❌ Blocked on Crossmint + MiniMax |
| 22 | Draft pitch script: problem → solution → demo flow → future vision | 20min | — | Taka | — | ○ |
| **POLISH + TEST (2:00 - 3:00)** |
| 23 | E2E smoke test: Optimize → recommendations → Execute → tx confirmation → voice | 15min | 19, 20, 21 | All | All | ❌ |
| 24 | UI polish: fix spacing, colors, loading states, error handling | 20min | 23 | Tej | Lovable | ○ |
| 25 | Prepare fallback: if Crossmint flakes, hardcode tx response so demo doesn't break | 10min | 23 | Taka | — | ○ |
| 26 | Fix bugs from smoke test | 20min | 23 | Usman | — | ○ |
| 27 | Finalize pitch script, research realistic FX data for pitch | 15min | 22 | Taka | — | ○ |
| 28 | Push final code to GitHub | 5min | 24, 25, 26 | Usman | — | ○ |
| **DEMO PREP (3:00 - 3:45) — HARD STOP CODING** |
| 29 | Finalize demo script with full team | 15min | 27 | All | — | ○ |
| 30 | Record 3-min demo video (screen recording + voiceover) | 15min | 29 | All | — | ○ |
| 31 | Rehearse live demo once. Time it. Fix anything that stutters. | 10min | 30 | All | — | ○ |

## Critical Path

```
Track 1 (Usman — n8n + AI):
  1 → 3 → 10 → 11 → 12 → 21 → 23

Track 2 (Tej — Lovable frontend):
  4 → 6 → 7 → 8 → 9 → 16 → 17 → 18 → 19 → 20 → 23

Track 3 (Taka — Crossmint + Pitch):
  2 → 5 → 13 → 14 → 18 → 25 + 22 → 27 → 29

Convergence points:
  12:00 — All 3 tracks should be independently working
  12:30 — Integration begins (frontend connects to backend)
  2:00  — E2E smoke test (everything must connect)
  3:00  — HARD STOP → demo prep
```

## Parallelizable Tasks

```
10:30 - 12:00 — 3 fully independent tracks:
  Usman: Tasks 1,3 → 10 → 11 → 12
  Tej:   Task 4 → 6 → 7 → 8 → 9
  Taka:  Task 2 → 5 → 13 → 14

12:30 - 2:00 — Integration (some dependencies):
  Tej:   16 → 17 → 18 → 19 → 20
  Usman: 21 → help debug
  Taka:  Help 18/19 → 22 (pitch draft)

2:00 - 3:00 — Joint polish:
  All:   23 → 24/25/26/27 (parallel) → 28
```

## Cutoff Decisions (Pre-decided)

| Time | Check | If Behind |
|------|-------|-----------|
| **12:00 PM** | Is n8n webhook returning AI recommendations? Is Crossmint transfer working standalone? | If n8n NO: simplify Claude prompt to hardcoded JSON. If Crossmint NO: Taka keeps debugging, Usman proceeds without it. |
| **1:30 PM** | Is Lovable connected to n8n and showing results? | If NO: Drop MiniMax TTS (tasks 11, 20). Focus on core flow. |
| **2:30 PM** | Is Crossmint transfer working from dashboard? | If NO: Hardcode tx confirmation in UI. Show Crossmint wallets in pitch as "execution layer ready." |
| **3:00 PM** | HARD STOP. No exceptions. | Start demo prep with whatever works. |

## Sponsor Integration Order

| Priority | Sponsor | Owner | When | Why |
|----------|---------|-------|------|-----|
| 1 | **n8n** | Usman | Tasks 3, 10 (first hour) | Everything depends on the backend webhook |
| 2 | **Lovable** | Tej | Tasks 4-9 (first hour) | Judges see this — must be polished |
| 3 | **Crossmint** | Taka | Tasks 2, 5, 13, 14 (first hour) | Wow moment — live USDC transfer |
| 4 | **MiniMax** | Usman | Task 11 (after routing works) | Nice-to-have — first to cut if behind |
