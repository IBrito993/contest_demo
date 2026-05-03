import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow access to login page without auth
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {session && <AdminSidebar />}
      <main className={session ? "flex-1 overflow-auto" : "flex-1"}>
        {children}
      </main>
    </div>
  );
}
