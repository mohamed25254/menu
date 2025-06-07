import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.SESSION_SECRET || "default-secret-key-change-in-production"

export async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie?.value) {
      console.log("No session cookie in verifyAuth")
      return false
    }

    const encodedKey = new TextEncoder().encode(secretKey)
    await jwtVerify(sessionCookie.value, encodedKey, {
      algorithms: ["HS256"],
    })

    console.log("Auth verification successful")
    return true
  } catch (error) {
    console.error("Auth verification error:", error)
    return false
  }
}
