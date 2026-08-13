import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joey LLM",
  description: "An accessible web interface for Joey LLM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
