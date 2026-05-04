import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ja } from "@payloadcms/translations/languages/ja";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Categories } from "./collections/Categories";
import { Countries } from "./collections/Countries";
import { Partners } from "./collections/Partners";
import { Contacts } from "./collections/Contacts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function buildDb() {
  const uri = process.env.DATABASE_URI;
  if (!uri) throw new Error("DATABASE_URI is not set");
  const isRemote = /\.(supabase\.co|amazonaws\.com|render\.com|neon\.tech)/.test(uri);
  return postgresAdapter({
    pool: {
      connectionString: uri,
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 0,
    },
  });
}

const storagePlugins = process.env.SUPABASE_STORAGE_ACCESS_KEY_ID
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.SUPABASE_STORAGE_BUCKET || "media",
        config: {
          credentials: {
            accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID!,
            secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY!,
          },
          region: process.env.SUPABASE_STORAGE_REGION || "us-east-1",
          endpoint: process.env.SUPABASE_STORAGE_ENDPOINT!,
          forcePathStyle: true,
        },
      }),
    ]
  : [];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — Furi Admin" },
    components: {
      graphics: {
        Logo: "@/components/payload/Logo",
        Icon: "@/components/payload/Icon",
      },
      beforeNavLinks: ["@/components/payload/BeforeNavLinks"],
      views: {
        dashboard: {
          Component: "@/components/payload/Dashboard",
        },
      },
    },
  },
  collections: [Users, Media, Posts, Categories, Countries, Partners, Contacts],
  localization: {
    locales: [
      { label: "日本語", code: "ja" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ja",
    fallback: true,
  },
  i18n: {
    fallbackLanguage: "ja",
    supportedLanguages: { ja },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "default-secret",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: buildDb(),
  plugins: storagePlugins,
  sharp: (await import("sharp")).default,
});
