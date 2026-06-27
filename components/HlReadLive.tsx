"use client";

import { useRef, useState } from "react";
import {
  parseMetaAndAssetCtxs, topByAbsFunding, topByOi, parseL2,
  fmtUsd, fmtPct, fmtApr, type AssetRow, type Level,
} from "@/lib/hl";

type Preset = {
  id: string;
  label: string;
  tools: string[]; // hl-read MCP tool names "called"
  fetchType: string;
  coin?: string;
  view: "funding" | "oi" | "book";
};

const PRESETS: Preset[] = [
  { id: "funding", label: "ファンディング過激TOP", tools: ["meta_and_asset_ctxs", "rank_by_funding"], fetchType: "metaAndAssetCtxs", view: "funding" },
  { id: "oi", label: "建玉(OI)ランキング", tools: ["meta_and_asset_ctxs", "rank_by_oi"], fetchType: "metaAndAssetCtxs", view: "oi" },
  { id: "book", label: "BTC 板スナップショット", tools: ["l2_book"], fetchType: "l2Book", coin: "BTC", view: "book" },
];

type ToolCard = { name: string; status: "pending" | "running" | "done" };

export default function HlReadLive() {
  const [tools, setTools] = useState<ToolCard[]>([]);
  const [view, setView] = useState<Preset["view"] | null>(null);
  const [rows, setRows] = useState<AssetRow[]>([]);
  const [book, setBook] = useState<{ bids: Level[]; asks: Level[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ts, setTs] = useState<string>("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() { timers.current.forEach(clearTimeout); timers.current = []; }

  async function run(p: Preset) {
    if (busy) return;
    setBusy(true);
    setError(null);
    setView(null);
    setRows([]);
    setBook(null);
    clearTimers();
    setTools(p.tools.map((name, i) => ({ name, status: i === 0 ? "running" : "pending" })));

    // fetch live data while the first tool card pulses
    const fetchPromise = fetch("/api/hl", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: p.fetchType, coin: p.coin }),
    }).then((r) => r.json());

    // light up tool cards in sequence for the "agent chaining tools" feel
    let res: { data?: unknown; error?: string };
    try {
      res = await fetchPromise;
    } catch {
      clearTimers();
      setError("ライブAPIに繋がりませんでした。少し待って再試行してください。");
      setTools((t) => t.map((c) => (c.status === "running" ? { ...c, status: "pending" } : c)));
      setBusy(false);
      return;
    }

    // animate cards done one by one
    for (let i = 0; i < p.tools.length; i++) {
      timers.current.push(setTimeout(() => {
        setTools((t) => t.map((c, j) => (j < i ? { ...c, status: "done" } : j === i ? { ...c, status: "running" } : c)));
      }, i * 420));
    }
    timers.current.push(setTimeout(() => {
      setTools((t) => t.map((c) => ({ ...c, status: "done" })));
      if (res.error) {
        setError(res.error);
      } else if (p.view === "book") {
        setBook(parseL2(res.data));
        setView("book");
      } else {
        const parsed = parseMetaAndAssetCtxs(res.data);
        setRows(p.view === "funding" ? topByAbsFunding(parsed) : topByOi(parsed));
        setView(p.view);
      }
      setTs(new Date().toLocaleTimeString());
      setBusy(false);
    }, p.tools.length * 420 + 200));
  }

  const maxBookSz = book ? Math.max(1, ...book.bids.concat(book.asks).map((l) => l.sz)) : 1;

  return (
    <div className="hl">
      <div className="keybadge">🔓 鍵もログインも不要 — read-only。あなたのウォレットには一切触れません。</div>

      <div className="presets">
        {PRESETS.map((p) => (
          <button key={p.id} className="chip" disabled={busy} onClick={() => run(p)}>{p.label}</button>
        ))}
      </div>

      {tools.length > 0 && (
        <div className="panel">
          <div className="toolrail">
            {tools.map((c) => (
              <span key={c.name} className={`tool ${c.status}`}>
                <span className="tdot" /> {c.name}()
              </span>
            ))}
            {ts && <span className="ts">live · {ts}</span>}
          </div>

          {error && <div className="error">{error}</div>}

          {view === "funding" && (
            <table className="data">
              <thead><tr><th>コイン</th><th>ファンディング/h</th><th>年率(APR)</th><th>Mark</th><th>建玉(OI)</th><th>24h</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className="sym">{r.name}</td>
                    <td className={r.fundingHourly >= 0 ? "pos" : "neg"}>{fmtPct(r.fundingHourly, 4)}</td>
                    <td className={r.fundingApr >= 0 ? "pos" : "neg"}>{fmtApr(r.fundingApr)}</td>
                    <td>{r.markPx}</td>
                    <td>{fmtUsd(r.oiUsd)}</td>
                    <td className={r.change24h >= 0 ? "pos" : "neg"}>{fmtPct(r.change24h)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {view === "oi" && (
            <table className="data">
              <thead><tr><th>コイン</th><th>建玉(OI)</th><th>Mark</th><th>24h</th><th>24h出来高</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className="sym">{r.name}</td>
                    <td>{fmtUsd(r.oiUsd)}</td>
                    <td>{r.markPx}</td>
                    <td className={r.change24h >= 0 ? "pos" : "neg"}>{fmtPct(r.change24h)}</td>
                    <td>{fmtUsd(r.dayVlm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {view === "book" && book && (
            <div className="book">
              <div className="side">
                <div className="sidehead pos">Bids</div>
                {book.bids.slice(0, 12).map((l, i) => (
                  <div className="lvl" key={i}>
                    <span className="bar posbar" style={{ width: `${(l.sz / maxBookSz) * 100}%` }} />
                    <span className="px pos">{l.px}</span><span className="sz">{l.sz}</span>
                  </div>
                ))}
              </div>
              <div className="side">
                <div className="sidehead neg">Asks</div>
                {book.asks.slice(0, 12).map((l, i) => (
                  <div className="lvl" key={i}>
                    <span className="bar negbar" style={{ width: `${(l.sz / maxBookSz) * 100}%` }} />
                    <span className="px neg">{l.px}</span><span className="sz">{l.sz}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
