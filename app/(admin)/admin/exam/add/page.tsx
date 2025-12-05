"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Image from "next/image"
import { ImageUploaderButton } from "@/components/ImageUploaderButton"

type FormState = {
  name: string
  description: string
  startDate: Date | null
  endDate: Date | null
  duration: string
  numberOfQuestions: string
  status: string
  price: string
  topics: Topic[]
}

type Question = {
  text: string
  textImageUrl?: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correct: string
  description: string
  descriptionImageUrl?: string
}


const FIXED_TOPICS = [
  "ریه",
  "رادیولوژی",
  "روماتولوژی",
  "ارتوپدی",
  "اطفال",
  "عفونی",
  "اورولوژی",
  "زنان",
  "قلب",
    "فارما",
  "غدد",
  "نورولوژی",
  "پوست",
  "پاتولوژی",
  "نفرولوژی",
  "هماتولوژی",
  "جراحی",
  "گوارش",
    "روان",
  "چشم",
    "ای ان تی",
  "اپیدمیولوژی",
  "آمار",
    "رکورداول",
  "رکورد دوم",
  "رکورد سوم",
  "رکورد چهارم",
  "رکورد پنجم",
  "رکورد ششم",
]

type Topic = {
  name: string
  questions: Question[]
}

export default function CreateExamPage() {
  const router = useRouter()
    const [loading, setLoading] = useState(false)
const [previewImage, setPreviewImage] = useState<string | null>(null)

const [form, setForm] = useState<FormState>({
  name: "",
  description: "",
  startDate: null,
  endDate: null,
  duration: "",
  numberOfQuestions: "",
  status: "draft",
  price: "",
  topics: [],
})


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateTimeChange = (field: "startDate" | "endDate", date: Date | null, time?: string) => {
    if (!date) {
      setForm((prev) => ({ ...prev, [field]: null }))
      return
    }
    if (time) {
      const [hours, minutes] = time.split(":").map(Number)
      date.setHours(hours)
      date.setMinutes(minutes)
    }
    setForm((prev) => ({ ...prev, [field]: date }))
  }

  // --- Topics & Questions Handlers ---
  const addTopic = () =>
    setForm((prev) => ({ ...prev, topics: [...prev.topics, { name: "", questions: [] }] }))

  const removeTopic = (index: number) =>
    setForm((prev) => ({ ...prev, topics: prev.topics.filter((_, i) => i !== index) }))

  const updateTopicName = (index: number, value: string) =>
    setForm((prev) => {
      const topics = [...prev.topics]
      topics[index].name = value
      return { ...prev, topics }
    })

  const addQuestion = (topicIndex: number) =>
    setForm((prev) => {
      const topics = [...prev.topics]
      topics[topicIndex].questions.push({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correct: "",
        description: "",   // ← initialize empty
      })
      return { ...prev, topics }
    })

  const updateQuestion = (topicIndex: number, questionIndex: number, field: keyof Question, value: string) =>
    setForm((prev) => {
      const topics = [...prev.topics]
      topics[topicIndex].questions[questionIndex][field] = value
      return { ...prev, topics }
    })

  const removeQuestion = (topicIndex: number, questionIndex: number) =>
    setForm((prev) => {
      const topics = [...prev.topics]
      topics[topicIndex].questions = topics[topicIndex].questions.filter((_, i) => i !== questionIndex)
      return { ...prev, topics }
    })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        startDate: form.startDate?.toISOString() ?? null,
        endDate: form.endDate?.toISOString() ?? null,
        duration: parseInt(form.duration),
        numberOfQuestions: parseInt(form.numberOfQuestions),
        status: form.status,
        price: form.price ? parseInt(form.price) : null,
        topics: form.topics.map((topic) => ({
          name: topic.name,
          questions: topic.questions.map((q) => ({
            text: q.text,
              textImageUrl: q.textImageUrl || null,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correct: q.correct,
            description: q.description,
              descriptionImageUrl: q.descriptionImageUrl || null,  // ← send description to backend
          })),
        })),
      }

      const res = await fetch("/api/admin/examadd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("خطا در ایجاد آزمون")
      router.push("/admin/exam")
    } catch (err) {
          setLoading(false)

      console.error(err)
      alert("خطا در ایجاد آزمون")
    }
  }

  return (
    
    <div className="p-6 space-y-6 rtl text-right">
      {previewImage && (
  <div
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    onClick={() => setPreviewImage(null)}
  >
    <div className="relative bg-white rounded p-2 max-w-[90%] max-h-[90%]">
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

      <h1 className="text-2xl font-bold">ایجاد آزمون جدید</h1>

      {/* --- Exam Details --- */}
      <div className="space-y-2">
        <Label htmlFor="name">عنوان آزمون</Label>
        <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="عنوان آزمون را وارد کنید" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="توضیحات آزمون (اختیاری)" />
      </div>

      {/* --- Start & End Date --- */}
{(["startDate", "endDate"] as const).map((field) => (
  <div key={field} className="space-y-2">
    <Label>{field === "startDate" ? "تاریخ و ساعت شروع" : "تاریخ و ساعت پایان"}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-right font-normal",
            !form[field] && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {form[field] ? format(form[field]!, "PPP HH:mm") : "انتخاب تاریخ و ساعت"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-2" align="end">
        <Calendar
          mode="single"
          selected={form[field] ?? undefined}
          onSelect={(date) => handleDateTimeChange(field, date ?? null)}
          initialFocus
        />
        <Input
          type="time"
          onChange={(e) => handleDateTimeChange(field, form[field], e.target.value)}
        />
      </PopoverContent>
    </Popover>
  </div>
))}


      {/* --- Duration, Number of Questions, Status, Price --- */}
      <div className="space-y-2">
        <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
        <Input id="duration" name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="مثلاً ۶۰" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberOfQuestions">تعداد سوالات</Label>
        <Input id="numberOfQuestions" name="numberOfQuestions" type="number" value={form.numberOfQuestions} onChange={handleChange} placeholder="مثلاً ۱۰" />
      </div>

      <div className="space-y-2">
        <Label>وضعیت آزمون</Label>
        <Select value={form.status} onValueChange={(val) => setForm((prev) => ({ ...prev, status: val }))}>
          <SelectTrigger><SelectValue placeholder="انتخاب وضعیت" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="پیش نویس">پیش‌نویس</SelectItem>
            <SelectItem value="منتشر شده">منتشر شده</SelectItem>
            <SelectItem value="بسته شده">بسته شده</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">هزینه (اختیاری)</Label>
        <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} placeholder="مثلاً ۵۰۰۰۰" />
      </div>

      {/* --- Topics & Questions --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">موضوعات و سوالات</h2>
        {form.topics.map((topic, tIndex) => (
          <div key={tIndex} className="border p-4 rounded space-y-2">
            <div className="flex justify-between items-center">
              <Label>موضوع {tIndex + 1}</Label>
              <Button variant="destructive" size="sm" onClick={() => removeTopic(tIndex)}>حذف موضوع</Button>
            </div>
<Select value={topic.name} onValueChange={(val) => updateTopicName(tIndex, val)}>
  <SelectTrigger>
    <SelectValue placeholder="انتخاب موضوع" />
  </SelectTrigger>
  <SelectContent>
    {FIXED_TOPICS.map((t) => (
      <SelectItem key={t} value={t}>
        {t}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

            {topic.questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-2 rounded space-y-1">
                <div className="flex justify-between items-center">
                  <Label>سوال {qIndex + 1}</Label>
                  <Button variant="destructive" size="sm" onClick={() => removeQuestion(tIndex, qIndex)}>حذف سوال</Button>
                </div>
                                  <Label>تصویر سوال</Label>

{q.textImageUrl && (
<Image width={500} height={500}
    src={q.textImageUrl}
    alt="Question Image"
    className="max-h-24 mt-2 cursor-pointer border rounded"
    onClick={() => setPreviewImage(q.textImageUrl!)}
  />
)}                                                  <Label>تصویر پاسخ</Label>

{q.descriptionImageUrl && (
<Image width={500} height={500}
    src={q.descriptionImageUrl}
    alt="Description Image"
    className="max-h-24 mt-2 cursor-pointer border rounded"
    onClick={() => setPreviewImage(q.descriptionImageUrl!)}
  />
)}
                <Input placeholder="متن سوال" value={q.text} onChange={(e) => updateQuestion(tIndex, qIndex, "text", e.target.value)} />
                <Input placeholder="گزینه A" value={q.optionA} onChange={(e) => updateQuestion(tIndex, qIndex, "optionA", e.target.value)} />
                <Input placeholder="گزینه B" value={q.optionB} onChange={(e) => updateQuestion(tIndex, qIndex, "optionB", e.target.value)} />
                <Input placeholder="گزینه C" value={q.optionC} onChange={(e) => updateQuestion(tIndex, qIndex, "optionC", e.target.value)} />
                <Input placeholder="گزینه D" value={q.optionD} onChange={(e) => updateQuestion(tIndex, qIndex, "optionD", e.target.value)} />
<div className="flex gap-2 items-center">
  <Input
    placeholder="لینک تصویر متن سوال (اختیاری)"
    value={q.textImageUrl || ""}
    onChange={(e) => updateQuestion(tIndex, qIndex, "textImageUrl", e.target.value)}
  />
<ImageUploaderButton
  onUpload={(url) => updateQuestion(tIndex, qIndex, "textImageUrl", url)}
/>
</div>

{/* --- Image URL input with uploader for description image --- */}
<div className="flex gap-2 items-center">
  <Input
    placeholder="لینک تصویر توضیحات سوال (اختیاری)"
    value={q.descriptionImageUrl || ""}
    onChange={(e) => updateQuestion(tIndex, qIndex, "descriptionImageUrl", e.target.value)}
  />
<ImageUploaderButton
  onUpload={(url) => updateQuestion(tIndex, qIndex, "descriptionImageUrl", url)}
/>
</div>


                 <Textarea placeholder="توضیحات سوال" value={q.description} onChange={(e) => updateQuestion(tIndex, qIndex, "description", e.target.value)} />


                <Select value={q.correct} onValueChange={(val) => updateQuestion(tIndex, qIndex, "correct", val)}>
                  <SelectTrigger><SelectValue placeholder="گزینه صحیح" /></SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <Button onClick={() => addQuestion(tIndex)}>افزودن سوال جدید</Button>
          </div>
        ))}
        <Button onClick={addTopic}>افزودن موضوع جدید</Button>
      </div>

      <Button onClick={handleSubmit}   disabled={loading} className="w-full mt-4">ثبت آزمون</Button>
    </div>
  )
}
