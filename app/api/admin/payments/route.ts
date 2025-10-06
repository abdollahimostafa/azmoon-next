// app/api/admin/payments/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, phoneNumber: true } },
        exam: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ payments })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
