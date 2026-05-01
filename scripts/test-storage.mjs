import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const bucket = process.env.SUPABASE_STORAGE_BUCKET;
const endpoint = process.env.SUPABASE_STORAGE_ENDPOINT;
const region = process.env.SUPABASE_STORAGE_REGION || "us-east-1";
const accessKeyId = process.env.SUPABASE_STORAGE_ACCESS_KEY_ID;
const secretAccessKey = process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY;
const publicBase = process.env.SUPABASE_STORAGE_PUBLIC_URL;

if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  console.error("missing storage env vars");
  process.exit(1);
}

const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

const key = `__test/connectivity-${Date.now()}.txt`;
const body = `furita-hp storage smoke test @ ${new Date().toISOString()}`;

try {
  console.log(`[1/5] HeadBucket "${bucket}"...`);
  await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  console.log("      ✓ bucket exists & accessible");

  console.log(`[2/5] PutObject "${key}"...`);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "text/plain",
    }),
  );
  console.log("      ✓ uploaded");

  console.log(`[3/5] GetObject "${key}"...`);
  const got = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const text = await got.Body.transformToString();
  console.log("      ✓ retrieved:", text);

  if (publicBase) {
    const url = `${publicBase}/${key}`;
    console.log(`[4/5] Public fetch ${url}...`);
    const r = await fetch(url);
    console.log(`      ${r.ok ? "✓" : "✗"} HTTP ${r.status}${r.ok ? "" : " (bucket may not be Public)"}`);
  }

  console.log(`[5/5] DeleteObject "${key}"...`);
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log("      ✓ cleaned up");

  console.log("\n[storage] all checks passed ✓");
} catch (err) {
  console.error("[storage] failed:", err.name, err.message);
  if (err.$metadata) console.error("  http status:", err.$metadata.httpStatusCode);
  process.exit(1);
}
