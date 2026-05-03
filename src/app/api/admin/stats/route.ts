import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [total, verified, approved, pending, rejected, totalVotes] =
    await Promise.all([
      prisma.participant.count(),
      prisma.participant.count({ where: { verified: true } }),
      prisma.participant.count({ where: { status: "approved" } }),
      prisma.participant.count({ where: { status: "pending" } }),
      prisma.participant.count({ where: { status: "rejected" } }),
      prisma.vote.count(),
    ]);

  const topVoted = await prisma.vote.groupBy({
    by: ["participantId"],
    _count: { participantId: true },
    orderBy: { _count: { participantId: "desc" } },
    take: 1,
  });

  let topVotedParticipant = null;
  if (topVoted.length > 0) {
    const p = await prisma.participant.findUnique({
      where: { id: topVoted[0].participantId },
      select: { restaurantName: true },
    });
    topVotedParticipant = p
      ? { restaurantName: p.restaurantName, votes: topVoted[0]._count.participantId }
      : null;
  }

  return NextResponse.json({
    total,
    verified,
    approved,
    pending,
    rejected,
    totalVotes,
    topVotedParticipant,
  });
}
