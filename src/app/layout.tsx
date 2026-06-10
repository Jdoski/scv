import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import fs from "node:fs";
import path from "node:path";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.shortName}`,
  },
  description: `${site.tagline}. Tournament schedules, rules, free agent board, and our annual golf scramble.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Drop logo.png into /public and it appears in the navbar automatically.
  const hasLogo = fs.existsSync(path.join(process.cwd(), "public", "logo.png"));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar hasLogo={hasLogo} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
