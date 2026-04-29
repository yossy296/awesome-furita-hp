import type { CollectionConfig } from "payload";

function genSlug() {
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function") {
    return `cat-${globalThis.crypto.randomUUID()}`;
  }
  return `cat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "カテゴリ", plural: "カテゴリ" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name"],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug) {
          data.slug = genSlug();
        }
        return data;
      },
    ],
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
      type: "text",
      required: true,
      unique: true,
      admin: { hidden: true },
    },
  ],
};
