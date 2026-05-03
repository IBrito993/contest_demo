"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/participants", label: "Participants" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/scoring", label: "Scoring" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-5 py-5 border-b border-gray-700">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Admin Panel</p>
      </div>
      <nav className="flex-1 py-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-5 py-3 text-sm font-medium hover:bg-gray-800 transition",
              pathname.startsWith(item.href) ? "bg-gray-800 text-white" : "text-gray-400"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
