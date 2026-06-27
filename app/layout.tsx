import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hl-read Live — watch a key-free Hyperliquid MCP read the exchange",
  description:
    "A read-only, key-free Hyperliquid MCP server, running live in your browser. Watch its tools pull real exchange data — funding, open interest, order books — with no API key and no login.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
