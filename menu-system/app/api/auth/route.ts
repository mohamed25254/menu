import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

const secretKey = process.env.SESSION_SECRET || "default-secret-key-change-in-production"
const adminPassword = process.env.ADMIN_PASS || "admin123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    console.log("Login attempt with password:", password)
    console.log("Expected password:", adminPassword)

    if (password !== adminPassword) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // Create a simple session token
    const encodedKey = new TextEncoder().encode(secretKey)
    const payload = {
      role: "admin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
    }

    const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(encodedKey)

    console.log("Generated token:", token.substring(0, 50) + "...")

    // Create response with success
    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    })

    // Set cookie with explicit settings
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    })

    console.log("Cookie set successfully")
    return response
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 })
  }
}
