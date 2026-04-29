import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "カテゴリ", plural: "カテゴリ" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  fields: [
    {
      name: "name",
      label: "カテゴリ名",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      label: "スラッグ",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
  ],
};
