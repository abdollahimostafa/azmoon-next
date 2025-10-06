import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ✅ GET → List all discount codes
export async function GET() {
  try {
    const codes = await prisma.priceOff.findMany()
    return NextResponse.json(codes)
  } catch (error) {
    console.error("Error fetching discount codes:", error)
    return NextResponse.json({ error: "Failed to fetch discount codes" }, { status: 500 })
  }
}

// ✅ POST → Create a new discount code
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, amount, maxUsage } = body

    if (!code || !amount) {
      return NextResponse.json({ error: "Code and amount are required" }, { status: 400 })
    }

    const newCode = await prisma.priceOff.create({
      data: {
        code,
        amount: Number(amount),
        maxUsage: maxUsage ? Number(maxUsage) : null,
      },
    })

    return NextResponse.json(newCode, { status: 201 })
  } catch (error) {
    console.error("Error creating discount code:", error)
    return NextResponse.json({ error: "Failed to create discount code" }, { status: 500 })
  }
}

// ✅ DELETE → Delete a discount code by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await prisma.priceOff.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting discount code:", error)
    return NextResponse.json({ error: "Failed to delete discount code" }, { status: 500 })
  }
}
