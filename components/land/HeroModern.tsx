"use client"

import {
  UserCheck2Icon,
  UserCircle,
  BookOpenCheckIcon,
  BrainIcon,
  TimerIcon,
  MessageCircle,
  Instagram,
  Phone,
} from "lucide-react"
import Image from "next/image"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Section } from "@/components/ui/section"
import { MarqueeDemo } from "@/components/land/maraq"

interface HeroButtonProps {
  href: string
  text: string
  icon?: ReactNode
  iconRight?: ReactNode
}

interface HeroProps {
  title?: string
  description?: string
  banner?: ReactNode | false
  mockup?: ReactNode | false
  badge?: ReactNode | false
  buttons?: HeroButtonProps[] | false
  className?: string
}

export default function HeroModern({
  title = "آزمون آنلاین و آماده‌سازی برای آزمون دستیاری",
  description = "از همین امروز برای آزمون دستیاری آماده شو! آزمون های هوشمند و شباهت بالا با اساتید توانمند ماد!",
  banner = (
    <a
      href="/signin"
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer -mt-5 mb-8 block rounded-xl bg-gradient-to-r from-green-800 to-green-500 p-4 text-center text-white shadow-lg backdrop-blur-md hover:scale-[1.02] transition-transform duration-300"
    >
      🎉 تهیه پکیج تمامی آزمون های ماد با تخفیف ویژه!!
      <hr/>
       ورود به پنل کاربری
    </a>
  ),

  buttons = [
    {
      href: "/signin",
      text: "ورود",
      icon: <UserCheck2Icon className="ml-2 size-4" />,
    },
    {
      href: "/signup",
      text: "ثبت نام رایگان",
      icon: <UserCircle className="ml-2 size-4" />,
    },
  ],
  className,
}: HeroProps) {
  return (
    <div>
    <Section
      className={cn("relative overflow-hidden pb-0 sm:pb-0 md:pb-0", className)}
      dir="rtl"
      lang="fa"
    >
      
      {/* 🔳 Abstract background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(120,120,120,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(120,120,120,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-3 w-70 h-220 bg-green-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-3 w-70 h-220 bg-green-400/10 rounded-full blur-3xl" />

      </div>

      {/* 🌟 Main Hero */}
      <div className="relative z-10 max-w-container mx-auto flex flex-col gap-12 pt-2 sm:gap-24">
        
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
                    <Image
            src="/logo.png"
            alt="لوگوی ماد"
            width={240}
            height={240}
            className="animate-appear mb-4 "
          />

          {banner}

          <h1 className="animate-appear text-4xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            {title}
          </h1>

          <p className="text-md animate-appear text-muted-foreground max-w-[740px] sm:text-xl">
            {description}
          </p>

          {/* ✅ Logo */}

          {/* ✅ Buttons */}
          {buttons && (
            <div className="animate-appear flex justify-center gap-4">
              {buttons.map((button, i) => (
                <Button key={i} size="lg" asChild>
                  <a href={button.href}>
                    {button.icon}
                    {button.text}
                    {button.iconRight}
                  </a>
                </Button>
              ))}
            </div>
          )}

          {/* ✅ Mockup Image */}
          <Image
            src="/jj.jpg"
            alt="نمونه آزمون"
            width={800}
            height={600}
            className="w-full h-auto rounded-xl mt-10 shadow-lg"
          />
        </div>
      </div>

      {/* ✅ Feature Section */}
      <div className="relative z-10 max-w-container mx-auto py-20 mt-10">
        <h2 className="text-3xl font-bold text-center mb-12">چرا ماد؟</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-center">
<div className="p-6 rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <BookOpenCheckIcon className="mx-auto mb-4 size-10 text-green-600" />
            <h3 className="font-semibold text-lg">بانک جامع آزمون‌ها</h3>
            <p className="text-muted-foreground mt-2">
              دسترسی به صدها آزمون طبقه‌بندی‌شده برای تمرین و آمادگی کامل
            </p>
          </div>
<div className="p-6 rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
  <BrainIcon className="mx-auto mb-4 size-12 text-blue-600 drop-shadow-md" />
  <h3 className="font-semibold text-lg text-gray-900">تحلیل هوشمند</h3>
  <p className="text-muted-foreground mt-2 leading-relaxed">
    گزارش‌های دقیق از عملکرد و پیشنهادهای شخصی‌سازی‌شده
  </p>
</div>


<div className="p-6 rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <TimerIcon className="mx-auto mb-4 size-10 text-orange-600" />
            <h3 className="font-semibold text-lg">آزمون‌های زمان‌بندی‌شده</h3>
            <p className="text-muted-foreground mt-2">
              شبیه‌سازی شرایط واقعی آزمون برای مدیریت بهتر زمان
            </p>
          </div>
        </div>
      </div>
            <div className="text-center  max-w-2xl m-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          برنامه راهبردی
        </h2>
        <p className="mt-3 text-base md:text-lg text-muted-foreground">
          برنامه راهبردی و آزمون های منظم منطبق با آزمون دستیاری  
        </p>
      </div>
          <section className="relative py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-white to-gray-50">
            
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* 📌 Left side – Banner */}
        <div className="flex justify-center">
          <Image
            src="/tqa.jpg"
            alt="TQA Banner"
            width={400}
            height={900}
            className="rounded-2xl shadow-2xl border border-white/30 object-cover"
          />
        </div>

        {/* 📌 Right side – Timeline */}
        <div className="relative pl-6 border-l-2 border-blue-200 space-y-10">
          
          {/* Timeline item */}
          <div className="relative">
            <span className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-md"></span>
            <h3 className="text-xl font-semibold text-gray-900">
              تنوع بی‌نظیر
            </h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              مجموعه‌ای از آزمون‌ها با طیف گسترده سؤالات از رشته‌های مختلف پزشکی که تجربه‌ای
              مشابه و حتی فراتر از آزمون اصلی برای شما فراهم می‌کند.
            </p>
          </div>

          {/* Timeline item */}
          <div className="relative">
            <span className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-green-600 border-4 border-white shadow-md"></span>
            <h3 className="text-xl font-semibold text-gray-900">
              شباهت بالا با آزمون واقعی
            </h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              طراحی سؤالات و ساختار آزمون‌ها با الگوبرداری دقیق از آزمون دستیاری پزشکی، 
              تا در روز آزمون هیچ غافلگیری نداشته باشید.
            </p>
          </div>

          {/* Timeline item */}
          
          <div className="relative">
            <span className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-[#cae53e] border-4 border-white shadow-md"></span>
            <h3 className="text-xl font-semibold text-gray-900">
              تجربه یکپارچه
            </h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              رابط کاربری روان و محیط تمرینی مشابه آزمون رسمی که حس حضور در جلسه آزمون را برای شما شبیه‌سازی می‌کند.
            </p>
          </div>
        </div>
      </div>
    </section>
        <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* Banner Image */}


        {/* Text + CTA */}
        <div className="flex flex-col gap-6 text-center md:text-right">
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            🎉 تخفیف ویژه خرید همه آزمون‌ها
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            با این طرح می‌توانید تمامی آزمون‌های ماد را یکجا با قیمتی استثنایی خریداری کنید 
            و بدون نگرانی به همه دوره‌ها دسترسی داشته باشید.
          </p>
          
          <div className="flex justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-gradient-to-tr from-[#33afe2]   to-[#2889af] text-white font-bold shadow-lg rounded-xl"
              asChild
            >
              <a
                href="https://t.me/MAD_Residency"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="ml-2 size-5" />
کانال تلگرام              </a>
            </Button>
                 <Button
              size="lg"
              className="bg-gradient-to-tr from-pink-500  to-purple-600 text-white font-bold shadow-lg rounded-xl mr-2"
              asChild
            >
              <a
                href="https://www.instagram.com/MAD_Residency"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="ml-2 size-5" />
اینستاگرام              </a>
            </Button>
          </div>
                    <div className="flex justify-center md:justify-start">
                                 <Button
              size="lg"
              className="bg-gradient-to-tr from-[#25D366] to-[#128C7E]  text-white font-bold shadow-lg rounded-xl mr-2"
              asChild
            >
              <a
                href="https://wa.me/989217431568"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="ml-2 size-5" />
واتساپ              </a>
            </Button>
</div>
                  <Button
              size="lg"
              className="bg-gradient-to-tr from-[#0c1a11] to-[#262f2e]  text-white font-bold shadow-lg rounded-xl mr-2"
              asChild
            >
              <a
                href="/signup"
                target="_blank"
                rel="noopener noreferrer"
              >
همین حالا ثبت نام کنید!              </a>
            </Button>
        </div>

                <div className="flex justify-center">
          <Image
            src="/add.jpg"
            alt="تخفیف ویژه آزمون‌ها"
            width={500}
            height={500}
            className="rounded-2xl shadow-xl border border-white/30 object-cover"
          />
        </div>
      </div>
      
    </section>
        <MarqueeDemo/>
        


    </Section>
    <div className="text-center mt-10 max-w-2xl m-auto">
  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
    همراه شما در مسیر رزیدنتی هستیم !
  </h2>
  <p className="mt-3 text-base md:text-sm text-muted-foreground text-justify p-6">
    تیم آموزش دستیاری (ماد)، با هدف پاسخگویی به نیاز مبرم به آزمون‌های استاندارد در حوزه دستیاری، پا به عرصه فعالیت نهاد. این مجموعه با همکاری اساتید نام‌آشنا و با سابقه درخشان حوزه دستیاری، فعالیت تخصصی خود را در زمینه آزمون‌های دستیاری و پیش‌کارورزی آغاز نموده و تمرکز اصلی آن بر مشاوره تخصصی، آموزش هدفمند و برگزاری آزمون‌های آزمایشی استاندارد است
  </p>

  {/* Enamad image */}
  <div className="mt-6 flex justify-center">
    <Image
      src="/enamad.png"
      alt="نماد اعتماد الکترونیکی"
      className="w-32 h-auto"
      width={100}
      height={100}
    />

  </div>
</div>
      <footer className="w-full border-t border-gray-200 bg-gray-50 mt-16 text-center">
      <div className="bg-gray-50 max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
        
        {/* Copyright */}
        <p>
          © {new Date().getFullYear()} گروه آموزشی ماد. تمامی حقوق مادی و معنوی برای ماد محفوظ می باشد.
        </p>

        {/* Contact Info */}
        <a
          href="https://t.me/MAD_ADMIN_1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#219ed8] hover:text-blue-800"
        >
<Image  src="/teleg.png" className="w-7 h-7" alt="" width={100} height={100} />
          <span> پشتیبانی تلگرام</span>
        </a>
      </div>
    </footer>
    </div>
  )
}
