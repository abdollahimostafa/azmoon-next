"use client"
import { useEffect, useState, use } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Question = {
  id: string
  text: string
  options: string[]
  correct: string   // ✅ new field
  topic: string
  description: string
  textImageUrl?: string
  descriptionImageUrl?: string

}

type ExamData = {
  id: string
  name: string
  duration: number // in minutes
  questions: Question[]
  startedAt?: string
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params)
  const [exam, setExam] = useState<ExamData | null>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
const [submitting] = useState<{ [key: string]: boolean }>({})
  const [submitted, setSubmitted] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
  async function fetchExam() {
    const res = await fetch(`/api/exam/${examId}`)
    const data = await res.json()
    setExam(data.exam)

    const { userAnswers } = data.exam

    // Restore previously answered questions
if (userAnswers && userAnswers.length) {
  const restoredAnswers: { [key: string]: string } = {}
  const restoredSubmitted: { [key: string]: boolean } = {}
  userAnswers.forEach((ua: { questionId: string; answer: string }) => {
    restoredAnswers[ua.questionId] = ua.answer
    restoredSubmitted[ua.questionId] = true
  })
  setAnswers(restoredAnswers)
  setSubmitted(restoredSubmitted)
}



  }
  fetchExam()
}, [examId])


 





  if (!exam) return <p>Loading exam...</p>

  const topics = Array.from(new Set(exam.questions.map((q) => q.topic)))
const totalQuestions = exam.questions.length
const correctCount = exam.questions.filter(
  (q) => answers[q.id] === q.correct
).length
const scorePercent = Math.round((correctCount / totalQuestions) * 100)

  return (
    <div className="p-6 space-y-6">
                  {previewImage && (
  <div
    className="fixed inset-0 bg-black/50 flex justify-center  items-center z-50"
    onClick={() => setPreviewImage(null)}
  >
    <div className="relative bg-white rounded p-2 max-w-[80%] lg:max-w-[50%] max-h-[90%]">
     <Image width={500} height={500}src={previewImage} alt="Preview" className="max-w-full max-h-full rounded" />
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
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-md font-bold">{exam.name}</h1>
        </div>
    
        <button
          className="p-1 rounded hover:bg-muted/50 transition"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
<div className="flex items-center justify-between border-b pb-4">
  <div className="flex flex-col gap-1">
    <p className="text-sm text-gray-600">
      نمره شما: {correctCount}/{totalQuestions} ({scorePercent}%)
    </p>
  </div>

 <div className="flex gap-2">

    <div className="bg-blue-700 w-15 h-15 justify-center align-middle text-center py-5 text-white rounded-2xl">{correctCount}/{totalQuestions}</div>
        <div className="bg-blue-700 w-15 h-15 justify-center align-middle text-center py-5 text-white rounded-2xl">{scorePercent}%</div>

 </div>
</div>
{/* Topic Summary Table */}
<div className="overflow-x-auto border rounded-lg p-4 mb-6">
  <table className="min-w-full table-auto text-right">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2">موضوع</th>
        <th className="px-4 py-2">تعداد کل سوالات</th>
        <th className="px-4 py-2">تعداد صحیح</th>
        <th className="px-4 py-2">تعداد غلط</th>
        <th className="px-4 py-2">تعداد بدون پاسخ</th>
        <th className="px-4 py-2">درصد</th>
        <th className="px-4 py-2">نمره خام</th>
      </tr>
    </thead>
    <tbody>
      {topics.map((topic) => {
        const topicQuestions = exam.questions.filter(q => q.topic === topic)
        const total = topicQuestions.length
        const correct = topicQuestions.filter(q => answers[q.id] === q.correct).length
        const empty = topicQuestions.filter(q => !answers[q.id] || answers[q.id] === "X").length
        const wrong = total - correct - empty
        const percent = Math.round((correct / total) * 100)
        const rawScore = correct // you can adjust if scoring is different

        return (
          <tr key={topic} className="even:bg-gray-50">
            <td className="border px-4 py-2">{topic}</td>
            <td className="border px-4 py-2">{total}</td>
            <td className="border px-4 py-2 text-green-700">{correct}</td>
            <td className="border px-4 py-2 text-red-600">{wrong}</td>
            <td className="border px-4 py-2 text-gray-500">{empty}</td>
            <td className="border px-4 py-2">{percent}%</td>
            <td className="border px-4 py-2">{rawScore}</td>
          </tr>
        )
      })}
    </tbody>
  </table>
</div>

      {/* Tabs */}
      <Tabs defaultValue={topics[0]} className="w-full">
        <TabsList>
          {topics.map((topic) => (
            <TabsTrigger key={topic} value={topic}>
              {topic}
            </TabsTrigger>
          ))}
        </TabsList>

        {topics.map((topic) => (
          <TabsContent key={topic} value={topic}>
            <div className="space-y-4 mt-4">
              {exam.questions
                .filter((q) => q.topic === topic)
                .map((q, index) => {
                  const isSubmitting = submitting[q.id]
                  const isSubmitted = submitted[q.id]

                  return (
                    <Card
                      key={q.id}
                      dir="rtl"
                      className={`relative transition ${
                        isSubmitted ? "bg-blue-500/10" : ""
                      }`}
                    >
                      {/* Overlay spinner */}
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                        </div>
                      )}

<CardContent className="p-4 space-y-2">
  <p className="font-medium">
    <span className=" bg-blue-300/30 p-1 w-8 h-8">
      {index + 1}
    </span>{" "}
    {q.text}
  </p>
   {q.textImageUrl && (
<Image width={500} height={500}      src={q.textImageUrl}
      alt="تصویر سوال"
      className="mt-2 w-40 h-40 object-contain border rounded cursor-pointer hover:scale-105 transition-transform"
      onClick={() => setPreviewImage(q.textImageUrl!)}
    />
  )}
  <div className="space-y-2">
    {q.options.map((opt, i) => (
      <label
        key={i}
        className="flex items-center space-x-2 space-x-reverse cursor-pointer"
      >
        <input
          type="radio"
          name={q.id}
          value={opt}
          checked={answers[q.id] === ["A","B","C","D"][i]}
          disabled
          className="ml-2"
        />
        <span className="text-sm">{opt}</span>
      </label>
    ))}
  </div>



{/* ✅ Question Description */}
{q.description && (
  <div className="bg-white border-2 border-dashed border-gray-300 my-2 rounded-xl p-7">
    <p className="text-sm  text-green-700 -mt-3">
  پاسخ صحیح:{" "}
  <span className="font-semibold">
    {q.options[["A", "B", "C", "D"].indexOf(q.correct)]}
  </span>
</p>

  <p className="text-sm mt-1 text-gray-600 ">
    
    توضیح سوال و راهنما:  
  </p>
      <hr className="my-2 border-gray-300" />

<p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
  {q.description}
</p>
{q.descriptionImageUrl && (
<Image width={500} height={500}           src={q.descriptionImageUrl}
          alt="تصویر توضیح"
          className="mt-3 w-40 h-40 object-contain border rounded cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setPreviewImage(q.descriptionImageUrl!)}
        />
      )}
</div>
)}


</CardContent>
                    
                    </Card>
                  )
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
