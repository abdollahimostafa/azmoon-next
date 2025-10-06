import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type QuestionBody = {
  text: string
  options: string[]
  correct: string
  description: string
  textImageUrl?: string
  descriptionImageUrl?: string

}

type TopicBody = {
  name: string
  questions: QuestionBody[]
}

type ExamBody = {
  name: string
  description: string
  startDate: string | null
  endDate: string | null
  duration: number
  numberOfQuestions: number
  status: string
  price?: number
  topics: TopicBody[]
}

// --- GET Exam ---
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { questions: true },
    })

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    return NextResponse.json(exam)
  } catch (err) {
    console.error("Error fetching exam:", err)
    return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 })
  }
}

// --- POST Update Exam ---
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: examId } = await context.params

  try {
    const body: ExamBody = await req.json()
    const { name, description, startDate, endDate, duration, numberOfQuestions, status, price, topics } = body

    // --- Prepare questions data ---
    const questionsData = topics.flatMap((topic: TopicBody) =>
      topic.questions.map((q: QuestionBody) => ({
        examId, 
        topic: topic.name,
        text: q.text,
        optionA: q.options[0] ?? "",
        optionB: q.options[1] ?? "",
        optionC: q.options[2] ?? "",
        optionD: q.options[3] ?? "",
        correct: q.correct,
        description: q.description,
        textImageUrl: q.textImageUrl ?? null,
        descriptionImageUrl: q.descriptionImageUrl ?? null,
      }))
    )

    // --- Delete old user answers & questions ---
    await prisma.userAnswer.deleteMany({
      where: {
        question: { examId },
      },
    })

    await prisma.question.deleteMany({
      where: { examId },
    })

    // --- Update exam metadata ---
    await prisma.exam.update({
      where: { id: examId },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        duration,
        numberOfQuestions,
        status,
        price,
      },
    })

    // --- Insert new questions ---
    if (questionsData.length > 0) {
      await prisma.question.createMany({ data: questionsData })
    }

    return NextResponse.json({ message: "Exam updated successfully" })
  } catch (err) {
    console.error("Error updating exam:", err)
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 })
  }
}
