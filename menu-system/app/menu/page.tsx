"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Home, RefreshCw, ZoomIn, ZoomOut } from "lucide-react"

export default function MenuPage() {
  const [pdfUrl, setPdfUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    loadPDF()
  }, [])

  const loadPDF = () => {
    setIsLoading(true)
    const timestamp = Date.now()
    setPdfUrl(`/menu.pdf?v=${timestamp}`)

    // Check if PDF exists
    fetch(`/menu.pdf?v=${timestamp}`)
      .then((response) => {
        if (response.ok) {
          setError("")
        } else {
          setError("المنيو غير متوفر حالياً")
        }
      })
      .catch(() => {
        setError("خطأ في تحميل المنيو")
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 1000)
      })
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "menu.pdf"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRefresh = () => {
    loadPDF()
  }

  const handleHome = () => {
    window.location.href = "/"
  }

  const adjustZoom = (delta: number) => {
    setZoom((prev) => Math.max(50, Math.min(200, prev + delta)))
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <Card className="w-80">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">جاري تحميل المنيو</h3>
            <p className="text-gray-600">يرجى الانتظار...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-white p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
            <p className="text-gray-600 mb-6">يرجى المحاولة مرة أخرى أو الاتصال بالإدارة</p>
            <div className="space-y-3">
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw size={16} className="mr-2" />
                إعادة المحاولة
              </Button>
              <Button onClick={handleHome} variant="outline" className="w-full">
                <Home size={16} className="mr-2" />
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full bg-white">
      {/* Fixed Control Panel */}
      <div className="fixed top-4 right-4 z-20 space-y-2">
        <div className="bg-white rounded-lg shadow-lg border p-2 space-y-2">
          <Button onClick={handleDownload} size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
            <Download size={16} />
            تحميل
          </Button>

          <Button onClick={handleRefresh} size="sm" variant="outline" className="w-full">
            <RefreshCw size={16} />
            تحديث
          </Button>

          <Button onClick={handleHome} size="sm" variant="outline" className="w-full">
            <Home size={16} />
            الرئيسية
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg border p-2 space-y-2">
          <Button onClick={() => adjustZoom(25)} size="sm" variant="outline" className="w-full">
            <ZoomIn size={16} />
            تكبير
          </Button>

          <div className="text-center text-xs text-gray-600 py-1">{zoom}%</div>

          <Button onClick={() => adjustZoom(-25)} size="sm" variant="outline" className="w-full">
            <ZoomOut size={16} />
            تصغير
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="h-full w-full overflow-auto">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
          <object data={pdfUrl} type="application/pdf" className="w-full h-screen" style={{ minHeight: "100vh" }}>
            {/* Fallback for browsers that don't support object tag */}
            <div className="flex h-screen items-center justify-center p-8">
              <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا يمكن عرض المنيو في المتصفح</h3>
                  <p className="text-gray-600 mb-6">يرجى تحميل المنيو لعرضه على جهازك</p>
                  <Button onClick={handleDownload} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download size={16} className="mr-2" />
                    تحميل المنيو
                  </Button>
                </CardContent>
              </Card>
            </div>
          </object>
        </div>
      </div>

      {/* Mobile Touch Instructions */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm">
          استخدم إصبعين للتكبير والتصغير
        </div>
      </div>
    </div>
  )
}
