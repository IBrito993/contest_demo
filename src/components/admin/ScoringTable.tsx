"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  restaurantName: string;
  category: string;
  score: number | null;
  votes: number;
};

export function ScoringTable({ participants }: { participants: Row[] }) {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, string>>(
    Object.fromEntries(participants.map((p) => [p.id, p.score != null ? String(p.score) : ""]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  async function saveScore(id: string) {
    setSaving(id);
    const score = scores[id] === "" ? null : parseFloat(scores[id]);
    await fetch(`/api/admin/participants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
    setSaving(null);
    setSaved((prev) => new Set(prev).add(id));
    setTimeout(() => setSaved((prev) => { const s = new Set(prev); s.delete(id); return s; }), 2000);
    router.refresh();
  }

  const sorted = [...participants].sort((a, b) => b.votes - a.votes);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            {["#", "Restaurant", "Category", "Votes", "Score", ""].map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No approved participants yet.</td></tr>
          )}
          {sorted.map((p, i) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-400 font-mono">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{p.restaurantName}</td>
              <td className="px-4 py-3 text-gray-500">{p.category}</td>
              <td className="px-4 py-3 text-gray-600 font-semibold">{p.votes}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  step="0.1"
                  value={scores[p.id]}
                  onChange={(e) => setScores((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  placeholder="—"
                  className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => saveScore(p.id)}
                  disabled={saving === p.id}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-60"
                >
                  {saving === p.id ? "…" : saved.has(p.id) ? "✓" : "Save"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
