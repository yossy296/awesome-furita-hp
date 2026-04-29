"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BlobImage from "./BlobImage.jsx";

export default function WorksModal({ open, item, allCards = [], activeIndex = 0, onClose, onSelect }) {
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    setPhotoIdx(0);
  }, [activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onSelect((activeIndex - 1 + allCards.length) % allCards.length);
      if (e.key === "ArrowRight") onSelect((activeIndex + 1) % allCards.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
              <motion.div
                key={`${item.name}-${photoIdx}`}
                className="jcard__photo jcard__photo--blob"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <BlobImage
                  src={heroImg}
                  seed={900 + activeIndex * 23 + photoIdx}
                  count={5}
                  duration={6}
                />
              </motion.div>
            </div>

            <div className="jcard__body">
              <div className="jcard__num">PARTNER</div>
              <h2 className="jcard__name">{item.name}</h2>
              <p className="jcard__sub">{item.tag}</p>
              {item.description && (
                <p className="jcard__copy">
                  {item.description.split("\n").map((l, i, arr) => (
                    <span key={i}>
                      {l}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )}
              {item.href && item.href !== "#" && (
                <a className="jcard__cta" href={item.href} target="_blank" rel="noopener">
                  公式サイトへ <span>→</span>
                </a>
              )}
            </div>

            <div className="jcard__thumbs">
              <button
                className="jcard__nav"
                aria-label="前へ"
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
                    className={`jcard__thumb jcard__thumb--blob ${i === photoIdx ? "active" : ""}`}
                    onClick={() => setPhotoIdx(i)}
                    aria-label={`画像 ${i + 1}`}
                  >
                    <BlobImage src={g} seed={950 + i * 7} count={4} duration={7} />
                  </button>
                ))}
              </div>
              <button
                className="jcard__nav"
                aria-label="次へ"
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
