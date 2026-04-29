import type { CollectionConfig } from "payload";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: {
    singular: "パートナー",
    plural: "パートナー",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["order", "name", "tag", "url"],
    components: {
      Description: "@/components/payload/LocaleSwitcher",
    },
  },
  defaultSort: "order",
  fields: [
    {
      name: "order",
      label: "並び順",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
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
    {
      name: "gallery",
      label: "ギャラリー画像 (複数)",
      type: "array",
      admin: {
        description: "モーダルのサムネイルストリップに表示する画像。",
      },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
  ],
};
