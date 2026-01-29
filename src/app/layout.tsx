import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hugo's Market Dashboard – Bloomberg-Style Stock Visualizer",
  description: "A junior Bloomberg Terminal-style dashboard for stock analysis. Created by Hugo Canseco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
