import pg from "pg";
export function createDatabase(connectionString: string, max = 5) {
  const pool = new pg.Pool({
    connectionString,
    max,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 10000,
    query_timeout: 3000,
    statement_timeout: 3000,
  });
  pool.on("error", () => console.error("Database pool connection failed"));
  return {
    pool,
    async check() {
      await pool.query("SELECT 1");
    },
  };
}
