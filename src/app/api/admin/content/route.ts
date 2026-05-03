import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const content = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(content);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { key, value } = body;
  if (!key || typeof value === "undefined") {
    return NextResponse.json({ error: "key and value required" }, { status: 400 });
  }

  const item = await prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(item);
}
