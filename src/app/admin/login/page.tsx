import { LoginForm } from "@/components/admin/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to manage the contest.</p>
        <LoginForm />
      </div>
    </div>
  );
}
