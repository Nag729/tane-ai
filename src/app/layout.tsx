import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./Providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tane-ai.vercel.app";

export const metadata: Metadata = {
  title: "たねAI - 会議資料をAIと作成",
  description:
    "AIからの質問に答えるだけで、会議の準備ができる。決める会議・伝える会議・話し合う会議、どんな会議にも対応。",
  keywords: ["会議", "事前資料", "AI", "ミーティング", "議事録", "アジェンダ"],
  authors: [{ name: "たねAI" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "たねAI",
    description: "AIからの質問に答えるだけで、会議の準備ができる",
    url: siteUrl,
    siteName: "たねAI",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "たねAI",
    description: "AIからの質問に答えるだけで、会議の準備ができる",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <NextTopLoader color="#10b981" height={2} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
