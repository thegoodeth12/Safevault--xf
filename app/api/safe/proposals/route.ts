import { NextResponse } from "next/server"
import { safeService } from "@/lib/safe-service"

export async function GET() {
  try {
    const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS
    if (!safeAddress) {
      return NextResponse.json({ error: "Safe address not configured" }, { status: 400 })
    }

    await safeService.initializeSafe(safeAddress)
    const proposals = await safeService.getPendingTransactions()

    return NextResponse.json(proposals)
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { to, value, data, title, description } = await request.json()

    const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS
    if (!safeAddress) {
      return NextResponse.json({ error: "Safe address not configured" }, { status: 400 })
    }

    await safeService.initializeSafe(safeAddress, process.env.SIGNER_PRIVATE_KEY)
    const transaction = await safeService.createTransaction(to, value, data)

    return NextResponse.json({
      success: true,
      transaction,
      message: "Proposal created successfully",
    })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}
