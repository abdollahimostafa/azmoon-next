import { prisma } from "@/lib/prisma"
import {  NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
    const examId = id
    try {
    // Fetch users registered for this exam
    const registrations = await prisma.userExam.findMany({
      where: { examId },
      include: {
        user: {
          select: {
            id: true,         
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    })

    return NextResponse.json({ registrations })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
