---
tags: [hackathon, sponsor, n8n, valon]
status: reviewed
created: 2026-04-03
source: Web research + event slides
valon-skill: sponsor-research
---

# Sponsor: n8n

## What They Offer
Visual workflow automation platform with built-in AI agent capabilities. Think "Zapier but with AI agents, code nodes, and self-hosting." This is your **backend orchestration layer** — connect APIs, run AI agents, automate workflows.

## Credits
- **Plan:** Cloud Pro license
- **Redemption:** Voucher code: `2026-COMMUNITY-HACKATHON-SF-BFC634C3`
- **Cloud Pro includes:** 10,000 executions/month, unlimited workflows, unlimited steps, 20 concurrent workflows, 3 shared projects

## Key Capabilities
- **AI Agent nodes:** Built-in agent that can reason, use tools, and make decisions
- **LLM integrations:** Native nodes for OpenAI, Claude, Gemini, and more
- **MCP Client:** n8n can consume MCP servers as tools for its AI agents
- **MCP Server Trigger:** n8n can expose workflows AS MCP servers for external AI to call
- **RAG support:** Vector store nodes, document loaders, embeddings
- **500+ integrations:** HTTP, databases, APIs, Google Sheets, Slack, email, etc.
- **Code node:** Write custom JavaScript/Python within workflows

## Pre-built Skills & Tooling
- **MCP Integration:** NATIVE — both client and server
  - MCP Client Tool: AI agents in n8n can call external MCP servers
  - MCP Server Trigger: Expose n8n workflows as MCP endpoints
  - Docs: https://www.n8n-mcp.com/
- **Official GitHub:** https://github.com/n8n-io/n8n
- **Claude Skill:** None found
- **Cursor Rules:** None found
- **Workflow Templates:** Hundreds of pre-built templates at n8n.io/workflows
  - AI agent templates, RAG workflows, data processing pipelines

## Quick Start (Fastest Path)
```
1. Go to app.n8n.cloud
2. Sign up / apply voucher code
3. Create new workflow
4. Add AI Agent node → configure with your LLM API key
5. Add tools (HTTP Request, Code, etc.)
6. Test workflow → it works
```

## Finance-Relevant Integrations
- **HTTP Request node:** Call any finance API (Alpha Vantage, Yahoo Finance, etc.)
- **Google Sheets:** Read/write financial data
- **PostgreSQL/MySQL:** Direct database queries
- **Webhook trigger:** Accept incoming data from Lovable frontend
- **Schedule trigger:** Run recurring financial analysis
- **Code node:** Custom financial calculations in JS/Python

## Integration Ideas for Finance Hackathon
- **AI agent that processes financial documents.** n8n agent receives PDF → extracts data → runs analysis → returns results to Lovable frontend.
- **Automated compliance workflow.** Trigger → check transaction against rules → flag anomalies → notify.
- **Multi-step financial research pipeline.** Web scrape → AI summarize → store in Supabase → display in Lovable dashboard.
- **Expose n8n workflow as MCP server** so Claude or other AI can call your finance tools directly.

## Gotchas
- **API keys needed:** n8n is the orchestrator — you still need API keys for the LLMs and services it connects to. Bring your OpenAI/Claude key.
- **Execution limits:** 10K executions is plenty for a hackathon, but complex workflows with loops can burn through them.
- **Cloud vs self-hosted:** Use Cloud for the hackathon — zero setup time.
- **Webhook URLs:** Cloud gives you webhook URLs. Save these — you'll need them to connect Lovable frontend to n8n backend.
- **Learning curve:** If you've never used n8n, spend 15 min on their AI agent quickstart before the hackathon.

## Why Judges Care
n8n is a **primary sponsor** providing Cloud Pro licenses. Using n8n as your workflow backbone shows architectural thinking (15 pts — Technical Creativity). An n8n workflow diagram in your demo = "this is how the system works" credibility.
