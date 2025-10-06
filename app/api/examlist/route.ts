// app/api/examlist/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id

    const exams = await prisma.exam.findMany({
      orderBy: { startDate: "asc" },
      include: {
        userExams: {
          where: { userId },
          select: { id: true }, // just check existence
        },
      },
    })

    const formatted = exams.map((exam) => ({
      ...exam,
      isRegistered: exam.userExams.length > 0,
    }))

    return NextResponse.json({ exams: formatted })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
  }
}
