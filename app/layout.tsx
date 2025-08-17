import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/lib/wallet-connection"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SafeVault - Secure Multi-Signature Wallet",
  description: "Advanced multi-signature wallet management with enterprise-grade security",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
