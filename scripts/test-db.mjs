import pg from "pg";

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error("DATABASE_URI not set");
  process.exit(1);
}

const isRemote = /\.(supabase\.co|amazonaws\.com)/.test(uri);
const client = new pg.Client({
  connectionString: uri,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  const r = await client.query("select version(), current_database(), now() as ts");
  console.log("[db] connected ✓");
  console.log("    database:", r.rows[0].current_database);
  console.log("    server  :", r.rows[0].version.split(",")[0]);
  console.log("    time    :", r.rows[0].ts.toISOString());
  await client.end();
} catch (err) {
  console.error("[db] connection failed:", err.message);
  process.exit(1);
}
