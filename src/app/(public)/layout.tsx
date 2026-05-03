import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Restaurant Contest";
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-red-600 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90">
            {appName}
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/register" className="hover:underline">Register</Link>
            <Link href="/vote" className="hover:underline">Vote</Link>
            <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-800 text-gray-400 text-sm text-center py-4">
        © {new Date().getFullYear()} {appName}
      </footer>
    </div>
  );
}
