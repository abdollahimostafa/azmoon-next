import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 })

    const priceOff = await prisma.priceOff.findUnique({
      where: { code },
    })

    if (!priceOff) {
      return NextResponse.json({ valid: false, error: "کد تخفیف معتبر نیست" })
    }

    if (priceOff.maxUsage && priceOff.usageCount >= priceOff.maxUsage) {
      return NextResponse.json({ valid: false, error: "کد تخفیف دیگر قابل استفاده نیست" })
    }

    return NextResponse.json({ valid: true, amount: priceOff.amount })
  } catch (err) {
    console.error("Error checking price code:", err)
    return NextResponse.json({ error: "خطا در بررسی کد تخفیف" }, { status: 500 })
  }
}
