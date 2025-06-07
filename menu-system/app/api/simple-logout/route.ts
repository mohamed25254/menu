import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("🚪 Logout request received")

    const response = NextResponse.json({ success: true })

    // Clear the session cookie
    response.cookies.set("simple_session", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    })

    console.log("✅ Logout successful, cookie cleared")
    return response
  } catch (error) {
    console.error("❌ Logout error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الخروج" }, { status: 500 })
  }
}
