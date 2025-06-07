import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify, SignJWT } from "jose"

const secretKey = process.env.SESSION_SECRET || "default-secret-key-change-in-production"

export async function GET(request: NextRequest) {
  const debug = {
    cookies: {},
    headers: {},
    secretKey: secretKey.substring(0, 10) + "...",
    timestamp: new Date().toISOString(),
  }

  // Get all cookies
  request.cookies.forEach((value, name) => {
    debug.cookies[name] = value.substring(0, 50) + "..."
  })

  // Get relevant headers
  debug.headers = {
    userAgent: request.headers.get("user-agent"),
    host: request.headers.get("host"),
    origin: request.headers.get("origin"),
  }

  // Test JWT creation and verification
  try {
    const encodedKey = new TextEncoder().encode(secretKey)

    // Create test token
    const testToken = await new SignJWT({ test: "data" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encodedKey)

    debug["testTokenCreated"] = testToken.substring(0, 50) + "..."

    // Verify test token
    const verified = await jwtVerify(testToken, encodedKey, {
      algorithms: ["HS256"],
    })

    debug["testTokenVerified"] = verified.payload
  } catch (error) {
    debug["jwtError"] = error.message
  }

  return NextResponse.json(debug, { status: 200 })
}
