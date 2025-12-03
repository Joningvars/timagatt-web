import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";

const envLocalPath = join(process.cwd(), ".env.local");
const envPath = join(process.cwd(), ".env");

if (existsSync(envLocalPath)) {
  loadEnv({ path: envLocalPath });
} else if (existsSync(envPath)) {
  loadEnv({ path: envPath });
}

async function seed() {
  const { db, pool } = await import("@/lib/db");
  const {
    expenses,
    organizationMembers,
    organizations,
    projects,
    timeEntries,
    users,
  } = await import("@/lib/db/schema");

  try {
    console.log("🧹 Resetting tables…");
    await db.delete(timeEntries);
    await db.delete(expenses);
    await db.delete(organizationMembers);
    await db.delete(projects);
    await db.delete(organizations);
    await db.delete(users);

    console.log("👤 Inserting users…");
    await db.insert(users).values([
      {
        id: "user_owner",
        name: "Jon Jonsson",
        email: "jon@timagatt.is",
        imageUrl: "https://i.pravatar.cc/150?img=3",
      },
      {
        id: "user_member",
        name: "Sara Sig",
        email: "sara@timagatt.is",
        imageUrl: "https://i.pravatar.cc/150?img=12",
      },
    ]);

    console.log("🏢 Inserting organizations…");
    await db.insert(organizations).values([
      {
        id: 1,
        name: "Timagatt HQ",
        slug: "timagatt-hq",
        plan: "pro",
      },
      {
        id: 2,
        name: "Northwind Consulting",
        slug: "northwind-consulting",
        plan: "team",
      },
    ]);

    console.log("🧑‍🤝‍🧑 Inserting memberships…");
    await db.insert(organizationMembers).values([
      {
        id: 1,
        organizationId: 1,
        userId: "user_owner",
        role: "owner",
      },
      {
        id: 2,
        organizationId: 1,
        userId: "user_member",
        role: "member",
      },
      {
        id: 3,
        organizationId: 2,
        userId: "user_owner",
        role: "admin",
      },
    ]);

    console.log("📁 Inserting projects…");
    await db.insert(projects).values([
      {
        id: 1,
        name: "Mobile App Redesign",
        description: "Complete UI overhaul for v2 launch.",
        color: "bg-purple-500",
        organizationId: 1,
      },
      {
        id: 2,
        name: "Client Portal",
        description: "Secure self-serve experience for enterprise clients.",
        color: "bg-blue-500",
        organizationId: 1,
      },
      {
        id: 3,
        name: "Northwind Integration",
        description: "Custom billing and reporting pipeline.",
        color: "bg-emerald-500",
        organizationId: 2,
      },
    ]);

    console.log("⏱️ Inserting time entries…");
    await db.insert(timeEntries).values([
      {
        id: 1,
        userId: "user_owner",
        projectId: 1,
        description: "Sprint planning + estimates",
        startTime: new Date("2025-01-07T09:00:00Z"),
        endTime: new Date("2025-01-07T10:30:00Z"),
        duration: 90 * 60,
      },
      {
        id: 2,
        userId: "user_member",
        projectId: 1,
        description: "High-fi prototype updates",
        startTime: new Date("2025-01-08T11:00:00Z"),
        endTime: new Date("2025-01-08T14:30:00Z"),
        duration: 3.5 * 3600,
      },
      {
        id: 3,
        userId: "user_owner",
        projectId: 3,
        description: "Data sync proof-of-concept",
        startTime: new Date("2025-01-09T08:30:00Z"),
        endTime: new Date("2025-01-09T12:00:00Z"),
        duration: 3.5 * 3600,
      },
    ]);

    console.log("💸 Inserting expenses…");
    await db.insert(expenses).values([
      {
        id: 1,
        userId: "user_owner",
        projectId: 1,
        description: "Figma plugin bundle",
        amount: "49.00",
        date: new Date("2025-01-06T00:00:00Z"),
      },
      {
        id: 2,
        userId: "user_member",
        projectId: 2,
        description: "Usability testing gift cards",
        amount: "150.00",
        date: new Date("2025-01-08T00:00:00Z"),
      },
      {
        id: 3,
        userId: "user_owner",
        projectId: 3,
        description: "Northwind site visit travel",
        amount: "420.75",
        date: new Date("2025-01-10T00:00:00Z"),
      },
    ]);

    console.log("✅ Seed complete!");
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error("❌ Seed failed", error);
  process.exitCode = 1;
});


