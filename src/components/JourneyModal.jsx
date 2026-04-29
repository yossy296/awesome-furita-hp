"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function JourneyModal({ open, item, allCards = [], activeIndex = 0, onClose, onSelect }) {
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    setPhotoIdx(0);
  }, [activeIndex]);

  // Auto-advance gallery every 3.5s while modal is open
  useEffect(() => {
    if (!open || !item) return;
    const galleryLen = (item.gallery?.length || 1);
    if (galleryLen <= 1) return;
    const id = setInterval(() => {
      setPhotoIdx((idx) => (idx + 1) % galleryLen);
    }, 3500);
    return () => clearInterval(id);
  }, [open, item, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onSelect((activeIndex - 1 + allCards.length) % allCards.length);
      if (e.key === "ArrowRight") onSelect((activeIndex + 1) % allCards.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const lenis = /** @type {any} */ (window).__lenis;
    if (lenis && typeof lenis.stop === "function") lenis.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (lenis && typeof lenis.start === "function") lenis.start();
    };
  }, [open, onClose, onSelect, activeIndex, allCards.length]);

  const gallery = item?.gallery && item.gallery.length > 0 ? item.gallery : item ? [item.img] : [];
  const heroImg = gallery[photoIdx] || item?.img;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="jpage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.article
            className="jcard"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="jcard__close" onClick={onClose} aria-label="閉じる">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="jcard__media">
              <div className="jcard__photo jcard__photo--plain" style={{ position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${item.n}-${photoIdx}`}
                    src={heroImg}
                    alt=""
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 16,
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>

            <div className="jcard__body">
              <div className="jcard__num">{item.n}</div>
              <h2 className="jcard__name">{item.name}</h2>
              {item.tags && item.tags.length > 0 && (
                <div className="jcard__tags">
                  {item.tags.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              )}
              <p className="jcard__copy" data-lenis-prevent>
                {item.desc.split("\n").map((l, i, arr) => (
                  <span key={i}>
                    {l}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            <div className="jcard__thumbs">
              <button
                className="jcard__nav"
                aria-label="前の旅路"
                onClick={() => onSelect((activeIndex - 1 + allCards.length) % allCards.length)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <div className="jcard__thumbs-row">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    className={`jcard__thumb jcard__thumb--plain ${i === photoIdx ? "active" : ""}`}
                    onClick={() => setPhotoIdx(i)}
                    style={{ backgroundImage: `url('${g}')` }}
                    aria-label={`画像 ${i + 1}`}
                  />
                ))}
              </div>
              <button
                className="jcard__nav"
                aria-label="次の旅路"
                onClick={() => onSelect((activeIndex + 1) % allCards.length)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
