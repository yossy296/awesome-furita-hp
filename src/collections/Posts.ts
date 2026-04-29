import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "ブログ記事", plural: "ブログ記事" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "status"],
    components: {
      Description: "@/components/payload/LocaleSwitcher",
    },
  },
  fields: [
    { name: "title", label: "タイトル", type: "text", required: true, localized: true },
    {
      name: "slug",
      label: "スラッグ",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
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
