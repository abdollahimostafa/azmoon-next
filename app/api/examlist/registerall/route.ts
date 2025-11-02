import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ZarinpalPayment from "zarinpal-pay"

const PACKAGE_PRICE = 3900000 // 3.9 million Toman

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
    const { discountCode } = await req.json()
    const userId = session.user.id

    // Fetch all exams
    const exams = await prisma.exam.findMany()
    if (!exams.length)
      return NextResponse.json({ error: "No exams available", status: 404 })

    // Filter unregistered exams
    const unregisteredExams = []
    for (const exam of exams) {
      const existing = await prisma.userExam.findFirst({
        where: { examId: exam.id, userId },
      })
      if (!existing) unregisteredExams.push(exam)
    }

    if (!unregisteredExams.length) {
      return NextResponse.json({ message: "All exams already registered" })
    }

    // Apply discount if exists
    let finalAmount = PACKAGE_PRICE
    let priceOffPercent = 0

    if (discountCode) {
      const priceOff = await prisma.priceOff.findUnique({
        where: { code: discountCode },
      })

      if (priceOff) {
        // ✅ Check suffix rule
        const isPackageCode = discountCode.endsWith("oox")
        if (!isPackageCode) {
          return NextResponse.json(
            {
              error:
                "این کد تخفیف مخصوص آزمون‌های تکی است و برای بسته قابل استفاده نیست.",
            },
            { status: 400 }
          )
        }

        priceOffPercent = priceOff.amount
        finalAmount = Math.floor(PACKAGE_PRICE * (1 - priceOff.amount / 100))

        await prisma.priceOff.update({
          where: { code: discountCode },
          data: { usageCount: { increment: 1 } },
        })
      } else {
        return NextResponse.json(
          { error: "کد تخفیف نامعتبر است." },
          { status: 400 }
        )
      }
    }

    // Free registration
    if (priceOffPercent === 100 || finalAmount === 0) {
      for (const exam of unregisteredExams) {
        await prisma.userExam.create({
          data: {
            userId,
            examId: exam.id,
            overtime: exam.status !== "closed",
          },
        })
      }
      return NextResponse.json({ message: "Successfully registered (free)" })
    }

    // Payment required
    const createTransaction = await zarinpal.create({
      amount: finalAmount,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/examlist/verifyall?examId=all-exams`,
      description: `ثبت نام بسته تمامی آزمون‌ها`,
      order_id: "all-exams",
      mobile: session.user.phoneNumber,
      email: "user@example.com",
    })

    if (createTransaction?.code !== 100) {
      return NextResponse.json({ error: "خطا در ایجاد تراکنش" }, { status: 500 })
    }

    // Store pending payments
    for (const exam of unregisteredExams) {
      await prisma.payment.create({
        data: {
          userId,
          examId: exam.id,
          authority: createTransaction.authority,
          amount: finalAmount,
          status: "pending",
          overtime: exam.status !== "closed",
          discountCode: discountCode || null,
        },
      })
    }

    return NextResponse.json({ link: createTransaction.link })
  } catch (err) {
    console.error("Error registering all exams:", err)
    return NextResponse.json({ error: "مشکل در ثبت‌نام همزمان" }, { status: 500 })
  }
}
