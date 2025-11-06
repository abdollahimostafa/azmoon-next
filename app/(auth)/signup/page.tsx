'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)

  const normalizeNumbers = (input: string) => {
    return input.replace(/[۰-۹]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 1728)
    )
  }

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    melliCode: '',
    phoneNumber: '',
    mdStatus: 'intern',
    code: '',
  })

  const { status } = useSession()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-center py-10">در حال بررسی ورود...</div>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSendCode = async () => {
    if (!form.phoneNumber) {
      toast.error('لطفا شماره موبایل را وارد کنید')
      return
    }

    const normalizedPhone = normalizeNumbers(form.phoneNumber)

    setLoading(true)
    const res = await fetch('/api/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone: normalizedPhone }),
      headers: { 'Content-Type': 'application/json' },
    })
    setLoading(false)

    if (res.ok) {
      toast.success('کد تأیید ارسال شد', { className: 'ggfont' })
      setStep(2)
    } else {
      toast.error('ارسال کد تأیید با خطا مواجه شد', { className: 'ggcolorerror' })
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    const normalizedPhone = normalizeNumbers(form.phoneNumber)
    const normalizedMelli = normalizeNumbers(form.melliCode)
    const normalizedCode = normalizeNumbers(form.code)

    const result = await signIn('credentials', {
      redirect: false,
      firstName: form.firstName,
      lastName: form.lastName,
      melliCode: normalizedMelli,
      phoneNumber: normalizedPhone,
      mdStatus: form.mdStatus,
      code: normalizedCode,
    })

    if (result?.ok) {
      toast.success('ثبت‌نام با موفقیت انجام شد', { className: 'ggfont' })
      router.push('/dashboard')
    } else {
      setLoading(false)
      toast.error('کد وارد شده صحیح نیست یا اطلاعات نادرست است', { className: 'ggfont' })
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50">
      {/* ✅ Fullscreen Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40">
          <svg
            className="w-12 h-12 animate-spin text-white mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-white text-lg">در حال پردازش، لطفاً صبر کنید...</p>
        </div>
      )}

      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-center">
            {step === 1 ? 'ثبت‌نام کاربر' : 'تأیید شماره موبایل'}
          </h2>

          {step === 1 && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendCode()
              }}
            >
              <div>
                <Label className="mb-1">نام</Label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} />
              </div>

              <div>
                <Label className="mb-1">نام خانوادگی</Label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} />
              </div>

              <div>
                <Label className="mb-1">کد ملی</Label>
                <Input name="melliCode" value={form.melliCode} onChange={handleChange} />
              </div>

              <div>
                <Label className="mb-1">شماره موبایل</Label>
                <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
              </div>

              <div>
                <Label className="mb-2">وضعیت تحصیلی</Label>
                <RadioGroup
                  defaultValue="intern"
                  onValueChange={(value) => setForm({ ...form, mdStatus: value })}
                  className="space-x-2 text-right items-end justify-end flex"
                >
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="r1">اینترن</Label>
                    <RadioGroupItem value="intern" id="r1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="r2">فارغ‌التحصیل</Label>
                    <RadioGroupItem value="graduate" id="r2" />
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                ارسال کد تأیید
              </Button>
            </form>
          )}

          {step === 2 && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleVerify()
              }}
            >
              <div className="space-y-2 text-center justify-center align-middle mx-auto w-fit" dir="ltr">
                <Label className="block text-sm font-medium text-center mb-5">
                  کد تأیید پیامک شده را وارد کنید
                </Label>
                <InputOTP
                  maxLength={6}
                  value={form.code}
                  onChange={(value) => setForm({ ...form, code: value })}
                  className="flex justify-center ltr mb-4"
                  dir="ltr"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                ثبت‌نام نهایی
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
