import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const universa = localFont({
  src: "../public/fonts/universa.otf",
  variable: "--font-universa",
  display: "swap",
  weight: "400",
  fallback: ["system-ui", "sans-serif"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://slovlog.com"),
  title: {
    default: "slovlog — Slovenia Travel Journal",
    template: "%s | slovlog",
  },
  description: "A travel journal documenting experiences, alpine landscapes, and historic cities across Slovenia.",
  icons: {
    icon: "/brand/ljubljana-dragon.png",
    apple: "/brand/ljubljana-dragon.png",
  },
  openGraph: {
    title: "slovlog — Slovenia Travel Journal",
    description: "Documenting our journey across Slovenia — from Ljubljana to Lake Bled, Piran, and the Julian Alps.",
    siteName: "slovlog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/logo.png",
        width: 1200,
        height: 630,
        alt: "slovlog with Ljubljana Dragon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${universa.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-slovenia-canvas text-slate-900 font-sans flex flex-col selection:bg-slovenia-blue/10 selection:text-slovenia-blue">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
