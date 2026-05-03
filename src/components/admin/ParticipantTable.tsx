"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge, statusVariant } from "@/components/ui/Badge";

type Participant = {
  id: string;
  fullName: string;
  email: string;
  restaurantName: string;
  category: string;
  status: string;
  verified: boolean;
  voteCount: number;
  createdAt: Date;
};

export function ParticipantTable({
  participants,
  total,
  page,
  totalPages,
  search,
  status,
}: {
  participants: Participant[];
  total: number;
  page: number;
  totalPages: number;
  search: string;
  status: string;
}) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState(search);
  const [statusVal, setStatusVal] = useState(status);
  const [, startTransition] = useTransition();

  function applyFilters(newSearch?: string, newStatus?: string) {
    const s = newSearch ?? searchVal;
    const st = newStatus ?? statusVal;
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (st) params.set("status", st);
    params.set("page", "1");
    startTransition(() => router.push(`/admin/participants?${params.toString()}`));
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/admin/participants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function deleteParticipant(id: string) {
    if (!confirm("Delete this participant? This cannot be undone.")) return;
    await fetch(`/api/admin/participants/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="Search name, email, restaurant…"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
        />
        <select
          value={statusVal}
          onChange={(e) => { setStatusVal(e.target.value); applyFilters(undefined, e.target.value); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={() => applyFilters()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          Search
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-3">{total} results</p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              {["Restaurant", "Name", "Email", "Category", "Status", "Verified", "Votes", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {participants.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No participants found.</td></tr>
            )}
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.restaurantName}</td>
                <td className="px-4 py-3 text-gray-600">{p.fullName}</td>
                <td className="px-4 py-3 text-gray-500">{p.email}</td>
                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  {p.verified
                    ? <span className="text-green-600 font-medium">Yes</span>
                    : <span className="text-gray-400">No</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.voteCount}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {p.status !== "approved" && (
                      <button onClick={() => updateStatus(p.id, "approved")} className="text-xs text-green-600 hover:underline">Approve</button>
                    )}
                    {p.status !== "rejected" && (
                      <button onClick={() => updateStatus(p.id, "rejected")} className="text-xs text-yellow-600 hover:underline">Reject</button>
                    )}
                    <button onClick={() => deleteParticipant(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-end">
          {page > 1 && (
            <button onClick={() => applyFilters()} className="px-3 py-1 border rounded text-sm hover:bg-gray-50">← Prev</button>
          )}
          <span className="px-3 py-1 text-sm text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <button
              onClick={() => startTransition(() => {
                const params = new URLSearchParams();
                if (searchVal) params.set("search", searchVal);
                if (statusVal) params.set("status", statusVal);
                params.set("page", String(page + 1));
                router.push(`/admin/participants?${params.toString()}`);
              })}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
