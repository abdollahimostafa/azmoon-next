import {  NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'
type UserAnswer = {
  questionId: string
  answer: string
}

type ExamQuestion = {
  id: string
  text: string
  options: string[]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any
) {
      const { params } = context

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const examId = params.id

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
        include: { questions: true }, // ✅ fetch related questions
    })

    if (!exam || !exam.questions) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 })
    }

    const userExam = await prisma.userExam.findFirst({
      where: {
        examId,
        userId: session.user.id,
      },
        include: { answers: true }, // ✅ include answers
    })

    const answersMap: Record<string, string> = {}
    if (userExam?.answers) {
      try {
const parsed = userExam.answers as UserAnswer[]
for (const a of parsed) {
  answersMap[a.questionId] = a.answer
}
      } catch (err) {
        console.error('Failed to parse previous answers', err)
      }
    }

const formattedQuestions: ExamQuestion[] = exam.questions.map(q => ({
  id: q.id,
  text: q.text,
  options: [q.optionA, q.optionB, q.optionC, q.optionD],
}))


    return NextResponse.json({
      questions: formattedQuestions,
      answers: answersMap,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
