import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: Request, context: any) {
    const { params } = context
  const examId = params.id


  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { questionId, answer } = await req.json()

  if (!examId || !questionId || !answer) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 })
  }

  try {
    // Ensure exam exists
    const exam = await prisma.exam.findUnique({ where: { id: examId } })
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    // Ensure userExam exists (user already started exam)
    const userExam = await prisma.userExam.findFirst({
      where: { userId: session.user.id, examId },
    })

    if (!userExam) {
      return NextResponse.json({ error: "Exam session not started" }, { status: 400 })
    }

    // Find existing answer
    const existingAnswer = await prisma.userAnswer.findFirst({
      where: { userExamId: userExam.id, questionId },
    })

    let saved
    if (existingAnswer) {
      // Update if exists
      saved = await prisma.userAnswer.update({
        where: { id: existingAnswer.id },
        data: { answer },
      })
    } else {
      // Create if not exists
      saved = await prisma.userAnswer.create({
        data: { userExamId: userExam.id, questionId, answer },
      })
    }

    return NextResponse.json({ success: true, answer: saved })
  } catch (err) {
    console.error("Error saving answer:", err)
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 })
  }
}
