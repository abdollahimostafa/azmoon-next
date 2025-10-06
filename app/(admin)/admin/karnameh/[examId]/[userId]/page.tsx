"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"
import { use } from "react"
type Question = {
  id: string
  topic: string
  correct: string
}

type UserAnswer = {
  questionId: string
  answer: string
}

type ExamData = {
  id: string
  name: string
  startedAt: string
  duration: number
  questions: Question[]
  userAnswers: UserAnswer[]
  totalParticipants: number
  topicStats: Record<string, { min: number; max: number }>
  overtime?: boolean
}

export default function AdminKarnameh({ params }: { params: Promise<{ examId: string; userId: string }> }) {
  const { examId, userId } = use(params)

  
  const [exam, setExam] = useState<ExamData | null>(null)
  const router = useRouter()

  
useEffect(() => {
  async function fetchExam() {
    try {
      const res = await fetch(`/api/admin/karnameh/${examId}/${userId}`)
      console.log(res)
      if (!res.ok) {
        console.error("Error fetching exam:", res.status)
        return
      }
      const data = await res.json()
      setExam(data.exam)
    } catch (err) {
      console.error("Fetch failed:", err)
    }
  }
  fetchExam()
}, [examId, userId])


  if (!exam) return <p>Loading exam...</p>

  const answersMap: { [key: string]: string } = {}
  exam.userAnswers.forEach((ua) => {
    answersMap[ua.questionId] = ua.answer
  })

  const topics = Array.from(new Set(exam.questions.map((q) => q.topic)))
  const topicStats = topics.map((topic) => {
    const qs = exam.questions.filter((q) => q.topic === topic)
    const total = qs.length
    const correct = qs.filter((q) => answersMap[q.id] === q.correct).length
    const empty = qs.filter((q) => !answersMap[q.id] || answersMap[q.id] === "X").length
    const wrong = total - correct - empty
    const percentage = (correct / total) * 100

    return {
      topic,
      total,
      correct,
      wrong,
      empty,
      percentage,
      rawScore: correct,
      min: exam.topicStats?.[topic]?.min ?? 0,
      max: exam.topicStats?.[topic]?.max ?? 0,
      avg: ((exam.topicStats?.[topic]?.min ?? 0) + (exam.topicStats?.[topic]?.max ?? 0)) / 2,
    }
  })

  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(exam.startedAt))
  return (
    <div className="p-6 space-y-6">
      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold">{exam.name} - کارنامه کاربر</h1>
        <div className="flex items-center space-x-3">
          <button
            className="no-print p-2 rounded bg-muted hover:bg-muted/90 transition"
            onClick={() => window.print()}
          >
            <Printer className="w-5 h-5" />
          </button>

          <button
            className="no-print p-2 rounded hover:bg-muted/50 transition"
            onClick={() => router.push("/admin/exam")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exam info */}
      <div className="overflow-x-auto border rounded-lg p-4 mb-6">
        <table className="min-w-full text-center table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">سامانه</th>
              <th className="px-4 py-2">عنوان آزمون</th>
              <th className="px-4 py-2">تاریخ آزمون</th>
              <th className="px-4 py-2">تعداد شرکت‌کنندگان</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-50">
              <td className="border px-4 py-2 text-sm">سامانه ماد</td>
              <td className="border px-4 py-2 text-sm">{exam.name}</td>
              <td className="border px-4 py-2 text-sm">{persianDate}</td>
              <td className="border px-4 py-2 text-sm">{exam.totalParticipants}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Topic Performance */}
      <div className="overflow-x-auto border rounded-lg p-4 mb-6">
        <table className="min-w-full table-auto text-right border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th rowSpan={2} className="border px-4 py-2">موضوع</th>
              <th colSpan={2} className="border px-4 py-2">عملکرد کاربر</th>
              <th colSpan={4} className="border px-4 py-2">وضعیت پاسخوگویی</th>
              <th colSpan={3} className="border px-4 py-2">عملکرد سایرین</th>
            </tr>
            <tr>
              <th className="border px-4 py-2">نمره از ۱۰۰</th>
              <th className="border px-4 py-2">نمره از ۲۰</th>
              <th className="border px-4 py-2">تعداد کل</th>
              <th className="border px-4 py-2">صحیح</th>
              <th className="border px-4 py-2">غلط</th>
              <th className="border px-4 py-2">سفید</th>
              <th className="border px-4 py-2">کمترین درصد</th>
              <th className="border px-4 py-2">بیشترین درصد</th>
              <th className="border px-4 py-2">میانگین درصد</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {topicStats.map((t) => (
              <tr key={t.topic} className="even:bg-gray-50">
                <td className="border px-4 py-2">{t.topic}</td>
                <td className="border px-4 py-2 text-green-700">{t.percentage.toFixed(2)}</td>
                <td className="border px-4 py-2 text-blue-700">{(t.percentage / 5).toFixed(2)}</td>
                <td className="border px-4 py-2">{t.total}</td>
                <td className="border px-4 py-2 text-green-700">{t.correct}</td>
                <td className="border px-4 py-2 text-red-600">{t.wrong}</td>
                <td className="border px-4 py-2 text-gray-500">{t.empty}</td>
                <td className="border px-4 py-2 text-red-600">{t.min.toFixed(2)}</td>
                <td className="border px-4 py-2 text-green-700">{t.max.toFixed(2)}</td>
                <td className="border px-4 py-2 text-blue-700">{t.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Answer Sheet */}
      <div className="overflow-x-auto border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold mb-4">پاسخ برگ کاربر</h2>
        <table className="min-w-full table-auto text-center border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">شماره سوال</th>
              <th className="border px-4 py-2">گزینه‌ها</th>
            </tr>
          </thead>
          <tbody>
            {exam.questions.map((q, idx) => {
              const userAnswer = answersMap[q.id] || "X"
              const options = ["A", "B", "C", "D", "X"]

              return (
                <tr key={q.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2 w-12">{idx + 1}</td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-1">
                      {options.map((opt) => {
                        let bgColor = "bg-gray-100"
                        if (opt === q.correct) bgColor = "bg-green-500"
                        if (opt === userAnswer) {
                          if (userAnswer === "X") bgColor = "bg-yellow-400"
                          else if (userAnswer !== q.correct) bgColor = "bg-black"
                        }

                        return (
                          <div
                            key={opt}
                            className={`${bgColor} w-6 h-6 border border-gray-400 flex items-center justify-center text-white text-xs`}
                          >
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
