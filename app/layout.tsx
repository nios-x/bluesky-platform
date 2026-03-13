import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import React from "react"
import './globals.css'
import { AuthProvider } from "@/contexts/auth-context"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Best Dumpster Rental Service in Michigan: Blue Sky Disposal',
  description: 'Professional waste management and dumpster rental services in Michigan. Woman-owned company with 15+ years of experience serving residential and commercial needs.',
  generator: 'v0.app',
    icons: {
    icon: [
      { url: "/images/bluesky_New_logo.jpg", sizes: "32x32", type: "image/png" },
      { url: "/images/bluesky_New_logo.jpg", sizes: "192x192", type: "image/png" },
      { url: "/images/bluesky_New_logo.jpg", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/bluesky_New_logo.jpg",
    shortcut: "/images/bluesky_New_logo.jpg",
    },

}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
