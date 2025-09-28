import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  studentAccounts,
  studentCourses,
  studentEnrollments,
  studentCourseRequests,
} from "@shared/schema";

let cachedDb: ReturnType<typeof drizzle> | null = null;

export interface NeonStatus {
  connected: boolean;
  message: string;
}

export function getNeonDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("Neon database URL is not configured. Student portal is operating in memory only.");
    return null;
  }

  if (cachedDb) {
    return cachedDb;
  }

  const sql = neon(connectionString);
  cachedDb = drizzle(sql);
  return cachedDb;
}

export async function getNeonStatus(): Promise<NeonStatus> {
  try {
    const db = getNeonDb();
    if (!db) {
      return {
        connected: false,
        message: "DATABASE_URL is not set; Neon connection deferred.",
      };
    }

    // Perform a lightweight query to validate connectivity.
    await db.execute("select 1");
    return {
      connected: true,
      message: "Neon connection successful.",
    };
  } catch (error) {
    console.error("Neon status check failed:", error);
    return {
      connected: false,
      message: error instanceof Error ? error.message : "Unknown Neon error",
    };
  }
}

export async function ensureStudentPortalTables(): Promise<void> {
  const db = getNeonDb();
  if (!db) {
    return;
  }

  // These calls ensure that Drizzle is aware of the tables when migrations are executed.
  // The actual schema deployment should be handled via `drizzle-kit push` when DATABASE_URL is configured.
  await db.select().from(studentAccounts).limit(1).execute().catch(() => undefined);
  await db.select().from(studentCourses).limit(1).execute().catch(() => undefined);
  await db.select().from(studentEnrollments).limit(1).execute().catch(() => undefined);
  await db.select().from(studentCourseRequests).limit(1).execute().catch(() => undefined);
}
