import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/userslist
export async function GET(req: NextRequest) {
  console.log(req)
  try {
    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
        melliCode: true,
        mdStatus: true,
        dateOfRegister: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { users: [], message: "Internal server error" },
      { status: 500 }
    );
  }
}
