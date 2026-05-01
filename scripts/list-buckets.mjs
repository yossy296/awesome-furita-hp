import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.SUPABASE_STORAGE_ENDPOINT,
  region: process.env.SUPABASE_STORAGE_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const r = await s3.send(new ListBucketsCommand({}));
console.log("[storage] buckets:");
for (const b of r.Buckets || []) console.log("  -", b.Name);
if (!r.Buckets?.length) console.log("  (none)");
