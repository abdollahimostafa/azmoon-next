import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        duration: true,
        numberOfQuestions: true,
        status: true,
        price: true,
      },
    })
    return NextResponse.json(exams)
  } catch (error) {
    console.error("Error fetching exams:", error)
    return NextResponse.json({ error: "خطا در دریافت آزمون‌ها" }, { status: 500 })
  }
}
