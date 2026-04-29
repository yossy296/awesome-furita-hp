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
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
    components: {
      beforeListTable: ["@/components/payload/MediaCardGrid"],
    },
  },
  fields: [{ name: "alt", label: "代替テキスト", type: "text", required: true }],
};
