---
tags: [hackathon, sponsor, lovable, valon]
status: reviewed
created: 2026-04-03
source: Web research + event slides
valon-skill: sponsor-research
---

# Sponsor: Lovable

## What They Offer
AI-powered app builder that turns natural language prompts into full-stack React apps. Think "describe what you want, get a working app." This is your **primary UI/prototyping tool** for the hackathon.

## Credits
- **Plan:** Pro Plan 1 (100 credits/month)
- **Redemption:** lovable.dev → Settings → Plans & Credits → code: `COMM-BUILD-3890`
- **What 100 credits gets you:** Each prompt/generation uses ~1 credit. 100 credits = ~100 iterations. Plenty for a hackathon.

## Tech Stack (What Lovable Generates)
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **Backend:** Supabase (PostgreSQL, auth, storage, edge functions)
- **Deployment:** Built-in preview URLs
- **Code export:** Full GitHub integration — you own the code, can eject anytime

## Pre-built Skills & Tooling
- **MCP Server:** `hiromima/lovable-mcp-server` (unofficial, community-built)
  - Analyzes Lovable-generated projects in Claude Desktop
  - Source: https://github.com/hiromima/lovable-mcp-server
  - **Verdict:** Useful for post-generation analysis, not critical for hackathon
- **Official MCP integration:** Lovable supports connecting external MCP servers TO your Lovable project (docs.lovable.dev/integrations/mcp-servers)
- **Claude Skill:** None found
- **Cursor Rules:** None found
- **Official SDK:** No standalone SDK — it's a web platform

## How to Use at Hackathon
1. Go to lovable.dev, sign in
2. Describe your app in natural language
3. Lovable generates full React + Supabase app
4. Iterate via chat (describe changes) or Visual Edits (click on UI elements)
5. Connect to GitHub to export code
6. Connect Supabase for backend (auto-provisioned)

## Quick Start (Fastest Path)
```
1. Sign up at lovable.dev
2. Apply discount code COMM-BUILD-3890 in Settings → Plans & Credits
3. "Create new project" → describe your finance AI tool
4. Connect Supabase for database/auth
5. You have a working app in ~5 minutes
```

## Integration Ideas for Finance Hackathon
- **Build the entire frontend in Lovable.** Dashboard, forms, data visualizations — all from prompts.
- **Supabase backend for data persistence.** Store financial data, user accounts, analysis results.
- **Connect to n8n via API endpoints.** Lovable frontend → n8n workflow backend for AI processing.
- **Rapid iteration.** Use the 3-hour build window to iterate on UI based on what looks demoable.

## Gotchas
- **Credit usage:** Complex prompts or multi-step changes can burn credits faster. Be specific in your prompts.
- **Supabase connection:** Set this up early. Database schema changes mid-build can be messy.
- **Code complexity:** Generated code is clean but can be verbose. Don't try to hand-edit extensively during the hackathon — use Lovable's chat interface instead.
- **Export timing:** Export to GitHub early so you have a backup. Don't wait until demo time.
- **Preview URL:** Lovable gives you a live preview URL — use this for your demo video if deployment is complex.

## Why Judges Care
Lovable is a **primary sponsor**. Using it prominently shows you engaged with the hackathon ecosystem. A polished UI built in Lovable will score high on "Product Execution & Demo Quality" (25 pts). Judges see a beautiful, working app = instant credibility.
