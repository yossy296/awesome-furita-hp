import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
const r = await client.query(`
  select table_name,
         (select count(*)::int from information_schema.columns c where c.table_name = t.table_name) as cols
  from information_schema.tables t
  where table_schema = 'public'
  order by table_name
`);
console.log(`[supabase] ${r.rowCount} public tables:`);
for (const row of r.rows) {
  console.log(`  ${row.table_name.padEnd(40)} (${row.cols} cols)`);
}
await client.end();
