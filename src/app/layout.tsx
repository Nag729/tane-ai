import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "ほうれんそう AI",
  description: "報告・連絡・相談を AI と一緒に整理しよう",
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
