import { NextResponse } from "next/server"
import { safeService } from "@/lib/safe-service"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await safeService.approveTransaction(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error approving proposal:", error)
    return NextResponse.json({ error: "Failed to approve proposal" }, { status: 500 })
  }
}
