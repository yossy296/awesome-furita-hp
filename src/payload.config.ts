import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ja } from "@payloadcms/translations/languages/ja";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Countries } from "./collections/Countries";
import { Partners } from "./collections/Partners";
import { Contacts } from "./collections/Contacts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
  collections: [Users, Media, Posts, Countries, Partners, Contacts],
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./data/payload.db",
    },
  }),
  sharp: (await import("sharp")).default,
});
