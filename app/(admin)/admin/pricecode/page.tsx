"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PriceOff {
  id: string
  code: string
  amount: number
  usageCount: number
  maxUsage: number | null
}

export default function PriceOffPage() {
  const [codes, setCodes] = useState<PriceOff[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ code: "", amount: "", maxUsage: "" })

  // Fetch all codes
  const fetchCodes = async () => {
    const res = await fetch("/api/admin/pricecode")
    const data = await res.json()
    setCodes(data)
  }

  useEffect(() => {
    fetchCodes()
  }, [])

  // Create new code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/pricecode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          amount: parseInt(form.amount),
          maxUsage: form.maxUsage ? parseInt(form.maxUsage) : null,
        }),
      })
      if (res.ok) {
        setForm({ code: "", amount: "", maxUsage: "" })
        fetchCodes()
      }
    } finally {
      setLoading(false)
    }
  }

  // Delete a code
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code?")) return
    await fetch(`/api/admin/pricecode?id=${id}`, { method: "DELETE" })
    fetchCodes()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>ساخت کد تخفیف</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Code (e.g. SPRING50)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Amount (%)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Max Usage (optional)"
              value={form.maxUsage}
              onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "درحال ساخت..." : "ساخت کد"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Code List */}
      <Card>
        <CardHeader>
          <CardTitle>همه کد های تخفیف</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">کد</th>
                <th className="p-2 border">مقدار درصد (%)</th>
                <th className="p-2 border">تعداد بار استفاده شده تا حالا</th>
                <th className="p-2 border">حد مصرف</th>
                <th className="p-2 border">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id}>
                  <td className="p-2 border">{c.code}</td>
                  <td className="p-2 border">{c.amount}</td>
                  <td className="p-2 border">{c.usageCount}</td>
                  <td className="p-2 border">{c.maxUsage ?? "∞"}</td>
                  <td className="p-2 border">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(c.id)}
                    >
                      حذف
                    </Button>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
کد تخفیفی پیدا نشد                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
