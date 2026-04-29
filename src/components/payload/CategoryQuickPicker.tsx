"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useField } from "@payloadcms/ui";

type Category = { id: string | number; name: string };

export default function CategoryQuickPicker({
  path,
  field,
}: {
  path: string;
  field?: { label?: string; admin?: { description?: string } };
}) {
  const { value, setValue } = useField<string | number | null>({ path });
  const [items, setItems] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Initial + refresh fetch
  const refetch = async () => {
    try {
      const r = await fetch(`/api/categories?limit=100&depth=0`);
      const data = await r.json();
      setItems(
        (data.docs || []).map((d: any) => ({
          id: d.id,
          name: d.name || "(無題)",
        }))
      );
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = items.find((it) => String(it.id) === String(value));
  const inputValue = open ? query : selected?.name || query;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.name.toLowerCase().includes(q));
  }, [items, query]);

  const exactMatch = useMemo(
    () => filtered.find((it) => it.name === query.trim()),
    [filtered, query]
  );

  const create = async () => {
    const name = query.trim();
    if (!name || creating) return;
    setCreating(true);
    try {
      const r = await fetch(`/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      const data = await r.json();
      const created = data.doc || data;
      if (created?.id != null) {
        const newItem: Category = { id: created.id, name };
        setItems((prev) => [newItem, ...prev]);
        setValue(created.id);
        setQuery("");
        setOpen(false);
      }
    } catch (e) {
      console.error("Failed to create category", e);
    } finally {
      setCreating(false);
    }
  };

  const choose = (id: string | number, _name: string) => {
    setValue(id);
    setQuery("");
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(null);
    setQuery("");
  };

  return (
    <div className="field-type" ref={wrapRef}>
      <label
        className="field-label"
        style={{
          display: "block",
          fontWeight: 600,
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        {field?.label || "カテゴリ"}
      </label>

      <div className="cat-picker">
        <div
          className={`cat-picker__input ${open ? "is-open" : ""}`}
          onClick={() => {
            setOpen(true);
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={selected ? "" : "検索または新規作成..."}
          />
          {selected && !open && (
            <button type="button" className="cat-picker__clear" onClick={clear} aria-label="クリア">
              ×
            </button>
          )}
          <span className="cat-picker__caret" aria-hidden="true">▾</span>
        </div>

        {open && (
          <ul className="cat-picker__list">
            {filtered.length === 0 && !query && (
              <li className="cat-picker__empty">候補がありません</li>
            )}
            {filtered.length === 0 && query && (
              <li className="cat-picker__empty">該当する候補はありません</li>
            )}
            {filtered.map((it) => (
              <li
                key={it.id}
                className={`cat-picker__item ${String(value) === it.id ? "is-active" : ""}`}
                onClick={() => choose(it.id, it.name)}
              >
                {it.name}
              </li>
            ))}
            {query.trim() && !exactMatch && (
              <li
                className="cat-picker__create"
                onClick={create}
                aria-disabled={creating}
              >
                <span>＋</span> {query.trim()}（新規登録）
              </li>
            )}
          </ul>
        )}
      </div>

      {field?.admin?.description && (
        <p style={{ fontSize: 11.5, color: "var(--furi-ink-3, #888)", marginTop: 6 }}>
          {field.admin.description}
        </p>
      )}
    </div>
  );
}
