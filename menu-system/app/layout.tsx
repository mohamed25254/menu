import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "نظام إدارة المنيو | Menu Management System",
  description: "نظام بسيط وفعال لإدارة وعرض منيو المطعم مع واجهة عربية سهلة الاستخدام",
  keywords: "منيو, مطعم, إدارة, PDF, عربي, restaurant, menu, management",
  authors: [{ name: "Menu System" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
