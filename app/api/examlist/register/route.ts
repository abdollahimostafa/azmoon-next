// app/api/examlist/register/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ZarinpalPayment from "zarinpal-pay"

const zarinpal = new ZarinpalPayment(process.env.ZARINPAL_MERCHANT_ID!, {
  isToman: true,
  isSandbox: false,
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { examId, discountCode } = await req.json()
    const userId = session.user.id

    if (!examId) {
      return NextResponse.json({ error: "Exam ID is required" }, { status: 400 })
    }

    // Fetch exam details
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    })
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    // Check if already registered
    const existing = await prisma.userExam.findFirst({
      where: { examId, userId },
    })
    if (existing) {
      return NextResponse.json({ message: "Already registered" }, { status: 200 })
    }

    // Determine overtime flag
    const isOvertime = exam.status === "closed"

    // Apply discount code if exists
    let finalAmount = exam.price
    let priceOffPercent = 0

    if (finalAmount === undefined || finalAmount === null) {
      return NextResponse.json({ error: "Exam price not found" }, { status: 500 })
    }

    if (discountCode) {
      const priceOff = await prisma.priceOff.findUnique({ where: { code: discountCode } })
      if (priceOff) {
        priceOffPercent = priceOff.amount
        finalAmount = Math.floor(finalAmount * (1 - priceOff.amount / 100))
        await prisma.priceOff.update({
          where: { code: discountCode },
          data: { usageCount: { increment: 1 } },
        })
      }
    }

    // ✅ If 100% discount, register directly without payment
    if (priceOffPercent === 100 || finalAmount === 0) {
      await prisma.userExam.create({
        data: { userId, examId, overtime: isOvertime },
      })

      return NextResponse.json({ message: "Successfully registered (free)" })
    }

    // Create payment request
    const createTransaction = await zarinpal.create({
      amount: finalAmount,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/examlist/verify?examId=${examId}`,
      description: `ثبت نام در آزمون: ${exam.name}`,
      order_id: examId,
      mobile: session.user.phoneNumber,
      email: "user@example.com", // optional
    })

    if (createTransaction?.code !== 100) {
      return NextResponse.json({ error: "خطا در ایجاد تراکنش" }, { status: 500 })
    }

    // Store pending transaction
    await prisma.payment.create({
      data: {
        userId,
        examId,
        authority: createTransaction.authority,
        amount: finalAmount,
        status: "pending",
        overtime: isOvertime,
        discountCode: discountCode || null,
      },
    })

    return NextResponse.json({ link: createTransaction.link })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "مشکل در روند خرید" }, { status: 500 })
  }
}
