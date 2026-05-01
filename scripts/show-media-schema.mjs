import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const r = await client.query(`
  select column_name, data_type, is_nullable
  from information_schema.columns
  where table_schema = 'public' and table_name = 'media'
  order by ordinal_position
`);

console.log(`[media table] ${r.rowCount} columns:`);
console.log("name".padEnd(28), "type".padEnd(28), "null");
console.log("-".repeat(70));
for (const row of r.rows) {
  console.log(
    row.column_name.padEnd(28),
    row.data_type.padEnd(28),
    row.is_nullable,
  );
}

await client.end();
