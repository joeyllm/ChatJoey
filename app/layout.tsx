import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatJoey | JoeyLLM chat",
  description: "A multilingual and accessible web interface for JoeyLLM.",
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
