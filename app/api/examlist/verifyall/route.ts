// app/api/examlist/verifyall/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import ZarinpalPayment from "zarinpal-pay"

const zarinpal = new ZarinpalPayment(process.env.ZARINPAL_MERCHANT_ID!, {
  isToman: true,
  isSandbox: false,
})

export async function GET(req: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL not defined")

    const { searchParams } = new URL(req.url)
    const authority = searchParams.get("Authority")
    const status = searchParams.get("Status")
    const examId = searchParams.get("examId")

    if (!authority || !examId) {
      return NextResponse.redirect(`${baseUrl}/dashboard/verif?status=failed`)
    }

    if (status === "NOK") {
      await prisma.payment.updateMany({
        where: { authority },
        data: { status: "failed" },
      })
      return NextResponse.redirect(`${baseUrl}/dashboard/verif?status=failed`)
    }

const payments = await prisma.payment.findMany({ where: { authority, status: "pending" } })
if (!payments.length) {
  return NextResponse.redirect(`${baseUrl}/dashboard/verif?status=failed`)
}

// Verify transaction once
const verifyTransaction = await zarinpal.verify({
  authority,
  amount: payments[0].amount, // amount is same for package
})

if (verifyTransaction?.code !== 100 && verifyTransaction?.code !== 101) {
  // mark all as failed
  await prisma.payment.updateMany({
    where: { authority },
    data: { status: "failed" },
  })
  return NextResponse.redirect(`${baseUrl}/dashboard/verif?status=failed`)
}

// mark all as success and create userExam for each
for (const payment of payments) {
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "success", refId: verifyTransaction.ref_id?.toString() },
  })

  const existingUserExam = await prisma.userExam.findFirst({
    where: { userId: payment.userId, examId: payment.examId },
  })

  if (!existingUserExam) {
    await prisma.userExam.create({
      data: { userId: payment.userId, examId: payment.examId, overtime: payment.overtime} // 🔥 preserve overtime flag },
    })
  }
}

return NextResponse.redirect(
  `${baseUrl}/dashboard/verif?status=success&refId=${verifyTransaction.ref_id?.toString()}`
)
    
  } catch (error) {
    console.error("Error verifying payment:", error)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    return NextResponse.redirect(`${baseUrl}/dashboard/verif?status=failed`)
  }
}
