import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = session.user.id

  // Total number of exams the user has registered
  const totalExams = await prisma.userExam.count({
    where: { userId },
  })

  // Fetch all answers by the user including related questions
  const userAnswers = await prisma.userAnswer.findMany({
    where: {
      userExam: {
        userId,
      },
    },
    include: {
      question: true,
    },
  })

const totalQuestions = userAnswers.length

// Calculate correct and wrong answers
let correctAnswers = 0
userAnswers.forEach((ua) => {
  if (ua.answer === ua.question.correct) correctAnswers++
})

const wrongAnswers = totalQuestions - correctAnswers

return NextResponse.json({
  totalQuestions,
  totalExams,
  correctAnswers,
  wrongAnswers,
})
}
