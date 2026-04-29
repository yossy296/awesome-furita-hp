"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { ja } from "@blocknote/core/locales";

export default function BlogReader({ blocks }) {
  const initialContent =
    Array.isArray(blocks) && blocks.length > 0 ? blocks : [{ type: "paragraph", content: [{ type: "text", text: "（本文なし）", styles: {} }] }];

  const editor = useCreateBlockNote({
    initialContent,
    dictionary: ja,
  });

  useEffect(() => {
    editor.isEditable = false;
  }, [editor]);

  return (
    <div className="blog-detail__body">
      <BlockNoteView editor={editor} editable={false} theme="light" />
    </div>
  );
}
