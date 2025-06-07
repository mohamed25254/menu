import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    const sessionCookie = request.cookies.get("auth-session")

    if (!sessionCookie?.value) {
      return false
    }

    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

    return sessionData.authenticated && Date.now() < sessionData.expires
  } catch (error) {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("menu") as File

    if (!file) {
      return NextResponse.json({ error: "لم يتم تحديد ملف" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "يجب أن يكون الملف بصيغة PDF" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Ensure public directory exists
    const publicDir = join(process.cwd(), "public")
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // Save file to public directory
    const filePath = join(publicDir, "menu.pdf")
    await writeFile(filePath, buffer)

    // Return success with cache-busting headers
    const response = NextResponse.json({
      success: true,
      message: "تم رفع المنيو بنجاح",
      timestamp: Date.now(),
    })

    // Add cache-busting headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء رفع الملف" }, { status: 500 })
  }
}
