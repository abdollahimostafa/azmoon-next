"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function VerifyResult() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"success" | "failed" | "loading">("loading")
  const [refId, setRefId] = useState<string | null>(null)

  useEffect(() => {
    const paymentStatus = searchParams.get("status")

    if ( !paymentStatus) {
      setStatus("failed")
      return
    }

    if (paymentStatus === "NOK") {
      setStatus("failed")
    } else {
      setStatus("success")
      setRefId(searchParams.get("refId")) // optional, can pass from server
    }
  }, [searchParams])

  const handleBack = () => router.push("/dashboard") // replace with your dashboard route

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      {status === "loading" && <p className="text-lg font-medium">در حال بررسی تراکنش...</p>}

      {status === "success" && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">پرداخت موفق بود!</h1>
          {refId && <p className="mb-4">شناسه تراکنش: {refId}</p>}
          <Button onClick={handleBack} className="mt-2">
            بازگشت به داشبورد
          </Button>
        </div>
      )}

      {status === "failed" && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">پرداخت ناموفق بود!</h1>
          <p className="mb-4">لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.</p>
          <Button onClick={handleBack} className="mt-2">
            بازگشت به داشبورد
          </Button>
        </div>
      )}
    </div>
  )
}
