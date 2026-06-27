import HlReadLive from "@/components/HlReadLive";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>hl-read Live</h1>
        <p className="tagline">
          <strong style={{ color: "#cfe8df" }}>鍵を渡さない読み取り専用</strong>のHyperliquid MCPサーバ
          <code style={{ color: "#7fd1ff" }}> hl-read</code> を、ブラウザでそのまま動かすショールーム。
          ツールが本物の取引所データ（ファンディング・建玉・板）を引いてくる様子を、APIキーもログインもなしで見られます。
        </p>
      </section>

      <HlReadLive />

      <p className="legend">
        プリセットを押すと、<b>hl-read のツール</b>（<code>meta_and_asset_ctxs()</code> / <code>l2_book()</code> 等）が
        Hyperliquidの<b>公開Info API</b>を呼びます。<b>鍵不要・書き込み一切なし・LLM不使用＝ライブで恒久$0</b>。
        データは公開APIなので誰でも取れますが、<b>「鍵を渡さずに使えるMCPとして公開・運用している」</b>のが固有の打ち出しです。
      </p>

      <div className="about">
        <div className="card">
          <h3>これは何？</h3>
          <p>
            <code>hl-read</code> は本人が公開・運用する Hyperliquid 読み取り専用 MCPサーバ（16ツール・耐障害層つき・メインネット検証済み）。
            ここではその「鍵を渡さない」設計を、実データで触って確認できる。
          </p>
        </div>
        <div className="card">
          <h3>なぜ"鍵不要"が効く？</h3>
          <p>
            取引所系MCPは普通APIキー（＝資金に触れる権限）を要求しがち。hl-read は<b>読み取りに必要な公開エンドポイントだけ</b>を扱うので、
            鍵を渡さずに使える＝AI連携の安全な入口になる。
          </p>
        </div>
        <div className="card">
          <h3>正直な但し書き</h3>
          <p>
            データ自体は公開Info APIで誰でも取得可能。堀は「鍵を渡さない読み取り専用としての公開・DX・耐障害の作り込み」。
            本デモはv1（プリセット表示）。AIによる解説（BYOK）は今後。
          </p>
        </div>
      </div>

      <p className="foot">
        powered by the public Hyperliquid Info API · the published MCP:{" "}
        <a href="https://github.com/akagifreeez/hl-read" target="_blank" rel="noreferrer">github.com/akagifreeez/hl-read</a>
        {" · "}
        <a href="https://github.com/akagifreeez/hl-read-live" target="_blank" rel="noreferrer">this site's source</a>
      </p>
    </main>
  );
}
