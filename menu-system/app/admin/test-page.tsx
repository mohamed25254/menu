"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminTestPage() {
  const [authStatus, setAuthStatus] = useState("checking...")

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/simple-auth")
      if (response.ok) {
        setAuthStatus("✅ مصادق عليه")
      } else {
        setAuthStatus("❌ غير مصادق")
      }
    } catch (err) {
      setAuthStatus("❌ خطأ في التحقق")
    }
  }

  const handleLogout = () => {
    document.cookie = "simple_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/test-login"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>صفحة الإدارة التجريبية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <p>حالة المصادقة: {authStatus}</p>
            </div>

            <Button onClick={checkAuth} variant="outline">
              فحص المصادقة مرة أخرى
            </Button>

            <Button onClick={handleLogout} variant="destructive">
              تسجيل خروج
            </Button>

            <div className="text-sm text-gray-600">
              <p>إذا وصلت لهذه الصفحة، فالمصادقة تعمل!</p>
              <p>الآن يمكننا إصلاح النظام الأصلي.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
