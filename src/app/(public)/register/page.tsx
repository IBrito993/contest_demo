export const dynamic = "force-dynamic";

import { RegistrationForm } from "@/components/public/RegistrationForm";
import { prisma } from "@/lib/prisma";

export default async function RegisterPage() {
  const categoriesRow = await prisma.siteContent.findUnique({
    where: { key: "categories" },
  });
  const regOpenRow = await prisma.siteContent.findUnique({
    where: { key: "registration_open" },
  });

  const categories = categoriesRow?.value.split(",").map((c) => c.trim()) ?? [];
  const isOpen = regOpenRow?.value !== "false";

  if (!isOpen) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Closed</h1>
        <p className="text-gray-500">Registration is not currently open. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Register Your Restaurant</h1>
      <p className="text-gray-500 mb-8">Fill in the form below. You&apos;ll receive a verification email.</p>
      <RegistrationForm categories={categories} />
    </div>
  );
}
