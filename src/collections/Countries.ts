import type { CollectionConfig } from "payload";

export const Countries: CollectionConfig = {
  slug: "countries",
  labels: {
    singular: "旅路",
    plural: "旅路",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["order", "name", "country", "publishedAt"],
    components: {
      Description: "@/components/payload/LocaleSwitcher",
    },
  },
  endpoints: [
    {
      path: "/count",
      method: "get",
      handler: async (req) => {
        try {
          const result = await req.payload.count({ collection: "countries" });
          return Response.json({ count: result.totalDocs });
        } catch {
          return Response.json({ count: 0 });
        }
      },
    },
  ],
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
      name: "number",
      label: "ナンバー (例: 01)",
      type: "text",
      required: true,
    },
    {
      name: "name",
      label: "都市名",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "country",
      label: "国名",
      type: "text",
      localized: true,
    },
    {
      name: "description",
      label: "説明文",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "image",
      label: "メイン画像",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gallery",
      label: "ギャラリー画像 (複数)",
      type: "array",
      admin: {
        description: "モーダル下部のサムネイルとして表示される画像。複数枚追加できます。",
      },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "publishedAt",
      label: "公開日",
      type: "date",
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
  ],
};
