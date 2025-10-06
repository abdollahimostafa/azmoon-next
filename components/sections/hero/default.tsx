import { ArrowLeftIcon, UserCheck2Icon, UserCircle } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../../ui/button";
import Glow from "../../ui/glow";
import { Mockup, MockupFrame } from "../../ui/mockup";
import { Section } from "../../ui/section";
import { Badge } from "@/components/ui/badge";

interface HeroButtonProps {
  href: string;
  text: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface HeroProps {
  title?: string;
  description?: string;
  mockup?: ReactNode | false;
  badge?: ReactNode | false;
  buttons?: HeroButtonProps[] | false;
  className?: string;
}

export default function Hero({
  title = " اینترنیست, پاسخ به سوالات شما براساس منابع پزشکی",
  description = "اینترنیست یک هوش مصنوعی اختصاصی برای پاسخ به سوالات شما براساس منابع معتبر پزشکی است",
mockup = (
  <Image
    src="/app-light.jpg"
    alt="test image"
    width={800}
    height={600}
    className="w-full h-auto"
  />
),
  badge = (
    <Badge variant="outline" className="animate-appear">
      <span className="text-muted-foreground">
        نسخه جدید اینترنیست منتشر شد!
      </span>
      <a
        href="/signup"
        className="flex items-center gap-1"
      >
        شروع کن
        <ArrowLeftIcon className="size-3" />
      </a>
    </Badge>
  ),
  buttons = [
    {
      href: "/signin",
      text: "ورود",
            icon: <UserCheck2Icon className="ml-2 size-4" />,

    },
    {
      href: "/signup",
      text: "ثبت نام",
      icon: <UserCircle className="ml-2 size-4" />,
    },
  ],
  className,
}: HeroProps) {
  return (
    <Section
      className={cn(
        "relative overflow-hidden pb-0 sm:pb-0 md:pb-0",
        className
      )}
      dir="rtl"
      lang="fa"
    >
      {/* 🔳 Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120,120,120,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120,120,120,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* 🌟 Main Content */}
      <div className="relative z-10 max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && badge}
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {title}
          </h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium opacity-0 delay-100 sm:text-xl">
            {description}
          </p>
          {buttons !== false && buttons.length > 0 && (
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  size="lg"
                  asChild
                >
                  <a href={button.href}>
                    {button.icon}
                    {button.text}
                    {button.iconRight}
                  </a>
                </Button>
              ))}
            </div>
          )}
          {mockup !== false && (
            <div className="relative w-full pt-12">
<Image
  src="/ax.png"
  alt="test image"
  width={320} // or the real width
  height={320} // or the real height
  className="w-80 h-auto -mb-40 -mt-60 mr-180 z-10"
/>

              <MockupFrame
                className="z-1 animate-appear opacity-0 delay-700"
                size="small"
              >
                <Mockup
                  type="responsive"
                  className="bg-background/90 w-full rounded-xl border-0"
                >
                  {mockup}
                </Mockup>
              </MockupFrame>
              <Glow
                variant="top"
                className="animate-appear-zoom opacity-0 delay-1000"
              />
            </div>
          )}
        </div>

        {/* 📦 Footer */}

      </div>
    </Section>
  );
}
