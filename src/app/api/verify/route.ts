import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/verify?status=invalid", req.url));
  }

  const participant = await prisma.participant.findUnique({
    where: { verificationToken: token },
  });

  if (!participant) {
    return NextResponse.redirect(new URL("/verify?status=invalid", req.url));
  }

  if (participant.verified) {
    return NextResponse.redirect(new URL("/verify?status=already", req.url));
  }

  await prisma.participant.update({
    where: { id: participant.id },
    data: { verified: true, verifiedAt: new Date(), verificationToken: null },
  });

  return NextResponse.redirect(new URL("/verify?status=success", req.url));
}
