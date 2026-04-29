import type { CollectionConfig } from "payload";

function genSlug() {
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function") {
    return `post-${globalThis.crypto.randomUUID()}`;
  }
  return `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "ブログ記事", plural: "ブログ記事" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "heroImage", "publishedAt", "status"],
    components: {
      Description: "@/components/payload/LocaleSwitcher",
      beforeListTable: [
        "@/components/payload/PostsListExtras",
        "@/components/payload/PostsCardGrid",
      ],
    },
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
    { name: "title", label: "タイトル", type: "text", required: true, localized: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { hidden: true },
    },
    {
      name: "excerpt",
      label: "概要",
      type: "textarea",
      localized: true,
    },
    {
      name: "heroImage",
      label: "サムネイル",
      type: "upload",
      relationTo: "media",
      admin: {
        components: {
          Cell: "@/components/payload/HeroImageCell",
        },
      },
    },
    {
      name: "bodyJson",
      label: "本文",
      type: "json",
      localized: true,
      admin: {
        description: "ブロックエディタ（note風）で記事を書けます。右上の言語切替で別言語の本文を編集できます。",
        components: {
          Field: "@/components/payload/BlockNoteFieldClient",
        },
      },
    },
    {
      name: "tags",
      label: "タグ",
      type: "array",
      localized: true,
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "category",
      label: "カテゴリ",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      admin: {
        position: "sidebar",
        description: "既存カテゴリから選択、または「+ 新規登録」で即座に追加できます。",
        components: {
          Field: "@/components/payload/CategoryQuickPicker",
        },
      },
    },
    {
      name: "status",
      label: "ステータス",
      type: "select",
      options: [
        { label: "下書き", value: "draft" },
        { label: "公開", value: "published" },
      ],
      defaultValue: "draft",
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      label: "公開日",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
      },
    },
  ],
};
