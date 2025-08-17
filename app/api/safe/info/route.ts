import { NextResponse } from "next/server"
import { safeService } from "@/lib/safe-service"

export async function GET() {
  try {
    const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS
    if (!safeAddress) {
      return NextResponse.json({ error: "Safe address not configured" }, { status: 400 })
    }

    await safeService.initializeSafe(safeAddress)
    const safeInfo = await safeService.getSafeInfo()

    if (!safeInfo) {
      return NextResponse.json({ error: "Failed to fetch Safe info" }, { status: 500 })
    }

    return NextResponse.json(safeInfo)
  } catch (error) {
    console.error("Error fetching Safe info:", error)
    return NextResponse.json({ error: "Failed to fetch Safe info" }, { status: 500 })
  }
}
