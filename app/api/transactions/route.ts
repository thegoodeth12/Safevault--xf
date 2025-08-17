import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getUserTransactions } from "@/lib/wallet-service"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const transactions = await getUserTransactions(user.id, limit)

    return NextResponse.json({
      transactions,
      total: transactions.length,
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
