"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)
  const router = useRouter()

  const handleDebug = async () => {
    try {
      const response = await fetch("/api/debug")
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      console.error("Debug error:", err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/simple-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      })

      if (response.ok) {
        console.log("✅ Login successful")
        // Force page reload to ensure cookie is set
        window.location.href = "/admin"
      } else {
        setError("كلمة المرور غير صحيحة")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>تسجيل دخول تجريبي</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور (admin123)"
                required
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "جاري التحقق..." : "دخول"}
              </Button>
              {error && <p className="text-red-600 text-center">{error}</p>}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات التشخيص</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDebug} variant="outline" className="mb-4">
              عرض معلومات التشخيص
            </Button>
            {debugInfo && (
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
