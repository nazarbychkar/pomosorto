"use server";

import { neon } from "@neondatabase/serverless";

export default async function dbConnect() {
  if (!process.env.DATABASE_URL) throw Error("where is DATABASE_URL in .env*");

  const sql = neon(process.env.DATABASE_URL);

  return sql;
}

export async function dbPomodoroSession(
  userId: number,
  sessionTimestamp: Date,
  elapsedTime: number,
  workRest: boolean
) {
  const sql = await dbConnect();

  await sql`INSERT INTO "pomodoro_sessions" ("userId", "sessionTimestamp", "elapsedTime", "workRest")
    VALUES (${userId}, ${sessionTimestamp}, ${elapsedTime}, ${workRest})`;
}
