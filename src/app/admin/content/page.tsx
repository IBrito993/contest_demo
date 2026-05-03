export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentEditor } from "@/components/admin/ContentEditor";

export default async function ContentPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const content = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Content Editor</h1>
      <p className="text-gray-500 mb-8 text-sm">Edit the text and settings displayed on the public page.</p>
      <ContentEditor
        initialContent={content.map((c) => ({ key: c.key, value: c.value }))}
      />
    </div>
  );
}
