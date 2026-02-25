import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "CodersGPT";
const DESCRIPTION = "chatbot for coders";
const BASE_URL = "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: "CodersGPT,codersgpt",
  authors: [
    {
      name: "codersgyan",
      url: BASE_URL,
    },
  ],
  creator: "codersgyan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "CodersGPT",
    images: [
      {
        url: `${BASE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@codersgyan",
    images: [`${BASE_URL}/og.jpg`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${BASE_URL}/site.webmanifest`,
};

import "streamdown/styles.css";

import { Toaster } from "@/components/ui/sonner";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#212121] text-[#ececec]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
