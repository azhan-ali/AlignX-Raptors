import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlignX — Smart Career Matching + Peer Help Community",
  description:
    "AlignX matches Indian students and freshers with real internships, jobs, and peer mentors using tiny AI models. Proof-based, transparent, and completely free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col relative z-10">{children}</body>
    </html>
  );
}
