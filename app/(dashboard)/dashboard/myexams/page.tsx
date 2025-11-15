"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
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

export default function Page() {
  const [exams, setExams] = useState<UserExam[]>([])
  const [loading, setLoading] = useState(true)
const [openDialog, setOpenDialog] = useState(false)
const [selectedExamId, setSelectedExamId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch("/api/examlist/myexam")
        const data = await res.json()
        console.log("API raw response:", data)

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
                <BreadcrumbLink href="#">آزمون های فعال من</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min mt-2">
          <div className="bg-muted/50 rounded-xl p-4 flex flex-col border-2">
            <h2 className="text-xl font-semibold mb-1">آزمون‌های فعال من</h2>
            <h2 className="text-sm font-light mb-10">
              در صورت وجود آزمون فعالی برای شما، لیست آن‌ها در زیر نمایش داده می‌شود.
            </h2>

            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : exams.length === 0 ? (
              <p className="text-muted-foreground">آزمونی ثبت نشده است.</p>
            ) : (
              <div className="space-y-4">
{exams.map((exam) => {
  const startTime = new Date(exam.exam.startDate).getTime()
  const durationMs = exam.exam.duration * 60 * 1000
  const now = Date.now()
  const startedAt = exam.startedAt ? new Date(exam.startedAt).getTime() : null
  const endTime = startedAt ? startedAt + durationMs : null

  let buttonLabel = ""
  let canEnter = false
  if (now < startTime) {
    buttonLabel = "شروع نشده"
    canEnter = false
  } else if (!startedAt) {
    if (exam.exam.status === "closed") {
      buttonLabel = "شروع آزمون تمرینی"
      canEnter = true
    } else {
      buttonLabel = "شروع آزمون آنلاین"
      canEnter = true
    }
  } else if (endTime && now < endTime) {
    buttonLabel = "ادامه آزمون"
    canEnter = true
  } else {
    buttonLabel = "ورود به آزمون"
    canEnter = true
  }

  return (
    <div
      key={exam.id}
      className="flex items-center justify-between bg-white/80 p-3 rounded-lg shadow"
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium">{exam.exam.name}</span>
        <span className="text-xs text-gray-500">
          شروع: {formatDate(exam.exam.startDate)}
        </span>
      </div>

<button
  disabled={!canEnter}
  className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
    !canEnter
      ? "bg-gray-500 text-white cursor-not-allowed"
      : "bg-primary text-white hover:bg-primary/90"
  }`}
  onClick={() => {
    if (!canEnter) return;

    // Open confirm dialog
    setSelectedExamId(exam.exam.id);
    setOpenDialog(true);
  }}
>
  {buttonLabel}
</button>
<Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className="text-right">
    <DialogTitle/>
    <h2 className="text-lg font-semibold">ورود به آزمون</h2>
    <p className="text-sm text-gray-600 mt-2">
      آیا از ورود به آزمون مطمئن هستید؟ زمان آزمون برای شما ثبت خواهد شد.
    </p>
    <p>شما تنها یک بار میتوانید  ازمون را شروع کنید</p>
    <p>پس از شروع ازمون و اتمام زمان ازمون دیگر امکان شرکت مجدد را نخواهید داشت </p>

    <div className="flex justify-end gap-2 mt-6">
      <button
        className="px-3 py-1 rounded-md bg-gray-300 text-black"
        onClick={() => setOpenDialog(false)}
      >
        انصراف
      </button>

      <button
        className="px-3 py-1 rounded-md bg-primary text-white"
        onClick={() => {
          if (selectedExamId) {
            window.location.href = `/exam/${selectedExamId}`
          }
        }}
      >
        بله، وارد شو
      </button>
    </div>
  </DialogContent>
</Dialog>

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
