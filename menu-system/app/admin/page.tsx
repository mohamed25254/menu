"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Menu, LogOut, CheckCircle, AlertCircle, FileText, Download } from "lucide-react"

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/verify", { credentials: "include" })
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        router.push("/")
      }
    } catch (err) {
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("يرجى اختيار ملف PDF فقط")
      setFile(null)
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)")
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError("")
    setMessage("")
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("يرجى اختيار ملف أولاً")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setMessage("")
    setError("")

    const formData = new FormData()
    formData.append("menu", file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        setMessage("تم رفع المنيو بنجاح! سيتم تحديث المنيو للزوار تلقائياً")
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById("menu-file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        const data = await response.json()
        setError(data.error || "حدث خطأ أثناء رفع الملف")
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة أثناء رفع الملف")
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      })
      router.push("/")
      router.refresh()
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الخروج")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-blue-600 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
                <Upload size={32} />
                لوحة التحكم
              </CardTitle>
              <p className="text-blue-100 text-lg mt-2">إدارة منيو المطعم</p>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-right flex items-center gap-2">
                  <FileText size={24} />
                  رفع منيو جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                {message && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 text-right">{message}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-right">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Drag and Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      dragActive
                        ? "border-blue-400 bg-blue-50 scale-105"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      id="menu-file"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />

                    <div className="space-y-4">
                      <div
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                          dragActive ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <Upload className={`h-8 w-8 ${dragActive ? "text-blue-600" : "text-gray-400"}`} />
                      </div>

                      <div className="text-gray-600">
                        <p className="text-lg font-medium">اسحب وأفلت ملف PDF هنا</p>
                        <p className="text-sm mt-1">أو انقر للاختيار من جهازك</p>
                        <p className="text-xs text-gray-500 mt-2">الحد الأقصى: 10 ميجابايت</p>
                      </div>

                      {file && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium">تم اختيار: {file.name}</p>
                          <p className="text-xs text-blue-600">
                            الحجم: {(file.size / 1024 / 1024).toFixed(2)} ميجابايت
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>جاري الرفع...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Upload Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-medium"
                    disabled={isUploading || !file}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        جاري رفع المنيو...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload size={20} />
                        رفع المنيو الجديد
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Actions Section */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-right">الإجراءات السريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/menu")}
                  className="w-full flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 h-12"
                >
                  <Menu size={20} />
                  عرض صفحة المنيو
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.open("/menu.pdf", "_blank")}
                  className="w-full flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50 h-12"
                >
                  <Download size={20} />
                  تحميل المنيو الحالي
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 h-12"
                >
                  <LogOut size={20} />
                  تسجيل الخروج
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-medium text-blue-900 mb-3 text-right">تعليمات الاستخدام:</h3>
                <ul className="text-sm text-blue-800 space-y-2 text-right">
                  <li>• اختر ملف PDF فقط</li>
                  <li>• الحد الأقصى للحجم 10 ميجابايت</li>
                  <li>• سيتم استبدال المنيو القديم</li>
                  <li>• التحديث فوري للزوار</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
