"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from 'sonner'

type Exam = {
  id: string
  name: string
  description?: string
  startDate: string | null
  endDate: string | null
  duration: number
  numberOfQuestions: number
  status: string
  price?: number
}

export default function AdminExamsPage() {
  const router = useRouter()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(false)

  const fetchExams = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/fetchall")
      const data = await res.json()
      setExams(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این آزمون مطمئن هستید؟")) return
    try {
      const res = await fetch(`/api/admin/exam/${id}/delete`, { method: "DELETE" })
      if (res.ok) {
        setExams((prev) => prev.filter((e) => e.id !== id))
        toast.success('با موفقیت حذف شد', { className: 'ggfont' })
      } else {
        const data = await res.json()
        toast.error(data.error || 'حذف با خطا مواجه شد', { className: 'ggfont' })
      }
    } catch (err) {
      console.error(err)
      toast.error('حذف با خطا مواجه شد', { className: 'ggfont' })
    }
  }

  const handleClose = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/exam/${id}/close`, { method: "POST" })
      if (res.ok) {
        setExams(exams.map((e) => (e.id === id ? { ...e, status: "closed" } : e)))
        toast.success('با موفقیت بسته شد', { className: 'ggfont' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p>در حال بارگذاری...</p>

  return (
    <div className="p-6 space-y-4 rtl">
      <h1 className="text-2xl font-bold mb-4">مدیریت آزمون‌ها</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <Card key={exam.id} className="border">
            <CardHeader>
              <CardTitle>{exam.name}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <p>تعداد سوالات: {exam.numberOfQuestions}</p>
              <p>مدت زمان: {exam.duration} دقیقه</p>
              <p>وضعیت: {exam.status}</p>
              {exam.price && <p>قیمت: {exam.price}</p>}
              {exam.startDate && <p>شروع: {new Date(exam.startDate).toLocaleString("fa-IR")}</p>}
              {exam.endDate && <p>پایان: {new Date(exam.endDate).toLocaleString("fa-IR")}</p>}
            </CardContent>
            <div className="flex gap-2 p-2">
              <Button variant="default" size="sm" onClick={() => router.push(`/admin/exam/edit/${exam.id}`)}>
                ویرایش
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(exam.id)}>
                حذف
              </Button>
              {exam.status !== "closed" && (
                <Button variant="secondary" size="sm" onClick={() => handleClose(exam.id)}>
                  بستن آزمون
                </Button>
                
              )}
                <Button
    variant="outline"
    size="sm"
    onClick={() => router.push(`/admin/registerexam/${exam.id}`)}
  >
    کاربران ثبت‌نام‌شده
  </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
