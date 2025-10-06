// app/api/admin/examadd/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
type QuestionInput = {
  text: string
  description?: string
  textImageUrl?: string
  descriptionImageUrl?: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correct: "A" | "B" | "C" | "D"
}

type TopicInput = {
  name: string
  questions: QuestionInput[]
}
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      name,
      description,
      startDate,
      endDate,
      duration,
      numberOfQuestions,
      status,
      price,
      topics, // array of topics with questions
    } = body

    if (!name || !duration || !numberOfQuestions) {
      return NextResponse.json(
        { error: "نام، مدت زمان و تعداد سوالات الزامی هستند." },
        { status: 400 }
      )
    }

    // First, create the exam without questions
    const exam = await prisma.exam.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        duration,
        numberOfQuestions,
        status,
        price: price ?? null,
      },
    })

    // Then, create the questions linked to exam
    if (topics && topics.length > 0) {
const questionsToCreate = (topics as TopicInput[]).flatMap(topic =>
  topic.questions.map(q => ({
    text: q.text,
    textImageUrl: q.textImageUrl ?? null,
    description: q.description ?? "",
    descriptionImageUrl: q.descriptionImageUrl ?? null,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correct: q.correct,
    topic: topic.name,
    examId: exam.id,
  }))
)


      if (questionsToCreate.length > 0) {
        await prisma.question.createMany({
          data: questionsToCreate,
        })
      }
    }

    // Fetch the exam with questions to return
    const examWithQuestions = await prisma.exam.findUnique({
      where: { id: exam.id },
      include: { questions: true },
    })

    return NextResponse.json(examWithQuestions, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating exam:", error)
    return NextResponse.json({ error: "خطا در ایجاد آزمون" }, { status: 500 })
  }
}
