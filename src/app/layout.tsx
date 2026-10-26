import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import TickerMarquee from "@/components/layout/TickerMarquee";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "CRYPTOBULL.AI | Professional Crypto Exchange & Quantitative Terminal",
  description:
    "Institutional cryptocurrency exchange terminal featuring real-time market data, paper trading execution, quantitative backtesting lab, internal USDT ledger, and P2P marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0E11] text-[#EAECEF] min-h-screen flex flex-col antialiased">
        <Navbar />
        <TickerMarquee />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
