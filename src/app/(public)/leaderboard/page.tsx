import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const participants = await prisma.participant.findMany({
    where: { verified: true, status: "approved" },
    include: { _count: { select: { votes: true } } },
    orderBy: { createdAt: "asc" },
  });

  const ranked = participants
    .map((p) => ({ ...p, voteCount: p._count.votes }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
      <p className="text-gray-500 mb-8">Updated every 60 seconds.</p>

      {ranked.length === 0 ? (
        <p className="text-gray-500">No results yet.</p>
      ) : (
        <div className="space-y-3">
          {ranked.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-4 bg-white border rounded-xl px-5 py-4 shadow-sm"
            >
              <span
                className={`text-2xl font-extrabold w-8 text-center ${
                  i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-300"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{p.restaurantName}</p>
                <p className="text-sm text-gray-500">{p.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600 text-lg">{p.voteCount}</p>
                <p className="text-xs text-gray-400">votes</p>
              </div>
              {p.score != null && (
                <div className="text-right ml-4">
                  <p className="font-bold text-blue-600 text-lg">{p.score}</p>
                  <p className="text-xs text-gray-400">score</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
