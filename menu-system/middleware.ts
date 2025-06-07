import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  console.log("Middleware called for:", request.nextUrl.pathname)

  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("auth-session")
    console.log("Session cookie exists:", !!sessionCookie)

    if (!sessionCookie?.value) {
      console.log("No session cookie found, redirecting to login")
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      // Decode and verify session
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

      if (!sessionData.authenticated || Date.now() > sessionData.expires) {
        const response = NextResponse.redirect(new URL("/", request.url))
        response.cookies.delete("auth-session")
        return response
      }

      console.log("Session verified successfully:", sessionData)
      return NextResponse.next()
    } catch (error) {
      console.error("Session verification failed:", error)

      // Clear invalid cookie
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("auth-session")
      return response
    }
  }

  // Handle PDF caching
  if (request.nextUrl.pathname === "/menu.pdf") {
    const response = NextResponse.next()
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/menu.pdf"],
}
