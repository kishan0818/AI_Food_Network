import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/lib/notification-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "AI Food Network - Smart Cities, Kinder Hearts",
  description:
    "Using AI to connect surplus food with people in need. Turn food waste into community sustenance with our intelligent platform.",
  keywords: "AI, food waste, hunger relief, sustainability, community, smart cities",
  authors: [{ name: "AI Food Network Team" }],
  generator: "v0.dev",
  openGraph: {
    title: "AI Food Network - Smart Cities, Kinder Hearts",
    description: "Using AI to connect surplus food with people in need",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
