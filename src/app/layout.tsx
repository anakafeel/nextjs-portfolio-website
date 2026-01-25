import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "My Portfolio Website",
  description: "Saim Hashmi's portfolio website showcasing projects and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className="relative min-h-screen bg-[hsl(270,50%,15%)] text-slate-100">
        <Header />
        {children}
        <div className="background-gradient absolute inset-0 -z-50 min-h-full" />
        <div className="pointer-events-none absolute inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
