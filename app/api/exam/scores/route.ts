import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch the last 5 scores for THIS user only
    const lastScores = await prisma.examScore.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: true, // optional: include user info
        exam: true, // optional: include exam info
      },
    })

    return NextResponse.json(lastScores)
  } catch (err) {
    console.error("Error fetching last 5 scores:", err)
    return NextResponse.json(
      { error: "خطا در دریافت آخرین نمرات" },
      { status: 500 }
    )
  }
}
