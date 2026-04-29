import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "メディア", plural: "メディア" },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
    mimeTypes: ["image/*"],
  },
  admin: { useAsTitle: "alt" },
  fields: [{ name: "alt", label: "代替テキスト", type: "text", required: true }],
};
