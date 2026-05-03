export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [total, verified, approved, pending, rejected, totalVotes] = await Promise.all([
    prisma.participant.count(),
    prisma.participant.count({ where: { verified: true } }),
    prisma.participant.count({ where: { status: "approved" } }),
    prisma.participant.count({ where: { status: "pending" } }),
    prisma.participant.count({ where: { status: "rejected" } }),
    prisma.vote.count(),
  ]);
  return { total, verified, approved, pending, rejected, totalVotes };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const stats = await getStats();

  const cards = [
    { label: "Total Registrations", value: stats.total, color: "bg-blue-50 text-blue-700" },
    { label: "Verified", value: stats.verified, color: "bg-green-50 text-green-700" },
    { label: "Approved", value: stats.approved, color: "bg-emerald-50 text-emerald-700" },
    { label: "Pending Review", value: stats.pending, color: "bg-yellow-50 text-yellow-700" },
    { label: "Rejected", value: stats.rejected, color: "bg-red-50 text-red-700" },
    { label: "Total Votes", value: stats.totalVotes, color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl p-6 ${card.color}`}>
            <p className="text-3xl font-extrabold">{card.value}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
