"use client"
import { ChartBarInteractive } from "@/components/chart/area"
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
    status?: string // "open" | "closed" | "upcoming"
  }
  completedAt: string
}

export default function Page() {
  const [exams, setExams] = useState<UserExam[]>([])
  const [loading, setLoading] = useState(true)

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

  const activeExams = exams.filter((exam) => {
    const now = Date.now()
    const startTime = new Date(exam.exam.startDate).getTime()
    const endTime = new Date(exam.exam.endDate).getTime()
    const isClosed = exam.exam.status === "closed"
    const isEnded = now > endTime
    const notStarted = now < startTime

    return !notStarted && !isClosed && !isEnded
  })


  return (
    <div>
      {/* Header */}
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
                <BreadcrumbLink href="#">
                  ناحیه کاربری شخصی من
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Top stats grid */}
        <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Chart 1 */}
       

          {/* Active exams */}
          <div className="bg-muted/50 rounded-xl p-4 flex flex-col justify-between border-2 col-span-1 sm:col-span-2 lg:col-span-2">
            <div>
              <h2 className="text-xl font-semibold mb-1">آزمون‌های فعال من</h2>
              <h2 className="text-sm font-light mb-1">
                در صورت وجود آزمون فعالی برای شما در این لحظه، لیست آزمون‌ها در زیر
                نمایان می‌گردد.
              </h2>
            </div>

            {/* Exam rows */}
            <div className="mt-4">
              {loading ? (
                <p>در حال بارگذاری...</p>
              ) : activeExams.length === 0 ? (
                <p className="text-muted-foreground">
                  آزمون فعالی برای شما وجود ندارد.
                </p>
              ) : (
                <div className="space-y-4">
                  {activeExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between bg-white/80 p-3 rounded-lg shadow"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {exam.exam.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          شروع: {formatDate(exam.exam.startDate)}
                        </span>
                      </div>

                      <button
                        className="px-3 py-1 rounded-md text-sm bg-primary text-white hover:bg-primary/90"
                        onClick={() =>
                          (window.location.href = `/dashboard/myexams`)
                        }
                      >
                        شرکت در آزمون
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
<div className="bg-muted/50 rounded-xl p-4 flex flex-col justify-between border-2 col-span-1 sm:col-span-2 lg:col-span-2 min-h-80">
            <div>
              <h2 className="text-xl font-semibold mb-1">آزمون های خریداری شده</h2>
              <h2 className="text-sm font-light mb-1">
                در صورت خریداری آزمونی برای شما  لیست آزمون‌ها در زیر
                نمایان می‌گردد.
              </h2>
            </div>

            {/* Exam rows */}
       <div className="mt-4">
  {loading ? (
    <p>در حال بارگذاری...</p>
  ) : exams.length === 0 ? (
    <p className="text-muted-foreground">هیچ آزمونی موجود نیست.</p>
  ) : (
  <div className="space-y-4 max-h-50 overflow-y-auto">
  {exams.map((exam) => (
    <div
      key={exam.id}
      className="flex items-center justify-between bg-white/80 p-2 rounded-lg shadow-xl"
    >
      <div className="flex flex-row justify-between w-full" dir="ltr">
        <span className="text-xs text-gray-500">
          ( شروع: {formatDate(exam.exam.startDate)} )
        </span>
        <span className="text-sm font-medium">{exam.exam.name}</span>
      </div>
    </div>
  ))}
</div>

  )}
</div>

          </div>
        </div>

        {/* Chart bottom */}
        <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl md:min-h-min mt-2">
          <ChartBarInteractive />
        </div>
      </div>
    </div>
  )
}
