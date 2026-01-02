import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "たねAI",
  description: "会議のタネ、AIがまく - ミーティング事前資料を一緒に作ろう",
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
        {children}
      </body>
    </html>
  );
}
