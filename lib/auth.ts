import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sql } from "./db"

export async function getCurrentUser() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("session-token")

  if (!sessionToken) {
    return null
  }

  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${sessionToken.value}
    `
    return users[0] || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function createSession(userId: string) {
  const cookieStore = cookies()
  cookieStore.set("session-token", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}
