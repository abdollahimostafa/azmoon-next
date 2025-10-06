"use client"

import { useEffect, useState } from "react"

type Payment = {
  id: string
  user: {
    firstName: string
    lastName: string
    phoneNumber: string
  }
  exam: {
    name: string
  }
  amount: number
  status: string
  refId?: string
  discountCode?: string
  createdAt: string
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/admin/payments")
        const data = await res.json()
        setPayments(data.payments || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">پرداخت‌ها</h1>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : payments.length === 0 ? (
        <p>پرداختی وجود ندارد.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full table-auto text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ردیف</th>
                <th className="border px-4 py-2">کاربر</th>
                <th className="border px-4 py-2">شماره تلفن</th>
                <th className="border px-4 py-2">آزمون</th>
                <th className="border px-4 py-2">مبلغ</th>
                <th className="border px-4 py-2">وضعیت</th>
                <th className="border px-4 py-2">شناسه بانک</th>
                <th className="border px-4 py-2">کد تخفیف</th>
                <th className="border px-4 py-2">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={p.id} className="even:bg-gray-50 text-sm">
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{p.user.firstName} {p.user.lastName}</td>
                  <td className="border px-4 py-2">{p.user.phoneNumber}</td>
                  <td className="border px-4 py-2">{p.exam.name}</td>
                  <td className="border px-4 py-2">{p.amount.toLocaleString()} تومان</td>
                  <td className="border px-4 py-2">
                    {p.status === "success" && <span className="text-green-600">موفق</span>}
                    {p.status === "pending" && <span className="text-yellow-600">در انتظار</span>}
                    {p.status === "failed" && <span className="text-red-600">ناموفق</span>}
                  </td>
                  <td className="border px-4 py-2">{p.refId || "-"}</td>
                  <td className="border px-4 py-2">{p.discountCode || "-"}</td>
                  <td className="border px-4 py-2">{new Date(p.createdAt).toLocaleString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
