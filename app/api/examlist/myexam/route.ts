import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const exams = await prisma.userExam.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        exam: true, // pulls exam info
      },
      orderBy: {
        completedAt: "desc", // make sure this field exists in your schema
      },
    })

    return NextResponse.json({ exams }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
  }
}
