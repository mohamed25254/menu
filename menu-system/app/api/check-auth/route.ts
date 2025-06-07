import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.SESSION_SECRET || "default-secret-key-change-in-production"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")
    console.log("Check auth - cookie exists:", !!sessionCookie)

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "غير مصرح", authenticated: false }, { status: 401 })
    }

    const encodedKey = new TextEncoder().encode(secretKey)
    const { payload } = await jwtVerify(sessionCookie.value, encodedKey, {
      algorithms: ["HS256"],
    })

    console.log("Auth check successful:", payload)
    return NextResponse.json({ success: true, authenticated: true })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "غير مصرح", authenticated: false }, { status: 401 })
  }
}
