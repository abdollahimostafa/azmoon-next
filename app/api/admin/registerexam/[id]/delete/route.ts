import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { examId: string } }) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId missing" }, { status: 400 })
  }

  await prisma.userExam.deleteMany({
    where: { examId: params.examId, userId },
  })

  return NextResponse.json({ success: true })
}
