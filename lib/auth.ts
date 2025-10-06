// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import type { NextAuthOptions } from "next-auth"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        firstName: { label: "First Name", type: "text", optional: true },
        lastName: { label: "Last Name", type: "text", optional: true },
        melliCode: { label: "Melli Code", type: "text", optional: true },
        phoneNumber: { label: "Phone Number", type: "text" },
        mdStatus: { label: "Status", type: "text", optional: true },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { firstName, lastName, melliCode, phoneNumber, mdStatus, code } = credentials

        const latestCode = await prisma.code.findFirst({
          where: { phone: phoneNumber, used: false },
          orderBy: { createdAt: "desc" },
        })

        if (!latestCode || latestCode.code !== code) return null

        await prisma.code.update({
          where: { id: latestCode.id },
          data: { used: true },
        })

        let user = await prisma.user.findUnique({
          where: { phoneNumber },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              firstName: firstName || "",
              lastName: lastName || "",
              melliCode: melliCode || "",
              phoneNumber,
              mdStatus: mdStatus || "",
            },
          })
        }

        return {
          id: user.id,
          name: user.firstName,
          phoneNumber: user.phoneNumber,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phoneNumber = user.phoneNumber
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.phoneNumber = token.phoneNumber as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,


}
