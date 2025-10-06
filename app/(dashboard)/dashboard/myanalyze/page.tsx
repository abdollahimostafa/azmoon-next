"use client"

import { useEffect, useState } from "react"
import { ChartBarInteractive } from "@/components/chart/area"
import { ChartBarInteractivetwo } from "@/components/chart/areatwo"
import { ChartRadialShape } from "@/components/chart/pie"
import { ChartRadialText } from "@/components/chart/radartotal"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Page() {
  const [data, setData] = useState<{
    totalQuestions: number
    totalExams: number
    correctAnswers: number
    wrongAnswers: number
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/useranal")
        if (!res.ok) throw new Error("Failed to fetch user analysis")
        const json = await res.json()
        setData(json)
        console.log(json)
      } catch (err) {
        console.error("Error fetching user analysis:", err)
      }
    }
    fetchData()
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        در حال بارگذاری...
      </div>
    )
  }

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

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Performance Chart */}
        <div className="bg-muted/50 min-h-[400px] flex-1 rounded-xl md:min-h-min mt-2 p-4">
          <h2 className="text-lg font-semibold mb-2">روند عملکرد من</h2>
          <ChartBarInteractive />
          <div className="mt-4">
            <ChartBarInteractivetwo />
          </div>

          <div className="grid auto-rows-min gap-1 md:grid-cols-2 mt-4">
            <div className="aspect-video rounded-xl pt-6 text-center">
              <ChartRadialShape
                visitors={data.totalQuestions}
                label="سوال"
              />
              <h1>تعداد کل سوالات پاسخ داده شده</h1>
            </div>
            <div className="aspect-video rounded-xl pt-6 text-center">
              <ChartRadialShape
                visitors={0 | data.totalExams}
                label="آزمون"
              /> 
                            <h1>تعداد آزمون های شما</h1>

            </div>
          </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-2 mt-6">
            <div className="aspect-video rounded-xl pt-6 text-center">
              <ChartRadialShape
                visitors={0 | data.correctAnswers}
                label="تعداد پاسخ های صحیح"
              />
                            <h1>تعداد کل پاسخ های صحیح</h1>

            </div>
            <div className="aspect-video rounded-xl pt-6 text-center">
              <ChartRadialText
                visitors={0|data.wrongAnswers}
                label="تعداد پاسخ های غلط"
              />
                            <h1>تعداد کل پاسخ های غلط</h1>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
