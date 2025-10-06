import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Redirect unauthenticated users
  if (!token && (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/exam") || req.nextUrl.pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  // Restrict /admin only for specific phone number
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const allowedPhone = "09102942780"
    const allowedPhone2 ="09144229509"
    const allowedPhone3 ="09217431568"
    const allowedPhone4 ="09300377923"


     // keep admin phone in .env for safety
    if (
      token?.phoneNumber !== allowedPhone &&
      token?.phoneNumber !== allowedPhone2 &&
      token?.phoneNumber !== allowedPhone3 &&
      token?.phoneNumber !== allowedPhone4 


    ) {
            return NextResponse.redirect(new URL("/404", req.url)) // or /dashboard
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/exam/:path*", "/admin/:path*"],
}
