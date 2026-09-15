import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hot Metal — Mixo replacement",
  description:
    "Brief → structured landing page → live edit → stamp static HTML/ZIP. Local SQLite. No accounts.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
