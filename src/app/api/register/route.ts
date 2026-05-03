import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validations";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const regOpen = await prisma.siteContent.findUnique({
      where: { key: "registration_open" },
    });
    if (regOpen?.value === "false") {
      return NextResponse.json(
        { error: "Registration is currently closed." },
        { status: 403 }
      );
    }

    const existing = await prisma.participant.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }

    const token = generateVerificationToken();
    await prisma.participant.create({
      data: { ...parsed.data, verificationToken: token },
    });

    await sendVerificationEmail(parsed.data.email, parsed.data.fullName, token);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
