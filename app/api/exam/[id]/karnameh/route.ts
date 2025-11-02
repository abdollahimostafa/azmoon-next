import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any) {
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

  // Count total participants
  const totalParticipants = await prisma.userExam.count({
    where: { examId },
  })

  // Fetch all participants with answers
  const allRegs = await prisma.userExam.findMany({
    where: { examId },
    include: { answers: true },
  })

  // ---- Rank Calculation (Total) ----
  const userPercentages: { userId: string; percentage: number }[] = []

  for (const reg of allRegs) {
    const totalQs = exam.questions.length
    const correct = reg.answers.filter((a) =>
      exam.questions.find((q) => q.id === a.questionId && q.correct === a.answer)
    ).length
    const percentage = totalQs > 0 ? (correct / totalQs) * 100 : 0
    userPercentages.push({ userId: reg.userId, percentage })
  }

  userPercentages.sort((a, b) => b.percentage - a.percentage)

  const userRank =
    userPercentages.findIndex((p) => p.userId === userId) + 1

  const userPercentage =
    userPercentages.find((p) => p.userId === userId)?.percentage ?? 0

  // ✅ Compute total تراز (standardized score)
  const percentagesArray = userPercentages.map((p) => p.percentage)
  const mean =
    percentagesArray.reduce((sum, val) => sum + val, 0) /
    percentagesArray.length
  const stdDev = Math.sqrt(
    percentagesArray.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      percentagesArray.length
  )
  const totalTaraz =
    stdDev > 0 ? Math.round(((userPercentage - mean) / stdDev) * 1000 + 6000) : 6000

  // ---- Topic Statistics & Per-topic Rank ----
  const topicStats: Record<
    string,
    { min: number; max: number; rank: number; percentage: number; taraz: number }
  > = {}

  // Group questions by topic
  const questionsByTopic: Record<string, typeof exam.questions> = {}
  for (const q of exam.questions) {
    if (!questionsByTopic[q.topic]) questionsByTopic[q.topic] = []
    questionsByTopic[q.topic].push(q)
  }

  for (const [topic, qs] of Object.entries(questionsByTopic)) {
    const topicPercentages: { userId: string; percentage: number }[] = []

    for (const reg of allRegs) {
      const userAnswers = reg.answers.filter((a) =>
        qs.some((q) => q.id === a.questionId)
      )
      const correctCount = userAnswers.filter((a) =>
        qs.find((q) => q.id === a.questionId && q.correct === a.answer)
      ).length
      const percentage = qs.length > 0 ? (correctCount / qs.length) * 100 : 0
      topicPercentages.push({ userId: reg.userId, percentage })
    }

    topicPercentages.sort((a, b) => b.percentage - a.percentage)
    const userTopicRank =
      topicPercentages.findIndex((p) => p.userId === userId) + 1
    const userTopicPercentage =
      topicPercentages.find((p) => p.userId === userId)?.percentage ?? 0

    // ✅ Compute per-topic تراز
    const tPercentages = topicPercentages.map((p) => p.percentage)
    const tMean =
      tPercentages.reduce((sum, val) => sum + val, 0) / tPercentages.length
    const tStdDev = Math.sqrt(
      tPercentages.reduce((sum, val) => sum + Math.pow(val - tMean, 2), 0) /
        tPercentages.length
    )
    const topicTaraz =
      tStdDev > 0
        ? Math.round(((userTopicPercentage - tMean) / tStdDev) * 1000 + 6000)
        : 6000

    topicStats[topic] = {
      min: Math.min(...topicPercentages.map((p) => p.percentage)),
      max: Math.max(...topicPercentages.map((p) => p.percentage)),
      rank: userTopicRank,
      percentage: userTopicPercentage,
      taraz: topicTaraz,
    }
  }

  // ---- Prepare Response ----
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
    return NextResponse.json(
      { error: "Registration not found after initialization" },
      { status: 500 }
    )
  }

  const userAnswers = reg.answers.map((a) => ({
    questionId: a.questionId,
    answer: a.answer,
  }))

  // ---- Response ----
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
      topicStats, // includes min, max, rank, percentage, taraz
      rank: userRank,
      percentage: userPercentage,
      taraz: totalTaraz, // ✅ total تراز
    },
  })
}
