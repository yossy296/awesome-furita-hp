import type { CollectionConfig } from "payload";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: {
    singular: "パートナー",
    plural: "パートナー",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "tag", "url"],
    components: {
      Description: "@/components/payload/LocaleSwitcher",
    },
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "name",
      label: "パートナー名",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "tag",
      label: "タグ (例: 海外通信 × Ambassador)",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "url",
      label: "リンクURL",
      type: "text",
    },
    {
      name: "description",
      label: "説明文",
      type: "textarea",
      localized: true,
    },
    {
      name: "image",
      label: "サムネイル画像",
      type: "upload",
      relationTo: "media",
    },
  ],
};
