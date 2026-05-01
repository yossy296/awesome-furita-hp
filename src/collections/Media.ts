import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";
import { sanitizeFilename } from "@/lib/sanitizeFilename";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "メディア", plural: "メディア" },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
    mimeTypes: ["image/*"],
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
    components: {
      beforeListTable: ["@/components/payload/MediaCardGrid"],
    },
  },
  hooks: {
    // Sanitize filenames before they hit Supabase Storage (S3 InvalidKey on
    // non-ASCII / spaces). Also rewrite the uploaded buffer's name so the
    // storage adapter uses the sanitized key.
    beforeOperation: [
      ({ args, operation }) => {
        if (operation !== "create" && operation !== "update") return args;
        const file = args?.req?.file;
        if (file && typeof file.name === "string") {
          file.name = sanitizeFilename(file.name);
        }
        return args;
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data && typeof data.filename === "string") {
          data.filename = sanitizeFilename(data.filename);
        }
        return data;
      },
    ],
  },
  fields: [{ name: "alt", label: "代替テキスト", type: "text", required: true }],
};
