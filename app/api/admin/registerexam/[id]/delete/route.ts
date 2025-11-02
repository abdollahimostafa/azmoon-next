// app/api/admin/registerexam/[id]/delete/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    const examId = id


  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId missing" }, { status: 400 });
    }

    if (!examId) {
      return NextResponse.json({ error: "examId missing" }, { status: 400 });
    }

    // Delete the user's registration for this exam
    await prisma.userExam.deleteMany({
      where: {
        examId,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting userExam:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
