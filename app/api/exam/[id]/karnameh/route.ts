import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any
  ) {
    const { params } = context
  const examId = params.id

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!examId) {
    return NextResponse.json({ error: "Missing exam ID" }, { status: 400 })
  }

  const userId = session.user.id

  // Check registration
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

  // Fetch exam with questions
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true },
  })

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 })
  }

  // Initialize answers if needed
if (registration!.answers.length === 0) {
  const answerData = exam.questions.map((q) => ({
    userExamId: registration!.id,
    questionId: q.id,
    answer: "X",
  }))
  await prisma.userAnswer.createMany({ data: answerData })

  registration = await prisma.userExam.findUnique({
    where: { id: registration!.id },
    include: { answers: true },
  })!
}


  // Count total participants in this exam
  const totalParticipants = await prisma.userExam.count({
    where: { examId },
  })

  // Calculate per-topic min/max percentages
  const allRegs = await prisma.userExam.findMany({
    where: { examId },
    include: { answers: true },
  })

  const topicStats: Record<
    string,
    { min: number; max: number }
  > = {}

  // group questions by topic
  const questionsByTopic: Record<string, typeof exam.questions> = {}
  for (const q of exam.questions) {
    if (!questionsByTopic[q.topic]) questionsByTopic[q.topic] = []
    questionsByTopic[q.topic].push(q)
  }

  for (const [topic, qs] of Object.entries(questionsByTopic)) {
    const percentages: number[] = []

    for (const reg of allRegs) {
      const userAnswers = reg.answers.filter((a) =>
        qs.some((q) => q.id === a.questionId)
      )
      const correctCount = userAnswers.filter((a) =>
        qs.find((q) => q.id === a.questionId && q.correct === a.answer)
      ).length
      const percentage =
        qs.length > 0 ? (correctCount / qs.length) * 100 : 0
      percentages.push(percentage)
    }

    topicStats[topic] = {
      min: Math.min(...percentages),
      max: Math.max(...percentages),
    }
  }

  // Map questions
  const questions = exam.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: [q.optionA, q.optionB, q.optionC, q.optionD],
    correct: q.correct,
    topic: q.topic,
    description: q.description,
  }))
  const reg = registration
if (!reg) {
  return NextResponse.json({ error: "Registration not found after initialization" }, { status: 500 })
}

  const userAnswers = reg.answers.map((a) => ({
    questionId: a.questionId,
    answer: a.answer,
  }))

  return NextResponse.json({
    exam: {
      id: exam.id,
      name: exam.name,
      duration: exam.duration,
      questions,
      startedAt: reg.startedAt,
      userAnswers,
      date: exam.startDate,
      totalParticipants,
      topicStats, // { "topicName": { min: x, max: y } }
    },
  })
}
