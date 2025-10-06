import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendSMSCode } from '@/lib/sms'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { phone } = await req.json()
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

  const code = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    // Save code entry only
    await prisma.code.create({
      data: {
        phone,
        code,
        used: false,
        createdAt: new Date(),
      },
    })

    // Send SMS
    await sendSMSCode(phone, code)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('SMS send error:', err)
    return NextResponse.json({ error: 'SMS failed' }, { status: 500 })
  }
}
