import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params must be awaited
) {
  const { id: examId } = await context.params

  try {
    // 1️⃣ Fetch all UserExam entries for this exam
    const userExams = await prisma.userExam.findMany({
      where: { examId },
      include: { answers: { include: { question: true } } },
    })

    // 2️⃣ Compute score for each user
    for (const userExam of userExams) {
      const totalQuestions = userExam.answers.length
      if (totalQuestions === 0) continue // skip users with no answers

      const correctCount = userExam.answers.filter(
        (ua) => ua.answer === ua.question.correct
      ).length

      const percentage = (correctCount / totalQuestions) * 100

      // 3️⃣ Create score record
    await prisma.examScore.create({
        data: {
          examId,
          userId: userExam.userId,
          score: correctCount,
          percentage,
        },
      })
    }
    // 4️⃣ Close the exam
    const exam = await prisma.exam.update({
      where: { id: examId },
      data: { status: "closed" },
    })

    return NextResponse.json({ success: true, exam })
  } catch (err) {
    console.error("Error closing exam:", err)
    return NextResponse.json(
      { error: "خطا در بستن آزمون یا محاسبه نمرات" },
      { status: 500 }
    )
  }
}
