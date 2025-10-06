import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any) {
      const { params } = context

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const examId = params.id
  if (!examId) {
    return NextResponse.json({ error: "Missing exam ID" }, { status: 400 })
  }

  const userId = session.user.id

  // Check if user is registered for this exam
  let registration = await prisma.userExam.findFirst({
    where: { userId, examId },
    include: { answers: true },
  })

  if (!registration) {
    return NextResponse.json(
      { error: "Not registered for this exam" },
      { status: 403 }
    )
  }

  // If first time, set startedAt
  if (!registration.startedAt) {
    registration = await prisma.userExam.update({
      where: { id: registration.id },
      data: { startedAt: new Date() },
      include: { answers: true },
    })
  }

  // Fetch exam with questions directly
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true },
  })

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 })
  }
const reg = registration
if (!reg) {
  return NextResponse.json({ error: "Registration not found after initialization" }, { status: 500 })
}

  // Initialize answers to "نمیدانم" if none exist
  if (registration.answers.length === 0) {
    const answerData = exam.questions.map((q) => ({
      userExamId: reg.id,
      questionId: q.id,
      answer: "X",
    }))

    await prisma.userAnswer.createMany({ data: answerData })

    // Refresh registration with the newly created answers
    registration = await prisma.userExam.findUnique({
      where: { id: registration.id },
      include: { answers: true },
    }) as typeof registration
  }

  // Map questions
  const questions = exam.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: [q.optionA, q.optionB, q.optionC, q.optionD],
    correct: q.correct,
    topic: q.topic,
    description: q.description
  }))

  const userAnswers = registration.answers.map((a) => ({
    questionId: a.questionId,
    answer: a.answer,
  }))

  return NextResponse.json({
    exam: {
      id: exam.id,
      name: exam.name,
      duration: exam.duration,
      questions,
      startedAt: registration.startedAt,
      userAnswers,
      dater: exam.startDate

    },
  })
}
