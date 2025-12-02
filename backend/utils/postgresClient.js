import pg from "pg";

export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Quick test function
export async function testDB() {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Database OK:", result.rows[0].now);
  } catch (err) {
    console.error("DB ERROR:", err);
  }
}
