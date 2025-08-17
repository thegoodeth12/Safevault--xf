import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getUserWallets, getCryptoPrices } from "@/lib/wallet-service"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const wallets = await getUserWallets(user.id)
    const prices = await getCryptoPrices()

    const walletsWithValue = wallets.map((wallet) => {
      const price = prices.find((p) => p.symbol === wallet.asset_type)?.price || 0
      return {
        ...wallet,
        usd_value: wallet.balance * price,
        price_change_24h: prices.find((p) => p.symbol === wallet.asset_type)?.change24h || 0,
      }
    })

    const totalBalance = walletsWithValue.reduce((sum, wallet) => sum + wallet.usd_value, 0)

    return NextResponse.json({
      wallets: walletsWithValue,
      total_balance: totalBalance,
      prices,
    })
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
