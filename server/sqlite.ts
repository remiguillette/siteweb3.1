import Database from "better-sqlite3";
import type { Database as DatabaseInstance } from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { createHash, timingSafeEqual } from "node:crypto";

export interface SqliteStatus {
  connected: boolean;
  message: string;
}

let sqliteClient: DatabaseInstance | null = null;
let drizzleDb: BetterSQLite3Database | null = null;
let sqlitePath: string | null = null;

function hashPin(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

function resolveDatabasePath(): string {
  const configured = process.env.DATABASE_URL;
  if (configured && configured.trim().length > 0) {
    return configured.startsWith("file:") ? configured.slice(5) : configured;
  }

  return path.resolve(process.cwd(), "sqlite.db");
}

export function getSqliteClient(): DatabaseInstance {
  if (sqliteClient) {
    return sqliteClient;
  }

  sqlitePath = resolveDatabasePath();
  const directory = path.dirname(sqlitePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  sqliteClient = new Database(sqlitePath);
  return sqliteClient;
}

export function getSqliteDb(): BetterSQLite3Database {
  if (!drizzleDb) {
    drizzleDb = drizzle(getSqliteClient());
  }

  return drizzleDb;
}

function initializeProtectedRoutes(): void {
  const client = getSqliteClient();

  const pinFromEnv = process.env.CARD_ROUTE_PIN?.trim();
  const defaultPin = pinFromEnv && /^\d{4}$/.test(pinFromEnv) ? pinFromEnv : "4281";

  if (pinFromEnv && !/^\d{4}$/.test(pinFromEnv)) {
    console.warn(
      "CARD_ROUTE_PIN must be a 4-digit numeric code. Falling back to the default PIN for /card.",
    );
  }

  const hashedPin = hashPin(defaultPin);

  client
    .prepare(
      `INSERT INTO protected_routes (route, pin_hash)
       VALUES (?, ?)
       ON CONFLICT(route) DO UPDATE SET
         pin_hash = excluded.pin_hash,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .run("/card", hashedPin);
}

export function verifyProtectedRoutePin(route: string, pin: string): boolean {
  if (!/^\d{4}$/.test(pin)) {
    return false;
  }

  try {
    const client = getSqliteClient();
    const row = client
      .prepare<[string], { pin_hash: string }>(
        "SELECT pin_hash FROM protected_routes WHERE route = ? LIMIT 1",
      )
      .get(route);

    if (!row?.pin_hash) {
      return false;
    }

    const storedBuffer = Buffer.from(row.pin_hash, "hex");
    const inputBuffer = Buffer.from(hashPin(pin), "hex");

    if (storedBuffer.length !== inputBuffer.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, inputBuffer);
  } catch (error) {
    console.error("Failed to verify protected route PIN:", error);
    return false;
  }
}

export async function getSqliteStatus(): Promise<SqliteStatus> {
  try {
    const client = getSqliteClient();
    client.prepare("select 1").get();

    return {
      connected: true,
      message: `SQLite database ready${sqlitePath ? ` at ${sqlitePath}` : ""}.`,
    };
  } catch (error) {
    return {
      connected: false,
      message: error instanceof Error ? error.message : "Unknown SQLite error",
    };
  }
}

export async function ensureStudentPortalTables(): Promise<void> {
  const client = getSqliteClient();

  const createStatements = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      service TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS training_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      address TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT NOT NULL,
      employment_status TEXT NOT NULL,
      employment_status_other TEXT,
      motivations TEXT NOT NULL,
      career_goals TEXT NOT NULL,
      declaration_accepted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_number TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT,
      address TEXT,
      temporary_password_hash TEXT NOT NULL,
      password_hash TEXT,
      requires_password_change INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      activated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_course_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_id ON student_enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_student_enrollments_course_id ON student_enrollments(course_id);
    CREATE INDEX IF NOT EXISTS idx_student_course_requests_student_id ON student_course_requests(student_id);
    CREATE INDEX IF NOT EXISTS idx_student_course_requests_course_id ON student_course_requests(course_id);

    CREATE TABLE IF NOT EXISTS protected_routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route TEXT NOT NULL UNIQUE,
      pin_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  client.exec(createStatements);
  initializeProtectedRoutes();
}
