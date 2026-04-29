"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { ja } from "@blocknote/core/locales";
import { useField } from "@payloadcms/ui";

export default function BlockNoteEditor({ path }: { path: string }) {
  const { value, setValue } = useField<any>({ path });

  const initialContent = Array.isArray(value) && value.length > 0 ? value : undefined;

  const editor = useCreateBlockNote({
    initialContent,
    dictionary: ja,
  });

  useEffect(() => {
    const onChange = () => {
      setValue(editor.document);
    };
    const unsub = editor.onChange(onChange);
    return () => {
      try {
        if (typeof unsub === "function") unsub();
      } catch {}
    };
  }, [editor, setValue]);

  return <BlockNoteView editor={editor} theme="light" />;
}
