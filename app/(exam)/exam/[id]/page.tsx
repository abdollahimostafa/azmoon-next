"use client"
import { useEffect, useState, use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
type UserAnswer = {
  questionId: string
  answer: string
}
type Question = {
  id: string
  text: string
  options: string[]
  topic: string
  textImageUrl?: string | null
  
}

type ExamData = {
  id: string
  name: string
  duration: number
  questions: Question[]
  startedAt?: string
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params)
  const [exam, setExam] = useState<ExamData | null>(null)
  
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({})
  const [submitted, setSubmitted] = useState<{ [key: string]: boolean }>({})
  const [marked, setMarked] = useState<{ [key: string]: boolean }>({})
  const [markedred, setMarkedred] = useState<{ [key: string]: boolean }>({})
  const [showSummary, setShowSummary] = useState(false)
  const router = useRouter()
  const [previewImage, setPreviewImage] = useState<string | null>(null)


  // Fetch exam (same as your current logic)
  useEffect(() => {
    async function fetchExam() {
      const res = await fetch(`/api/exam/${examId}`)
      const data = await res.json()
      setExam(data.exam)

      const restoredAnswers: { [key: string]: string } = {}
      const restoredSubmitted: { [key: string]: boolean } = {}

      data.exam.questions.forEach((q: Question) => {
const ua = data.exam.userAnswers?.find((a: UserAnswer) => a.questionId === q.id)
        if (ua) {
          restoredAnswers[q.id] = ua.answer
          restoredSubmitted[q.id] = ua.answer !== "X"
        } else {
          restoredAnswers[q.id] = "X"
          restoredSubmitted[q.id] = false
        }
      })
      setAnswers(restoredAnswers)
      setSubmitted(restoredSubmitted)

      const totalSeconds = data.exam.duration * 60
      if (data.exam.startedAt) {
        const elapsed = Math.floor((Date.now() - new Date(data.exam.startedAt).getTime()) / 1000)
        const remaining = Math.max(totalSeconds - elapsed, 0)
        if (remaining === 0) router.push("/dashboard")
        setTimeLeft(remaining)
      } else {
        setTimeLeft(totalSeconds)
      }
    }
    fetchExam()
  }, [examId, router])

  // Timer logic (same)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router])

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  async function handleAnswerSubmit(qId: string, answerLetter: string) {
    setSubmitting(prev => ({ ...prev, [qId]: true }))
    try {
      const res = await fetch(`/api/exam/${examId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: qId, answer: answerLetter })
      })
      if (!res.ok) throw new Error("Failed to save answer")
      setSubmitted(prev => ({ ...prev, [qId]: true }))
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(prev => ({ ...prev, [qId]: false }))
    }
  }

  if (!exam) return <p>Loading exam...</p>

  let lastTopic = ""

  return (
    <div className="p-6 space-y-6">
            {previewImage && (
  <div
    className="fixed inset-0 bg-black/50 flex justify-center  items-center z-50"
    onClick={() => setPreviewImage(null)}
  >
    <div className="relative bg-white rounded p-2 max-w-[80%] lg:max-w-[50%] max-h-[90%]">
<Image width={500} height={500} src={previewImage} alt="Preview" className="max-w-full max-h-full rounded" />
      <button
        className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1"
        onClick={() => setPreviewImage(null)}
      >
        ✕
      </button>
    </div>
  </div>
)}
      {/* Header */}
      <div className="sticky top-5 bg-white z-50 p-4 rounded-xl shadow-xl">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-md font-bold">{exam.name}</h1>
        
        <div className="text-sm sm:text-md font-mono bg-muted px-3 py-1 rounded-lg flex">
<span className="hidden sm:block">          زمان باقی‌مانده: 
</span>          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition text-sm"
            onClick={() => setShowSummary(true)}
          >
            پاسخ برگ
          </button>
          <button
            className="p-1 px-2 rounded bg-red-600 hover:bg-red-300 text-white text-sm transition"
            onClick={() => router.push("/dashboard")}
          >
خروج         </button>
        </div>
      </div>
<div className="flex flex-wrap gap-2 mt-3">
  {Array.from(new Set(exam.questions.map(q => q.topic))).map((topic) => (
    <button
      key={topic}
      className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
      onClick={() => {
        const el = document.getElementById(`topic-${topic}`)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
      }}
    >
      {topic}
    </button>
  ))}
</div>
</div>
      {/* Questions List (same as before) */}
      <div className="space-y-6 mt-4">
        {exam.questions.map((q, index) => {
          const showTopicHeader = q.topic !== lastTopic
          lastTopic = q.topic
          const isSubmitting = submitting[q.id]
          const isSubmitted = submitted[q.id]

          return (
            <div key={q.id} className="space-y-2">
              {showTopicHeader && (
                <div id={`topic-${q.topic}`} className="flex items-center gap-2 mt-6 mb-2">
                  <div className="flex-1 h-px bg-gray-300" />
                  <h2 className="text-xl font-bold px-3 py-1 rounded-md bg-blue-100 text-blue-800 shadow-sm">{q.topic}</h2>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              )}
              <Card id={`question-${q.id}`} dir="rtl" className={`relative transition ${isSubmitted && answers[q.id] !== "X" ? "bg-green-500/10" : ""} ${marked[q.id] ? "bg-yellow-100" : ""} ${markedred[q.id] ? "bg-red-100" : ""}`}>
                {isSubmitting && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  {/* Mark buttons */}
                  <div className="flex items-start justify-end">
                    <button className={`px-2 py-1 rounded text-sm font-medium ${marked[q.id] ? "bg-yellow-300 text-yellow-900" : "bg-gray-200 text-gray-800"} hover:bg-yellow-200 transition`}
                      onClick={() => { setMarked(prev => ({ ...prev, [q.id]: !prev[q.id] })); setMarkedred(prev => ({ ...prev, [q.id]: false })); }}>
                      {marked[q.id] ? "شک دارم" : "شک دارم"}
                    </button>
                    <button className={`px-2 py-1 mr-4 rounded text-sm font-medium ${markedred[q.id] ? "bg-red-300 text-yellow-900" : "bg-gray-200 text-gray-800"} hover:bg-red-200 transition`}
                      onClick={() => { setMarkedred(prev => ({ ...prev, [q.id]: !prev[q.id] })); setMarked(prev => ({ ...prev, [q.id]: false })); }}>
                      {markedred[q.id] ? "اصلا نمیدونم" : "اصلا نمیدونم"}
                    </button>
                  </div>

                  <p className="font-medium"><span className="bg-blue-300/30 p-1 w-8 h-8">{index + 1}.</span> {q.text}</p>
{q.textImageUrl && (
<Image width={500} height={500}    src={q.textImageUrl}
    alt="تصویر متن سوال"
    className="mt-2 w-40 h-40 object-contain border rounded cursor-pointer hover:scale-105 transition-transform"
    onClick={() => setPreviewImage(q.textImageUrl!)} // ✅ open popup
  />
)}

                  <div className="space-y-2">
                    {["بدون پاسخ", ...q.options].map((opt, i) => (
                      <label key={i} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={answers[q.id] === (i === 0 ? "X" : ["A", "B", "C", "D"][i - 1])}
                          onChange={() => {
                            const answerLetter = i === 0 ? "X" : ["A", "B", "C", "D"][i - 1]
                            handleAnswerSubmit(q.id, answerLetter)
                            setAnswers(prev => ({ ...prev, [q.id]: answerLetter }))
                          }}
                          disabled={isSubmitting}
                          className="ml-2"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Summary Modal */}
{/* Summary Modal */}
{showSummary && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-11/12 max-w-xl relative">
      <button
        className="absolute top-4 left-4 p-1 hover:bg-gray-200 rounded"
        onClick={() => setShowSummary(false)}
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-bold mb-4">پاسخ برگ</h2>
      <div className="grid grid-cols-10 gap-2">
        {exam.questions.map((q, i) => {
          const answer = answers[q.id] || "X"
          const isMarked = marked[q.id]
          const isMarkedRed = markedred[q.id]
          
          const bgColor = answer !== "X" ? "bg-black" : "bg-white"
          let borderColor = ""
          if (isMarked) borderColor = "border-4 border-yellow-400"
          else if (isMarkedRed) borderColor = "border-4 border-red-500"

          return (
            <div
              key={q.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                const el = document.getElementById(`question-${q.id}`)
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                  setShowSummary(false)
                }
              }}
            >
              <div className={`w-6 h-6 rounded ${bgColor} ${borderColor}`}></div>
              <span className="text-xs mt-1">{i + 1}</span>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)}


    </div>
  )
}
