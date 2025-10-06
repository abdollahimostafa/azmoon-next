"use client"

import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CircleArrowDown } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Exam = {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  duration: number
  numberOfQuestions: number
  status: string
  price?: number
  isRegistered?: boolean
}

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [loadz, setLoadz] = useState(false)

  const [exams, setExams] = useState<Exam[]>([])
  const [discountCode, setDiscountCode] = useState("")
  const [discount, setDiscount] = useState<number>(0)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("/api/examlist")
        const data = await res.json()
        setExams(data.exams)
      } catch (err) {
        console.error("خطا در دریافت لیست آزمون‌ها", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

const handleCheckCode = async () => {
  if (!discountCode) {
    toast.error("لطفا کد تخفیف را وارد کنید", { className: 'ggfont' })
    return
  }

  try {
    const res = await fetch("/api/priceoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: discountCode }),
    })

    const data = await res.json()

    if (res.ok && data.valid) {
      setDiscount(data.amount)
      toast.success(`کد تخفیف اعمال شد: ${data.amount}%`, { className: 'ggfont' })
    } else {
      setDiscount(0)
      toast.error(data.error || "کد تخفیف معتبر نیست", { className: 'ggfont' })
    }
  } catch (err) {
    console.error("Error checking discount code:", err)
    toast.error("خطا در بررسی کد تخفیف", { className: 'ggfont' })
  }
}

const handleBuyAll = async (exam: Exam) => {
  setLoadz(true)
  try {
    const res = await fetch("/api/examlist/registerall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        examId: exam.id,
        discountCode: discountCode || null
      }),
    })
    const data = await res.json()
    console.log(data)
    if (res.ok) {
      if (data.message === "Successfully registered (free)") {
        toast.success("ثبت‌نام تمامی آزمون‌ها با موفقیت انجام شد 🎉", { className: "ggfont" })
        setExams(prev => prev.map(ex => ({ ...ex, isRegistered: true })))
      } else if (data.link) {
        window.location.href = data.link
      } else if (data.message=="All exams already registered") {
        toast.error("قبلا خریداری شده", { className: "ggfont" })
      } else {
        toast.error("خطا در ایجاد لینک پرداخت", { className: "ggfont" })
      }
    } else {
      toast.error(data?.error || "خطا در ثبت آزمون‌ها", { className: "ggfont" })
    }
  } catch (err) {
    console.error("خطا در خرید", err)
    toast.error("خطا در ارتباط با سرور", { className: "ggfont" })
  } finally {
    setLoadz(false)
  }
}



const handleBuy = async () => {
  if (!selectedExam) return
  setLoadz(true)

  try {
    const res = await fetch("/api/examlist/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        examId: selectedExam.id, 
        discountCode: discountCode || null
      }),
    })

    const data = await res.json()

    if (res.ok) {
      // ✅ Free registration
      if (data.message?.includes("free")) {
        toast.success("ثبت‌نام شما با موفقیت انجام شد 🎉", { className: "ggfont" })
        setExams(prev =>
          prev.map(ex => 
            ex.id === selectedExam.id ? { ...ex, isRegistered: true } : ex
          )
        )
      } else if (data.link) {
        // Redirect to Zarinpal payment
        window.location.href = data.link
      } else {
        toast.error("خطا در ایجاد لینک پرداخت", { className: "ggfont" })
      }
    } else {
      toast.error(data?.error || "خطا در ثبت آزمون", { className: "ggfont" })
    }
  } catch (err) {
    console.error("خطا در خرید", err)
    toast.error("خطا در ارتباط با سرور", { className: "ggfont" })
  } finally {
    setLoadz(false)
  }
}



  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  آزمون‌های قابل ثبت‌نام
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
<div className="mt-6">
  <Drawer>
    <DrawerTrigger asChild>
      <Button className="w-full rounded-xl bg-gradient-to-r from-green-800 to-green-500 p-4 text-white font-bold shadow-lg hover:scale-[1.02] transition-transform duration-300">
        🎉 تهیه پکیج تمامی آزمون‌های ماد با تخفیف ویژه
      </Button>
    </DrawerTrigger>
                                {loadz ? (
                                                                    <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>پکیج طلایی مآد</DrawerTitle>
                              <p className="text-muted-foreground">
                                درحال انتقال به درگاه پرداخت...
                              </p>
                            </DrawerHeader>

     <DrawerFooter className="text-center">
                            <p>تا لحظاتی دیگر به صفحه درگاه پرداخت منتقل خواهید شد</p>
                                                        <p className="text-sm text-gray-500">گروه آموزشی ماد دارای نماد الکترونیک می باشد</p>

                            </DrawerFooter>

                          </DrawerContent>

                                ):( <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>پکیج دسترسی کامل به تمامی آزمون‌ها</DrawerTitle>
        <p className="text-muted-foreground mt-1">
          دسترسی به تمام سوالات و آزمون‌ها، گذشته و آینده سال جاری
        </p>
      </DrawerHeader>

      <div className="p-4 space-y-4">
        <ul className="list-disc list-inside space-y-2">
          <li>دسترسی به تمامی سوالات آزمون‌ها</li>
          <li>آزمون‌های گذشته و آینده سال جاری</li>
          <li>سوالات - پاسخ نامه - کارنامه حرفه ای و تحلیل سوالات</li>
          <li>پشتیبانی ویژه و به‌روز رسانی محتوا</li>
        </ul>

        {/* Price display */}
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="line-through text-gray-400 text-center">
            4,600,000 تومان
          </span>
          <span className="text-green-600">
            {discount
              ? ((3900000 * (100 - discount)) / 100).toLocaleString("fa-IR")
              : "3,900,000"} تومان
          </span>
        </div>

        {/* Discount code */}
        <div className="space-y-2">
          <Input
            placeholder="کد تخفیف"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCheckCode}
          >
            بررسی کد تخفیف
          </Button>
        </div>
      </div>

      <DrawerFooter>
 <Button
  className="w-full"
  onClick={() => {
    const exam = {
      id: "all-exams",
      name: "پکیج تمامی آزمون‌ها",
      description: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      duration: 0,
      numberOfQuestions: 0,
      status: "active",
      price: 3900000,
      isRegistered: false,
    }
    setSelectedExam(exam)
    handleBuyAll(exam)
  }}
  disabled={loadz}
>
  خرید پکیج
</Button>

      </DrawerFooter>
    </DrawerContent>)}

  </Drawer>
