import type { Metadata } from "next";
import "./globals.css";
import "./transitions.css";

export const metadata: Metadata = {
  title: "Hot Metal Press — brief to stamped landing",
  description:
    "Describe your idea. Lock structured landing sections. Edit, preview, stamp HTML/ZIP. Local SQLite. No accounts.",
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
