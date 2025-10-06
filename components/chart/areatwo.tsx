"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ScoreItem {
  id: string
  examName: string
  userName: string
  score: number
  percentage: number
  createdAt: string
}

const chartConfig = {
  views: { label: "نمره" },
  desktop: { label: "نمره", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartBarInteractivetwo() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("desktop")
  const [chartData, setChartData] = React.useState<{ date: string; desktop: number }[]>([])

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, item) => acc + item.desktop, 0),
    }),
    [chartData]
  )

  React.useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("/api/exam/scores")
        const data: ScoreItem[] = await res.json()

        const mapped = data.map((item) => ({
          date: new Date(item.createdAt).toLocaleDateString("fa-IR-u-ca-persian", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          desktop: item.score,
        }))

        setChartData(mapped)
      } catch (err) {
        console.error("Failed to fetch scores", err)
      }
    }

    fetchScores()
  }, [])

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>نمودار پیشرفت</CardTitle>
          <CardDescription>نمره های شما و پیشرفت تان در گذر زمان</CardDescription>
        </div>
        <div className="flex">
          {["desktop"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">{chartConfig[chart].label}</span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="desktop"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("fa-IR-u-ca-persian", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
