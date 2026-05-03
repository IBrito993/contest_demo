export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getContent() {
  const rows = await prisma.siteContent.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export default async function HomePage() {
  const c = await getContent();

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-red-600 text-white py-24 px-4"
        style={c.banner_url ? { backgroundImage: `url(${c.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
      >
        {c.banner_url && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {c.hero_title ?? "Restaurant Contest"}
          </h1>
          <p className="text-xl mb-8 opacity-90">{c.hero_subtitle}</p>
          {c.registration_open === "true" && (
            <Link
              href="/register"
              className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-full text-lg hover:bg-red-50 transition"
            >
              Register Now
            </Link>
          )}
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">About the Contest</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {c.contest_description}
        </p>
      </section>

      {/* Dates */}
      {(c.contest_start_date || c.contest_end_date) && (
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-8 text-center">
            {c.contest_start_date && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Registration Opens</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{c.contest_start_date}</p>
              </div>
            )}
            {c.contest_end_date && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contest Ends</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{c.contest_end_date}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 flex flex-col sm:flex-row gap-4 justify-center">
        {c.registration_open === "true" && (
          <Link href="/register" className="bg-red-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition text-center">
            Register Your Restaurant
          </Link>
        )}
        {c.public_voting_enabled === "true" && (
          <Link href="/vote" className="bg-white border-2 border-red-600 text-red-600 font-bold px-8 py-3 rounded-lg hover:bg-red-50 transition text-center">
            Vote Now
          </Link>
        )}
      </section>
    </div>
  );
}
