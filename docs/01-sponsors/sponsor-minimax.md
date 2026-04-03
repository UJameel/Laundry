---
tags: [hackathon, sponsor, minimax, valon]
status: reviewed
created: 2026-04-03
source: Web research + event slides
valon-skill: sponsor-research
---

# Sponsor: MiniMax

## What They Offer
Frontier multimodal AI company with production-grade models for text, speech, video, image, and music. 150M+ users globally. This is your **AI model layer** — especially powerful for voice and video generation.

## Credits
- **Amount:** $30 API credits
- **Redemption:** Create account at platform.minimax.io → submit Group ID via form → credits appear in balance
- **Form:** https://vrfi1sk8a0.feishu.cn/share/base/form/shrcnxDih8DF8BJhjWwgDKQTLug
- **Balance check:** https://platform.minimax.io/user-center/payment/balance

## Key Models & Capabilities

| Modality | Model | What It Does |
|----------|-------|-------------|
| **Text/LLM** | MiniMax M2.7 | Text generation, code, reasoning. $0.30/1M input, $1.20/1M output |
| **Speech/TTS** | Speech 2.8 | Text-to-speech, voice cloning. High quality, multiple voices |
| **Video** | Hailuo 2.3 | Text/image-to-video generation. Async API. |
| **Image** | Image generation | Text-to-image |
| **Music** | Music model | AI music generation |

## How Far Does $30 Go?
- **Text (M2.7):** ~25M input tokens or ~25M output tokens. Massive — essentially unlimited for a hackathon.
- **Speech:** Varies, but $30 covers hundreds of TTS generations
- **Video:** Most expensive modality — video generation likely uses $1-5 per clip. Budget ~6-30 short videos.
- **Best strategy:** Use text heavily (cheap), speech moderately, video sparingly for the demo wow-factor.

## Pre-built Skills & Tooling
- **MCP Server:** `MiniMax-AI/MiniMax-MCP` (OFFICIAL)
  - Text-to-speech, voice cloning, image generation, video generation
  - Install: `uvx minimax-mcp` (requires uv package manager)
  - Source: https://github.com/MiniMax-AI/MiniMax-MCP
  - Also available in JS: https://github.com/MiniMax-AI/MiniMax-MCP-JS
- **Coding Plan MCP:** `MiniMax-AI/MiniMax-Coding-Plan-MCP` — AI search + vision for code workflows
- **Search MCP:** `MiniMax-AI/minimax_search` — web search + browsing
- **Claude Skill:** None found
- **Cursor Rules:** None found
- **API:** REST API, well-documented at platform.minimax.io/docs

## Quick Start (Fastest Path)
```
1. Create account at platform.minimax.io
2. Submit Group ID via form for $30 credits
3. Get API key from platform
4. Test TTS:
   curl -X POST https://api.minimax.chat/v1/t2a_v2 \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model": "speech-02-hd", "text": "Hello from MiniMax"}'
5. Or install MCP server: uvx minimax-mcp
```

## Integration Ideas for Finance Hackathon
- **Voice-powered financial advisor.** User speaks → AI processes → MiniMax TTS responds with financial advice in a natural voice.
- **Audio summaries of financial reports.** Feed earnings data → AI analyzes → MiniMax generates spoken summary.
- **Video explainers.** Generate short video clips explaining financial concepts or portfolio performance.
- **Multilingual finance assistant.** MiniMax speech models support multiple languages — serve diverse financial clients.
- **Accessibility layer.** Make financial tools accessible via voice for visually impaired users (judges love accessibility plays).

## Gotchas
- **API host matters.** API host and key must match by region. Wrong combination = "Invalid API key" error.
- **Video is async.** You create a task, then poll for completion. Budget extra time for video integration.
- **$30 limit.** Don't blow credits on video experimentation. Test with text/speech first, use video for final demo only.
- **Credit approval delay.** Submit the form BEFORE the hackathon. Credits may take time to appear.
- **Chinese company docs.** Some documentation may have translation quirks. Stick to the official English API docs.

## Why Judges Care
MiniMax brings **multimodal differentiation**. Most hackathon teams use text-only AI. Adding voice or video output makes your demo memorable. A financial advisor that speaks to you > a financial advisor that only shows text. That's the "wow factor" that wins "Technical Creativity" (15 pts).
