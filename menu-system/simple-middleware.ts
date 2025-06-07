import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory session storage (same as in API)
const sessions = new Set<string>()

// Add sessions from API (this is a hack for demo purposes)
if (typeof global !== "undefined") {
  global.sessions = sessions
}

export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware called for:", request.nextUrl.pathname)

  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("simple_session")
    console.log("🍪 Session cookie:", sessionCookie?.value?.substring(0, 20) + "...")

    if (!sessionCookie?.value) {
      console.log("❌ No session cookie, redirecting")
      return NextResponse.redirect(new URL("/test-login", request.url))
    }

    // For now, just check if cookie exists (we'll improve this)
    console.log("✅ Session cookie exists, allowing access")
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
