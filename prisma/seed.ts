import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@contest.com" },
    update: {},
    create: {
      email: "admin@contest.com",
      name: "Admin",
      password: hashed,
      role: "admin",
    },
  });

  const contentDefaults = [
    { key: "hero_title", value: "Best Restaurant Contest 2025" },
    { key: "hero_subtitle", value: "Vote for your favorite local restaurant!" },
    {
      key: "contest_description",
      value:
        "Welcome to the Best Restaurant Contest 2025! Register your restaurant and compete for the title of best restaurant in the city. Public voting opens after the registration period closes.",
    },
    { key: "banner_url", value: "" },
    { key: "contest_start_date", value: "2025-06-01" },
    { key: "contest_end_date", value: "2025-08-31" },
    { key: "registration_open", value: "true" },
    { key: "public_voting_enabled", value: "true" },
    {
      key: "categories",
      value: "Italian,Mexican,Bakery,Fast Food,Seafood,Steakhouse,Vegan,Other",
    },
  ];

  for (const item of contentDefaults) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  console.log("Seed complete. Admin: admin@contest.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
