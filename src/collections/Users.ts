import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "ユーザー", plural: "ユーザー" },
  auth: true,
  admin: { useAsTitle: "email" },
  fields: [
    { name: "name", label: "名前", type: "text" },
    {
      name: "role",
      label: "権限",
      type: "select",
      options: [
        { label: "管理者", value: "admin" },
        { label: "編集者", value: "editor" },
      ],
      defaultValue: "editor",
    },
  ],
};
