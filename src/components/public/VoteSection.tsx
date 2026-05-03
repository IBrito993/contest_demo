"use client";
import { useState } from "react";

type Participant = { id: string; restaurantName: string; category: string; votes: number };

export function VoteSection({ participants }: { participants: Participant[] }) {
  const [email, setEmail] = useState("");
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ id: string; text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function vote(participantId: string) {
    if (!email) { setMessage({ id: participantId, text: "Please enter your email first.", ok: false }); return; }
    setLoading(participantId);
    setMessage(null);
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, voterEmail: email }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(null);
    if (res.ok) {
      setVoted((prev) => new Set(prev).add(participantId));
      setMessage({ id: participantId, text: "Vote registered! Thank you.", ok: true });
    } else {
      setMessage({ id: participantId, text: json.error ?? "Error submitting vote.", ok: false });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Email (required to vote)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="you@example.com"
        />
      </div>

      {participants.length === 0 && (
        <p className="text-gray-500">No participants are eligible for voting yet.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {participants.map((p) => (
          <div key={p.id} className="border rounded-xl p-5 bg-white shadow-sm flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{p.restaurantName}</h3>
              <span className="text-sm text-gray-500">{p.category}</span>
            </div>
            <p className="text-sm text-gray-600">🗳️ {p.votes} vote{p.votes !== 1 ? "s" : ""}</p>
            {message?.id === p.id && (
              <p className={`text-xs ${message.ok ? "text-green-600" : "text-red-600"}`}>{message.text}</p>
            )}
            <button
              onClick={() => vote(p.id)}
              disabled={voted.has(p.id) || loading === p.id}
              className="mt-auto bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {voted.has(p.id) ? "✓ Voted" : loading === p.id ? "Voting…" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
