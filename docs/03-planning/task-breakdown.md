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
Hard stop coding:     3:15 PM
Demo prep starts:     3:15 PM
Presentations:        4:00 PM
```

## Task Table

| # | Task | Est. | Depends On | Owner | Sponsor | Status |
|---|------|------|------------|-------|---------|--------|
| **SETUP (10:30 - 10:50)** |
| 1 | Clone repo, set up project structure, confirm all API keys work | 10min | — | Usman | — | ○ |
| 2 | Create Crossmint staging API key + 2 agent wallets (sender + recipient) | 10min | — | Usman | Crossmint | ○ |
| 3 | Set up n8n Cloud Pro + create empty workflow with webhook trigger | 10min | — | Usman | n8n | ○ |
| 4 | Open Lovable, start new project: "Treasury dashboard for cross-border payments" | 10min | — | Tej | Lovable | ○ |
| **PARALLEL BUILD (10:50 - 12:00)** |
| 5 | Lovable: Build invoice batch table (5 pre-loaded invoices with vendor, amount, currency, country) | 20min | 4 | Tej | Lovable | ○ |
| 6 | Lovable: Build routing recommendation panel (side-by-side: traditional cost vs optimized cost per invoice) | 20min | 5 | Tej | Lovable | ○ |
| 7 | Lovable: Build savings summary hero card (big number: "$5,530 saved" + percentage) | 10min | 6 | Tej | Lovable | ○ |
| 8 | n8n: Build AI routing workflow — webhook receives invoice JSON → Claude AI Agent analyzes → returns routing recommendations JSON | 30min | 3 | Usman | n8n | ○ |
| 9 | n8n: Add Crossmint transfer node — HTTP Request to Crossmint staging API to execute USDC transfer | 20min | 2, 8 | Usman | Crossmint | ○ |
| 10 | n8n: Add MiniMax TTS node — send summary text → get audio URL back | 15min | 8 | Usman | MiniMax | ○ |
| **LUNCH + CONNECT (12:00 - 12:45)** |
| 11 | Eat lunch. Sketch integration plan on paper: which Lovable buttons call which n8n webhooks | 15min | — | Both | — | ○ |
| **INTEGRATION (12:45 - 2:15)** |
| 12 | Lovable: Add "Optimize" button that calls n8n webhook with invoice batch JSON | 15min | 7, 8 | Tej | Lovable + n8n | ○ |
| 13 | Lovable: Display AI routing response — populate recommendation panel with n8n results | 20min | 12 | Tej | Lovable | ○ |
| 14 | Lovable: Add "Execute Payment" button on recommended invoice → calls n8n Crossmint transfer endpoint | 15min | 9, 13 | Tej | Lovable + Crossmint | ○ |
| 15 | Lovable: Display transaction confirmation (tx hash, recipient balance, success state) | 15min | 14 | Tej | Lovable + Crossmint | ○ |
| 16 | Lovable: Add "Listen to Briefing" audio player that plays MiniMax TTS response | 10min | 10, 13 | Tej | Lovable + MiniMax | ○ |
| 17 | n8n: Test full flow end-to-end — webhook in → AI analysis → Crossmint transfer → TTS → response out | 20min | 9, 10 | Usman | All | ○ |
| **POLISH + TEST (2:15 - 3:00)** |
| 18 | E2E smoke test: click Optimize → see recommendations → click Execute → see tx confirmation → play voice | 15min | 15, 16, 17 | Both | All | ○ |
| 19 | UI polish: fix spacing, colors, loading states, error handling on happy path | 20min | 18 | Tej | Lovable | ○ |
| 20 | Prepare fallback: if Crossmint flakes, hardcode a successful tx response so demo doesn't break | 10min | 18 | Usman | — | ○ |
| **DEMO PREP (3:00 - 3:45) — HARD STOP CODING** |
| 21 | Write demo script: problem → solution → dashboard → optimize → voice → execute → future | 15min | 18 | Both | — | ○ |
| 22 | Record 3-min demo video (screen recording + voiceover) | 15min | 21 | Usman | — | ○ |
| 23 | Rehearse live demo once. Time it. Fix anything that stutters. | 10min | 22 | Both | — | ○ |
| 24 | Push final code to GitHub | 5min | 19, 20 | Usman | — | ○ |

## Critical Path

```
Setup:  1 → 3 → 8 → 9 → 17 → 18 → 21 → 22
              ↘ 10 ↗
        2 ────↗

This is Usman's path. If task 8 (AI routing workflow) takes longer
than 30min, everything downstream slips.

FALLBACK: If task 8 takes >45min, simplify Claude prompt to just
return hardcoded recommendations. Get the webhook working first,
make the AI smarter later.
```

## Parallelizable Tasks

```
10:30 - 12:00 — Maximum parallelism:
  Usman: Tasks 1,2,3 → 8 → 9,10
  Tej:   Task 4 → 5 → 6 → 7

12:45 - 2:15 — Integration (some dependencies):
  Tej:   12 → 13 → 14 → 15 → 16  (needs Usman's webhooks working)
  Usman: 17 → helps Tej debug integration

2:15 - 3:00 — Joint:
  Both:  18 → 19/20 (parallel) → done
```

## Cutoff Decisions (Pre-decided)

| Time | Check | If Behind |
|------|-------|-----------|
| **12:00 PM** | Is n8n webhook returning AI recommendations? | If NO: Simplify Claude prompt to return hardcoded JSON. Fix AI later. |
| **1:30 PM** | Is Lovable connected to n8n and showing results? | If NO: Drop MiniMax TTS (task 10, 16). Focus on core flow. |
| **2:30 PM** | Is Crossmint transfer working? | If NO: Hardcode tx confirmation in UI. Show Crossmint wallet in pitch as "execution layer ready." |
| **3:00 PM** | HARD STOP. No exceptions. | Start demo prep with whatever works. A polished demo of 2 features beats a broken demo of 4. |

## Sponsor Integration Order

| Priority | Sponsor | When | Why First |
|----------|---------|------|-----------|
| 1 | **n8n** | Tasks 3, 8 (first hour) | Everything depends on the backend webhook |
| 2 | **Lovable** | Tasks 4-7 (first hour, parallel) | Judges see this — must be polished |
| 3 | **Crossmint** | Task 9 (end of first sprint) | Wow moment — live USDC transfer |
| 4 | **MiniMax** | Task 10 (after routing works) | Nice-to-have — first to cut if behind |
