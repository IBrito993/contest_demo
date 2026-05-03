"use client";
import { useState } from "react";

type ContentItem = { key: string; value: string };

const FIELD_LABELS: Record<string, string> = {
  hero_title: "Hero Title",
  hero_subtitle: "Hero Subtitle",
  contest_description: "Contest Description",
  banner_url: "Banner Image URL",
  contest_start_date: "Start Date (YYYY-MM-DD)",
  contest_end_date: "End Date (YYYY-MM-DD)",
  registration_open: "Registration Open (true/false)",
  public_voting_enabled: "Public Voting Enabled (true/false)",
  categories: "Categories (comma-separated)",
};

export function ContentEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  async function save(key: string, value: string) {
    setSaving(key);
    await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
    setSaved((prev) => new Set(prev).add(key));
    setTimeout(() => setSaved((prev) => { const s = new Set(prev); s.delete(key); return s; }), 2000);
  }

  return (
    <div className="space-y-6">
      {content.map((item) => {
        const isTextarea = ["contest_description"].includes(item.key);
        return (
          <div key={item.key} className="bg-white border rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {FIELD_LABELS[item.key] ?? item.key}
            </label>
            <p className="text-xs text-gray-400 mb-2 font-mono">{item.key}</p>
            {isTextarea ? (
              <textarea
                rows={4}
                value={item.value}
                onChange={(e) => setContent((prev) => prev.map((c) => c.key === item.key ? { ...c, value: e.target.value } : c))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
              />
            ) : (
              <input
                value={item.value}
                onChange={(e) => setContent((prev) => prev.map((c) => c.key === item.key ? { ...c, value: e.target.value } : c))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
            <button
              onClick={() => save(item.key, item.value)}
              disabled={saving === item.key}
              className="mt-3 bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-60"
            >
              {saving === item.key ? "Saving…" : saved.has(item.key) ? "✓ Saved" : "Save"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
