export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { VoteSection } from "@/components/public/VoteSection";

export default async function VotePage() {
  const votingEnabled = await prisma.siteContent.findUnique({
    where: { key: "public_voting_enabled" },
  });

  if (votingEnabled?.value !== "true") {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Voting Not Open</h1>
        <p className="text-gray-500">Public voting is not currently enabled.</p>
      </div>
    );
  }

  const participants = await prisma.participant.findMany({
    where: { verified: true, status: "approved" },
    include: { _count: { select: { votes: true } } },
    orderBy: { restaurantName: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Vote for Your Favorite</h1>
      <p className="text-gray-500 mb-8">Enter your email and vote for one restaurant. One vote per restaurant per email.</p>
      <VoteSection participants={participants.map((p) => ({ id: p.id, restaurantName: p.restaurantName, category: p.category, votes: p._count.votes }))} />
    </div>
  );
}