</div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min mt-2">
          <div className="bg-muted/50 aspect-video rounded-xl p-4 flex flex-col border-2">
            <h2 className="text-xl font-semibold mb-1">لیست آزمون‌های قابل خرید</h2>
            <h2 className="text-sm font-light mb-10">
              در لیست زیر تمامی آزمون‌های فعال جهت مشارکت و پاسخگویی آنلاین و افلاین شما قرار گرفته است...
            </h2>
            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : (
              <Accordion type="single" className="space-y-4" collapsible>
                {exams.map((exam) => (
                  <AccordionItem
                    key={exam.id}
                    value={exam.id}
                    className="bg-white/80 p-3 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 ease-in-out"
                  >
                    <AccordionTrigger className="font-bold bgpat pr-3 pl-3">
                      <div className="flex">
                        <CircleArrowDown className="ml-3 w-4 -mt-1" />
                        {exam.name}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-4 space-y-4 text-sm leading-6">
                      <p className="text-muted-foreground">{exam.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="font-medium">تاریخ و زمان شروع:</span>
                          <span>
                            {new Date(exam.startDate).toLocaleString("fa-IR")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="font-medium">مدت زمان:</span>
                          <span>{exam.duration} دقیقه</span>
                        </div>
                        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="font-medium">تعداد سوالات:</span>
                          <span>{exam.numberOfQuestions}</span>
                        </div>
                        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="font-medium">وضعیت:</span>
                          <span>{exam.status}</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button
                              disabled={
                                exam.isRegistered
                              }
                              className="w-full"
                              onClick={() => setSelectedExam(exam)}
                            >
                              {exam.isRegistered
                                ? "ثبت‌نام شده"
                                : exam.status === "closed" 
                                ?"پایان یافته (خرید سوالات و آزمون تمرینی)"
                                : "ثبت نام / خرید"}
                            </Button>
                          </DrawerTrigger>
                                {loadz ? (
                                  <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>{exam.name}</DrawerTitle>
                              <p className="text-muted-foreground">
                                درحال انتقال به درگاه پرداخت...
                              </p>
                            </DrawerHeader>

     <DrawerFooter className="text-center">
                            <p>تا لحظاتی دیگر به صفحه درگاه پرداخت منتقل خواهید شد</p>
                                                        <p className="text-sm text-gray-500">گروه آموزشی ماد دارای نماد الکترونیک می باشد</p>

                            </DrawerFooter>

                          </DrawerContent>
            ) : (      
<DrawerContent>
  <DrawerHeader>
    <DrawerTitle>{selectedExam?.name}</DrawerTitle>
    <p className="text-muted-foreground">
      قیمت آزمون:{" "}
      {selectedExam?.price
        ? (
            selectedExam.price - (selectedExam.price * discount) / 100
          ).toLocaleString("fa-IR")
        : "رایگان"}{" "}
      تومان
    </p>
  </DrawerHeader>

  <div className="p-4 space-y-3">
    {selectedExam?.price && selectedExam.price > 0 ? (
      <>
        <Input
          placeholder="کد تخفیف"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <Button variant="outline" className="w-full" onClick={handleCheckCode}>
          بررسی کد تخفیف
        </Button>

        <div className="text-center font-bold">
          مبلغ نهایی:{" "}
          {(selectedExam.price - (selectedExam.price * discount) / 100).toLocaleString("fa-IR")} تومان
        </div>
      </>
    ) : (
      <div className="text-center font-bold text-green-600">
        این آزمون رایگان است و ثبت‌نام شما بدون پرداخت انجام خواهد شد 🎉
      </div>
    )}
  </div>

  <DrawerFooter>
    <Button onClick={handleBuy} className="w-full">
      {selectedExam?.price && selectedExam.price > 0 ? "خرید و ثبت‌نام" : "ثبت‌نام رایگان"}
    </Button>
  </DrawerFooter>
</DrawerContent>
)
            }
                        </Drawer>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
