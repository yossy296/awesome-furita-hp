"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";

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

const ANIM_MS = 360;

export default function BlockNoteFieldClient(props: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lock page scroll, close on Escape while in fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const openFullscreenIfMobile = () => {
    if (typeof window === "undefined" || fullscreen) return;
    if (window.matchMedia?.("(max-width: 640px)").matches) {
      setFullscreen(true);
    }
  };

  const handleClose = () => {
    if (!fullscreen || closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setClosing(false);
      setFullscreen(false);
    }, ANIM_MS);
  };

  const stateClass = fullscreen
    ? closing
      ? "bn-host--fullscreen bn-host--closing"
      : "bn-host--fullscreen"
    : "";

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
      {fullscreen && (
        <div
          className={`bn-host__backdrop${closing ? " bn-host__backdrop--closing" : ""}`}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`bn-host ${stateClass}`.trim()}
        onClick={openFullscreenIfMobile}
        onFocus={openFullscreenIfMobile}
      >
        {fullscreen && (
          <button
            type="button"
            className="bn-host__done"
            aria-label="編集を完了"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            完了
          </button>
        )}
        <div className="bn-host__inner">
          <Editor path={props.path} />
        </div>
      </div>
    </div>
  );
}
