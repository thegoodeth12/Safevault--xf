import { NextResponse } from "next/server"
import { safeService } from "@/lib/safe-service"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await safeService.executeTransaction(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing proposal:", error)
    return NextResponse.json({ error: "Failed to execute proposal" }, { status: 500 })
  }
}
