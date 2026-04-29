import type { CollectionConfig } from "payload";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  labels: { singular: "お問い合わせ", plural: "お問い合わせ" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "createdAt"],
  },
  fields: [
    { name: "name", label: "お名前", type: "text", required: true },
    { name: "email", label: "メールアドレス", type: "email", required: true },
    { name: "message", label: "本文", type: "textarea", required: true },
  ],
};
