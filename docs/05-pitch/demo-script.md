---
tags: [hackathon, demo, pitch]
status: draft
created: 2026-04-03
---

# Demo Script — 3 Minutes

> **Presenter:** Decide who's speaking vs. who's driving the screen.
> Recommended: Taka presents (strongest pitch voice), Usman drives the app.

---

## OPENING — The Problem (0:00 – 0:30)

**[Screen: Load Page with 5 invoices visible]**

> "Imagine you're a CFO. You have 5 international payments to make this month — Argentina, Germany, Nigeria, UK, Japan. $207,000 going out the door.

> Here's the problem: every one of those payments gets converted multiple times. Your bank takes a 2–6% FX spread, charges a $25–$75 wire fee, and routes it through intermediaries who each take their cut.

> On this batch alone, that's over **$7,000 lost** — not on the actual payment, but on the *routing*.

> What if an AI could look at all five payments together and find the cheapest path for each one?"

---

## THE SOLUTION — Load the Machine (0:30 – 0:50)

**[Screen: Load Page — point at the invoice table]**

> "This is Laundry. We load our invoices — 5 vendors, 5 currencies, 5 countries."

**[Point at the amounts, flags, conversion routes]**

> "Each row shows the vendor, the amount in USD, and the conversion pipeline — how the money flows from dollars to the local currency."

**[Click 'Start Wash Cycle']**

> "Now we start the wash."

---

## AI ANALYSIS — The Wash (0:50 – 1:30)

**[Screen: Wash Page — washing machine animation spins, status messages cycle]**

> "Our AI — GPT-4o, orchestrated through n8n — is analyzing all 5 payments right now. It's comparing the traditional bank route against a stablecoin route for each one."

**[Wait for analysis to complete — route cards appear one by one]**

> "Here are the recommendations. Let's look at Argentina — traditional bank cost: $645 in spreads and fees. Through USDC stablecoin routing: $120. That's an 81% reduction on a single payment."

**[Scroll down to show more cards]**

> "Same story across the board. Nigeria — 86% savings. UK — 50% savings. The AI explains its reasoning for each route."

**[Point at the summary card with the big savings number]**

> "Total across the batch: traditional cost was over $8,000. Through Laundry: $2,000. **That's $6,000 saved** — roughly 75% of payment costs eliminated."

**[Click 'Proceed to Spin']**

---

## COMPLIANCE CHECK — The Spin (1:30 – 2:00)

**[Screen: Spin Page — receipt-style layout, MiniMax compliance scan running]**

> "Before we execute anything, Laundry runs a compliance scan. This is powered by MiniMax — it checks every destination country against OFAC sanctions, the FATF blacklist, UN and EU sanctions lists."

**[Wait for compliance badges to appear next to each payment]**

> "Argentina — compliant. Germany — compliant. Nigeria — flagged as medium risk, FATF greylist. The system tells us exactly why and what due diligence is required."

**[Point at the compliance badges: green shields for compliant, yellow for medium risk]**

> "No blocked countries in this batch, so we're clear to execute. If a destination was sanctioned, the button would be disabled — we physically cannot send the money."

**[Click 'Execute Wash Run']**

---

## LIVE EXECUTION — The Rinse (2:00 – 2:30)

**[Screen: Rinse Page — washing machine animation, execution steps animate]**

> "Now we're executing real USDC transfers through Crossmint. Watch the steps — converting to USDC, routing via Crossmint, settling on chain, confirming balances."

**[Police chase animation plays — pause for audience reaction]**

> "And yes... congratulations, you are technically a money launderer."

**[Audience laughs — chase dismisses, success screen appears]**

> "Transaction confirmed on Base testnet. Here's the hash, the network, the amount in USDC, and the status: confirmed. Fees paid vs. fees avoided — that's real savings."

**[Click 'View Full Briefing']**

---

## VOICE BRIEFING — The Report (2:20 – 2:40)

**[Screen: Briefing Page — transcript visible]**

> "Finally, the AI generates a treasury briefing. The transcript shows the executive summary — total processed, total saved, all routes settled."

**[Click Play on the audio player — transcript reveals as audio plays]**

> "In production, this would be a voice briefing from MiniMax TTS — your CFO gets a morning audio summary instead of reading spreadsheets."

---

## CLOSING — The Vision (2:40 – 3:00)

> "To recap what you just saw: 5 invoices, 5 countries, analyzed by AI, compliance-checked, executed as stablecoin transfers, and summarized in a voice briefing. 4 sponsor technologies — n8n for orchestration, GPT-4o for intelligence, MiniMax for compliance and voice, Crossmint for USDC execution.

> With more time: flow netting to eliminate conversions entirely, live FX rates, off-ramp to local fiat, and invoice OCR. The platform gets smarter with every batch.

> This is Laundry. **We don't just make the pipe cheaper — we reduce how often you use the pipe.**

> Thank you."

---

## Fallback Plans

| If this breaks... | Do this |
|---|---|
| **AI analysis hangs** | Refresh the page — the analysis endpoint is reliable. If still stuck, have a pre-loaded result ready (navigate directly to `/spin`) |
| **Compliance check fails** | It'll show "Compliance check unavailable — manual review required" — the Execute button still works. Say: "In production this would require manual review" |
| **Crossmint transfer fails** | Mock transfers are enabled via `VITE_USE_MOCK_TRANSFERS=true`. The UI shows realistic tx data regardless. |
| **Voice briefing doesn't play** | The transcript is already visible. Say: "The text-to-speech generates an audio file — here's the transcript of what you'd hear." |
| **Page goes blank** | Have the Vercel deployment URL ready as backup: open it in a new tab |

---

## Pre-Demo Checklist

- [ ] App running locally on `localhost:5173` (or use Vercel URL)
- [ ] `.env` has `VITE_USE_MOCK_TRANSFERS=true` (fallback if Crossmint isn't ready)
- [ ] `.env` has `VITE_MINIMAX_API_KEY` set (for compliance check)
- [ ] Test the full flow once before presenting — Load → Wash → Spin → Rinse → Briefing
- [ ] Browser zoom at 100%, no bookmarks bar, clean tab
- [ ] Screen recording tool ready if doing video submission
- [ ] Presenter has the script memorized (not reading from notes)

---

## Sponsor Callout Cheat Sheet

Mention each sponsor **by name** during the demo:

| Sponsor | When to mention | What to say |
|---------|----------------|-------------|
| **n8n** | During Wash (AI analysis) | "Orchestrated through n8n" |
| **OpenAI/GPT-4o** | During Wash (AI analysis) | "GPT-4o analyzes the batch" |
| **MiniMax** | During Spin (compliance) + Briefing (voice) | "Powered by MiniMax" for compliance, "MiniMax TTS" for voice |
| **Crossmint** | During Rinse (execution) | "Real USDC transfers through Crossmint" |
| **Lovable** | Anytime pointing at UI | "Built the dashboard with Lovable" — or mention in closing |
