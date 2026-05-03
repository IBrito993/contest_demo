export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ParticipantTable } from "@/components/admin/ParticipantTable";

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const search = sp.search ?? "";
  const status = sp.status ?? "";
  const limit = 20;

  const where = {
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { restaurantName: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(status && { status }),
  };

  const [participants, total] = await Promise.all([
    prisma.participant.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { votes: true } } },
    }),
    prisma.participant.count({ where }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Participants</h1>
      <ParticipantTable
        participants={participants.map((p) => ({ ...p, voteCount: p._count.votes }))}
        total={total}
        page={page}
        totalPages={Math.ceil(total / limit)}
        search={search}
        status={status}
      />
    </div>
  );
}
