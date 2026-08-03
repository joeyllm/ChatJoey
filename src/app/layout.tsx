import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatJoey",
  description: "A conversational interface for JoeyLLM",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
