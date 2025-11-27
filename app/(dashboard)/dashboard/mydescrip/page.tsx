"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

type UserExam = {
  id: string
  exam: {
    
    id: string
    name: string
    startDate: string
    endDate: string
    duration: number // <-- add this
    status?: string // "open" | "closed" | "upcoming"
  }
  
  completedAt: string
    startedAt: string | null // <-- add this
    overtime?: boolean // <--- add this
}


export default function AnswerSheetPage() {
  const [exams, setExams] = useState<UserExam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch("/api/examlist/myexam")
        const data = await res.json()

        if (res.ok) {
          setExams(data.exams)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">دانلود پاسخ‌نامه آزمون‌ها</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min mt-2">
          <div className="bg-muted/50 rounded-xl p-4 flex flex-col border-2">
            <h2 className="text-xl font-semibold mb-1">مشاهده کارنامه آزمون‌ها</h2>
            <h2 className="text-sm font-light mb-10">
              پس از بسته شدن آزمون، می‌توانید پاسخ‌نامه خود را از این بخش دریافت کنید.
            </h2>

            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : exams.length === 0 ? (
              <p className="text-muted-foreground">هیچ آزمونی یافت نشد.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{exams.map((exam) => {
  const startTime = new Date(exam.exam.startDate).getTime();
const durationMs = exam.exam.duration * 60 * 1000;
const now = Date.now();
const startedAt = exam.startedAt ? new Date(exam.startedAt).getTime() : null;
const endTime = startedAt ? startedAt + durationMs : null;

let canSeeResult = false;
let buttonLabel = "";

// 1. Exam not started yet
if (now < startTime) {
  buttonLabel = "شروع نشده";
  canSeeResult = false;
}

// 2. User hasn't started the exam
else if (!startedAt) {
  buttonLabel = "نتایج هنوز در دسترس نیست";
  canSeeResult = false;
}

// 3. User started but duration not finished yet
else if (endTime && now < endTime) {
  buttonLabel = "نتایج هنوز در دسترس نیست";
  canSeeResult = false;
}

// 4. User started and time is finished → allow results
else {
  buttonLabel = "📄 مشاهده سوالات و نتایج";
  canSeeResult = true;
}

  return (
    <div
      key={exam.id}
      className="flex flex-col justify-between bg-white/80 p-4 rounded-xl shadow-md border"
    >
      <div className="flex flex-col mb-3">
        <span className="text-base font-semibold">{exam.exam.name}</span>
        <span className="text-xs text-gray-500">
          تاریخ برگزاری: {formatDate(exam.exam.startDate)}
        </span>
      </div>

      <button
        disabled={!canSeeResult}
        className={`w-full py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          canSeeResult
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
        onClick={() => {
          if (canSeeResult) {
            window.location.href = `/exam/${exam.exam.id}/karnameh`
          }
        }}
      >
        {buttonLabel}
      </button>
    </div>
  )
})}



              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
