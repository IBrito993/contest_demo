export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ScoringTable } from "@/components/admin/ScoringTable";

export default async function ScoringPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const participants = await prisma.participant.findMany({
    where: { verified: true, status: "approved" },
    include: { _count: { select: { votes: true } } },
    orderBy: { restaurantName: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Scoring</h1>
      <p className="text-gray-500 mb-8 text-sm">Assign scores to approved participants. Save each row individually.</p>
      <ScoringTable
        participants={participants.map((p) => ({
          id: p.id,
          restaurantName: p.restaurantName,
          category: p.category,
          score: p.score,
          votes: p._count.votes,
        }))}
      />
    </div>
  );
}
