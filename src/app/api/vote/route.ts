import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { voteSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const votingEnabled = await prisma.siteContent.findUnique({
      where: { key: "public_voting_enabled" },
    });
    if (votingEnabled?.value !== "true") {
      return NextResponse.json({ error: "Voting is not enabled." }, { status: 403 });
    }

    const participant = await prisma.participant.findFirst({
      where: {
        id: parsed.data.participantId,
        verified: true,
        status: "approved",
      },
    });
    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found or not eligible." },
        { status: 404 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? undefined;

    try {
      await prisma.vote.create({
        data: {
          participantId: parsed.data.participantId,
          voterEmail: parsed.data.voterEmail,
          voterIp: ip,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "You have already voted for this restaurant." },
        { status: 409 }
      );
    }

    const voteCount = await prisma.vote.count({
      where: { participantId: parsed.data.participantId },
    });

    return NextResponse.json({ success: true, voteCount }, { status: 201 });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
