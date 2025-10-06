import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"

const images = Array.from({ length: 8 }, (_, i) => `/au-${i + 1}.jpg`)

const ImageCard = ({ src }: { src: string }) => {
  return (
    <div className="relative h-80 w-60 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
      <Image
        src={src}
        alt="استاد"
        width={400}
        height={400}
        className="h-full w-full "
      />
    </div>
  )
}

export function MarqueeDemo() {
  const firstRow = images.slice(0, Math.ceil(images.length / 2))
  const secondRow = images.slice(Math.ceil(images.length / 2))

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16">
      {/* Title & Subtitle */}
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          معرفی اساتید
        </h2>
        <p className="mt-3 text-base md:text-lg text-muted-foreground">
          افتخار همکاری با برترین اساتید و متخصصان کشور برای ارائه آموزش‌های با کیفیت  
        </p>
      </div>

      {/* Row 1 */}
      <Marquee pauseOnHover className="[--duration:40s] gap-3 mb-6">
        {firstRow.map((src, i) => (
          <ImageCard key={i} src={src} />
        ))}
      </Marquee>

      {/* Row 2 */}
      <Marquee reverse pauseOnHover className="[--duration:60s] gap-3">
        {secondRow.map((src, i) => (
          <ImageCard key={i} src={src} />
        ))}
      </Marquee>

      {/* Gradient edges */}
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>



    </section>
    
  )
}
