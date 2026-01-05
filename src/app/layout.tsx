import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./Providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tane-ai.vercel.app";

export const metadata: Metadata = {
  title: "たねAI",
  description:
    "準備8割、会議2割。AIとの対話で会議の事前資料をサクッと作成。意思決定・共有・ディスカッション、どんな会議にも対応。",
  keywords: ["会議", "事前資料", "AI", "ミーティング", "議事録", "アジェンダ"],
  authors: [{ name: "たねAI" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "たねAI - 会議のタネ、AIがまく",
    description: "準備8割、会議2割。AIとの対話で会議の事前資料をサクッと作成。",
    url: siteUrl,
    siteName: "たねAI",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "たねAI - 会議のタネ、AIがまく",
    description: "準備8割、会議2割。AIとの対話で会議の事前資料をサクッと作成。",
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
