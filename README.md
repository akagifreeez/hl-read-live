# 🔓 hl-read Live

**Watch a key-free, read-only Hyperliquid MCP read the live exchange — no API key, no login.**

### ▶ Live: **[hl-read-live.vercel.app](https://hl-read-live.vercel.app)**

A browser showroom for [`hl-read`](https://github.com/akagifreeez/hl-read), a published read-only Hyperliquid MCP server. Click a preset and watch its tools (`meta_and_asset_ctxs()`, `l2_book()`, …) pull **real** exchange data — extreme funding rates, open-interest leaders, the BTC order book — straight from Hyperliquid's **public Info API**. No key is ever handed over.

---

## Why "no key" matters

Exchange MCP servers usually want an API key — which means handing an agent permission over your funds. `hl-read` only touches the **public, read-only** endpoints, so it can be used **without ever giving up a key**. That makes it a safe entry point for AI/agent integrations. This site makes that tangible: real data, zero credentials.

## How it works

```
preset ──▶ hl-read tool(s) ──▶ Hyperliquid public Info API ──▶ live table / order book
```

- **`app/api/hl/route.ts`** — server proxy with a strict **allowlist** of read-only Info API request types (`metaAndAssetCtxs`, `predictedFundings`, `l2Book`, `allMids`), a 12s timeout, and a 10s cache. No writes, no key.
- **`lib/hl.ts`** — derives funding APR, open interest in USD, 24h change, and parses the order book.
- **`components/HlReadLive.tsx`** — animates the "tool call" cards while the live request is in flight, then renders the data.

**No LLM in v1 → live and $0 forever.** The data is public; the moat is the *packaging* (a key-free, read-only MCP with a resilient layer, mainnet-verified — see the `hl-read` repo).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Tech

Next.js (App Router) · TypeScript · Hyperliquid public Info API · deployed on Vercel.

## Honest notes (盛らない)

The data itself is publicly fetchable by anyone — the differentiator is shipping it as a key-free, read-only MCP with good DX and resilience, not exclusive data. This site is v1 (preset views); AI commentary over the data (BYOK) is future work.

---

Built by [@akagifreeez](https://github.com/akagifreeez). The MCP: [hl-read](https://github.com/akagifreeez/hl-read).
