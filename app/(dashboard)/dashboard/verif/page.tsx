"use client"
import dynamic from "next/dynamic"

const VerifyResult = dynamic(() => import("@/components/veriveri"), { ssr: false })

export default function Page() {
  return <VerifyResult />
}
