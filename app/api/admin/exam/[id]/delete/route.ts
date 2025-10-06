import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.exam.delete({
      where: { id },
    })

    return NextResponse.json({ message: "آزمون حذف شد" })
  } catch (error) {
    console.error("Error deleting exam:", error)
    return NextResponse.json({ error: "خطا در حذف آزمون" }, { status: 500 })
  }
}
