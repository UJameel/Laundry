---
tags: [hackathon, planning, team, valon]
status: reviewed
created: 2026-04-03
valon-skill: task-splitter
---

# Team Allocation

## Usman — Backend + AI + Integrations

| Time | Task | Duration |
|------|------|----------|
| 10:30 | Clone repo, confirm API keys | 10min |
| 10:35 | Create Crossmint staging wallets | 10min |
| 10:45 | Set up n8n Cloud Pro + webhook | 10min |
| 10:55 | Build AI routing workflow in n8n (Claude agent) | 30min |
| 11:25 | Add Crossmint transfer node to n8n | 20min |
| 11:45 | Add MiniMax TTS node to n8n | 15min |
| 12:00 | **Lunch** — sketch integration with Tej | 30min |
| 12:30 | Test full n8n flow end-to-end | 20min |
| 12:50 | Help Tej connect frontend → backend webhooks | 30min |
| 1:20 | Debug integration issues | 30min |
| 1:50 | Prepare fallback responses (hardcoded backup) | 10min |
| 2:00 | E2E smoke test with Tej | 15min |
| 2:15 | Fix bugs from smoke test | 30min |
| 2:45 | Final code push to GitHub | 5min |
| 2:50 | Break / prep | 10min |
| 3:00 | **HARD STOP — Demo prep** | |
| 3:00 | Write demo script with Tej | 15min |
| 3:15 | Record demo video | 15min |
| 3:30 | Rehearse live demo | 15min |

**Total build: ~3.5h | Demo prep: 45min**

## Tej — Frontend + Design + Demo

| Time | Task | Duration |
|------|------|----------|
| 10:30 | Open Lovable, start dashboard project | 10min |
| 10:40 | Build invoice batch table (5 sample invoices) | 20min |
| 11:00 | Build routing recommendation panel (traditional vs optimized side-by-side) | 20min |
| 11:20 | Build savings summary hero card (big number + percentage) | 10min |
| 11:30 | Polish layout, colors, typography | 20min |
| 11:50 | Break / review Usman's webhook URLs | 10min |
| 12:00 | **Lunch** — sketch integration with Usman | 30min |
| 12:30 | Add "Optimize" button → call n8n webhook | 15min |
| 12:45 | Display AI routing results in recommendation panel | 20min |
| 1:05 | Add "Execute Payment" button → call Crossmint transfer | 15min |
| 1:20 | Display tx confirmation (hash, balance, success) | 15min |
| 1:35 | Add audio player for MiniMax voice briefing | 10min |
| 1:45 | Loading states, error handling, transitions | 15min |
| 2:00 | E2E smoke test with Usman | 15min |
| 2:15 | Final UI polish — make it screenshot-worthy | 30min |
| 2:45 | Export code from Lovable → push to GitHub | 15min |
| 3:00 | **HARD STOP — Demo prep** | |
| 3:00 | Write demo script with Usman | 15min |
| 3:15 | Record demo video (voiceover) | 15min |
| 3:30 | Rehearse live demo | 15min |

**Total build: ~3.5h | Demo prep: 45min**

## If a 3rd Person Joins

Assign them:
1. **Demo prep owner** — They write the pitch script, prepare slides if needed, own the demo video recording
2. **Research support** — Look up realistic FX rates for the sample data, validate the savings math
3. **Crossmint deep dive** — If they're technical, they take over Crossmint integration from Usman (freeing Usman to focus on n8n + AI)

Onboard in 5 minutes: "Here's the repo. Here's the MVP spec in docs/02-strategy/. We're building an AI treasury optimizer. You own [specific task]."

## Communication Plan

- **Slack/Discord:** Share n8n webhook URLs as soon as they're live
- **Integration checkpoint at 12:30:** After lunch, verify Usman's webhooks work before Tej starts connecting
- **2:00 PM checkpoint:** Both test the full flow together. If something's broken, decide what to cut.
- **3:00 PM hard stop:** No exceptions. Demo prep begins.
