"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const Editor = dynamic(() => import("./BlockNoteEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 24, color: "#888", fontSize: 13 }}>Loading editor...</div>
  ),
}) as ComponentType<{ path: string }>;

type Props = {
  path: string;
  field?: { label?: string; admin?: { description?: string } };
};

export default function BlockNoteFieldClient(props: Props) {
  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
        {props.field?.label || "本文"}
      </label>
      {props.field?.admin?.description && (
        <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
          {props.field.admin.description}
        </p>
      )}
      <div
        style={{
          border: "1px solid var(--theme-elevation-200, #e5e5e5)",
          borderRadius: 8,
          background: "var(--theme-elevation-0, #fff)",
          padding: 8,
          minHeight: 360,
        }}
      >
        <Editor path={props.path} />
      </div>
    </div>
  );
}
