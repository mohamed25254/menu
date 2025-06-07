import { type NextRequest, NextResponse } from "next/server"

const adminPassword = process.env.ADMIN_PASS || "admin123"

// Simple in-memory session storage (for debugging)
const sessions = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password !== adminPassword) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // Create simple session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
    sessions.add(sessionToken)

    console.log("Created session:", sessionToken)
    console.log("Active sessions:", Array.from(sessions))

    const response = NextResponse.json({ success: true })

    // Set simple session cookie
    response.cookies.set("simple_session", sessionToken, {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Simple auth error:", error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("simple_session")?.value

  if (!sessionToken || !sessions.has(sessionToken)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}
