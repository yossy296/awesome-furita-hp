"use client";


import { useRef, useState } from "react";
import { motion } from "motion/react";
import SplitText from "./SplitText.jsx";
import JourneyModal from "./JourneyModal.jsx";
import BlobImage from "./BlobImage.jsx";
import { useT } from "@/i18n/I18nProvider";

const fallback = [
  { n: "01", name: "BALI, INDONESIA", desc: "自然と文化が共存する島で、\n心がリセットされた。", img: "/assets/photo/photo_mask_03.png", gallery: ["/assets/photo/photo_mask_03.png", "/assets/photo/photo_mask_01.png", "/assets/photo/photo_mask_02.png"] },
  { n: "02", name: "PARIS, FRANCE", desc: "美しい街並みとアートに触れ、\n感性が磨かれた。", img: "/assets/photo/photo_mask_01.png", gallery: ["/assets/photo/photo_mask_01.png", "/assets/photo/photo_mask_04.png"] },
  { n: "03", name: "NEW YORK, USA", desc: "多様な価値観が交差する街で、\n旅に刺激をもらった。", img: "/assets/photo/photo_mask_02.png", gallery: ["/assets/photo/photo_mask_02.png", "/assets/photo/photo_mask_05.png"] },
  { n: "04", name: "BANGKOK, THAILAND", desc: "人の温かさと熱気に触れ、\n活力をもらった。", img: "/assets/photo/photo_mask_05.png", gallery: ["/assets/photo/photo_mask_05.png", "/assets/photo/photo_mask_03.png"] },
  { n: "05", name: "BARCELONA, SPAIN", desc: "ガウディの建築と街並みに、\nクリエイティビティを刺激された。", img: "/assets/photo/photo_mask_01.png", gallery: ["/assets/photo/photo_mask_01.png", "/assets/photo/photo_mask_06.png"] },
  { n: "06", name: "KYOTO, JAPAN", desc: "日本の美意識を再発見、\n侘び寂びを学んだ旅。", img: "/assets/photo/photo_mask_04.png", gallery: ["/assets/photo/photo_mask_04.png", "/assets/photo/photo_mask_06.png"] },
];

function mapDoc(doc) {
  const main = doc.image?.url || doc.image?.sizes?.thumbnail?.url || "/assets/photo/photo_mask_01.png";
  const galleryRaw = Array.isArray(doc.gallery) ? doc.gallery : [];
  const gallery = galleryRaw
    .map((g) => g?.image?.url || g?.image?.sizes?.thumbnail?.url)
    .filter(Boolean);
  return {
    n: doc.number || "",
    name: doc.country ? `${doc.name}, ${doc.country}` : doc.name,
    desc: doc.description || "",
    img: main,
    gallery: [main, ...gallery],
  };
}

export default function Journey({ countries }) {
  const { t } = useT();
  const cards = countries && countries.length > 0 ? countries.map(mapDoc) : fallback;
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const stepX = () => {
    const track = trackRef.current;
    if (!track) return 220;
    const card = track.querySelector(".j-card");
    if (!card) return 220;
    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.columnGap || cs.gap || "22");
    return card.getBoundingClientRect().width + gap;
  };

  const scroll = (dir) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * stepX(), behavior: "smooth" });
  };

  return (
    <section className="journey" id="journey">
      <div className="wrap">
        <motion.div
          className="journey__head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="journey__title-wrap">
            <span className="eyebrow">{t("journey.eyebrow")}</span>
            <SplitText as="h2" className="jp-h" variant="rise" charDelay={28}>
              {t("journey.title")}
            </SplitText>
          </div>
          <motion.img
            className="journey__plane"
            src="/assets/deco/deco_decoration_01.png"
            alt=""
            aria-hidden="true"
            animate={{ x: [0, 14, 0], y: [0, -6, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="journey__nav" role="group" aria-label="Journey navigation">
            <motion.button
              className="prev"
              aria-label="Previous"
              onClick={() => scroll(-1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </motion.button>
            <motion.button
              className="next"
              aria-label="Next"
              onClick={() => scroll(1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        <div className="journey__track" ref={trackRef}>
          {cards.map((c, i) => (
            <motion.article
              key={c.n}
              className="j-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              whileHover={{ y: -10 }}
              onClick={() => setActiveIdx(i)}
              style={{ cursor: "pointer" }}
            >
              <motion.div
                className="j-card__photo j-card__photo--blob"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.5 }}
              >
                <BlobImage src={c.img} seed={100 + i * 7} count={5} duration={6} />
              </motion.div>
              <div className="j-card__num">{c.n}</div>
              <h4 className="j-card__name">{c.name}</h4>
              <p className="j-card__desc">
                {c.desc.split("\n").map((l, idx) => (
                  <span key={idx}>
                    {l}
                    {idx < c.desc.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
              <span className="j-card__more">View more</span>
            </motion.article>
          ))}
        </div>
      </div>

      <JourneyModal
        open={activeIdx >= 0}
        item={activeIdx >= 0 ? cards[activeIdx] : null}
        allCards={cards}
        activeIndex={activeIdx}
        onClose={() => setActiveIdx(-1)}
        onSelect={(i) => setActiveIdx(i)}
      />
    </section>
  );
}
