import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from "next/script";

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
      <body className="relative h-screen bg-gradient-to-r from-[#0d0d0d] via-[#1a1a1a] to-[#262626] text-slate-100">
        <Header />
        {children}
        <div className="background-gradient absolute inset-0 -z-50 max-h-screen" />
        <div className="pointer-events-none absolute inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
        <Footer />
        <SpeedInsights />
        {/* Apollo tracker script */}
        <Script
          id="apollo-tracker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
function initApollo(){
  var n = Math.random().toString(36).substring(7),
      o = document.createElement("script");
  o.src = "https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=" + n;
  o.async = !0; o.defer = !0;
  o.onload = function(){
    window.trackingFunctions.onLoad({appId: "68f2d532f4913e0015e27e1e"});
  };
  document.head.appendChild(o)
}
initApollo();
            `
          }}
        />
      </body>
    </html>
  );
}
