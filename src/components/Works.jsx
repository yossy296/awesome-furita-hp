"use client";


import { useRef } from "react";
import { motion } from "motion/react";
import SplitText from "./SplitText.jsx";
import BlobImage from "./BlobImage.jsx";
import SquircleButton from "./SquircleButton.jsx";

const ChevronLeft = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const ChevronRight = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);
import { useT } from "@/i18n/I18nProvider";

const fallback = [
  {
    name: "CABINZERO",
    tag: "英国トラベルバッグ × Collaboration",
    img: "/assets/photo/photo_mask_02.png",
    href: "https://jp.cabinzero.com/en",
    description:
      "英国発トラベルバッグブランドCabinZeroとのコラボレーション。\n旅とライフスタイルを軽やかに繋ぐパートナーシップ。",
    gallery: ["/assets/photo/photo_mask_02.png", "/assets/photo/photo_mask_05.png"],
  },
  {
    name: "e-SIMシム",
    tag: "海外通信サービス × Ambassador",
    img: "/assets/photo/photo_mask_05.png",
    href: "https://www.instagram.com/esimsim_official/",
    description:
      "海外通信サービスe-simシムの公式アンバサダー。\n世界どこでも繋がるバックパッカーの相棒。",
    gallery: ["/assets/photo/photo_mask_05.png", "/assets/photo/photo_mask_03.png"],
  },
  {
    name: "ミエンミクリニック",
    tag: "韓国美容クリニック × Influencer",
    img: "/assets/photo/photo_mask_01.png",
    href: "https://jp.branch.mimimi.co.kr/index.php",
    description:
      "韓国美容クリニックMieMieの公式インフルエンサー。",
    gallery: ["/assets/photo/photo_mask_01.png", "/assets/photo/photo_mask_06.png"],
  },
  {
    name: "地球旅豆本",
    tag: "旅行誌 × Article / Essay",
    img: "/assets/photo/photo_mask_04.png",
    href: "https://mamebook.base.shop/items/135836656",
    description:
      "旅行誌『地球旅豆本』に記事・エッセイを掲載。\n旅で出会った景色と物語を、紙の上に。",
    gallery: ["/assets/photo/photo_mask_04.png", "/assets/photo/photo_mask_06.png"],
  },
];

function mapDoc(doc) {
  const main = doc.image?.url || doc.image?.sizes?.thumbnail?.url || "/assets/photo/photo_mask_01.png";
  const galleryRaw = Array.isArray(doc.gallery) ? doc.gallery : [];
  const gallery = galleryRaw
    .map((g) => g?.image?.url || g?.image?.sizes?.thumbnail?.url)
    .filter(Boolean);
  return {
    name: doc.name,
    tag: doc.tag,
    href: doc.url || "#",
    img: main,
    description: doc.description || "",
    gallery: [main, ...gallery],
  };
}

export default function Works({ partners }) {
  const { t } = useT();
  const works = partners && partners.length > 0 ? partners.map(mapDoc) : fallback;
  const trackRef = useRef(null);

  const stepX = () => {
    const track = trackRef.current;
    if (!track) return 220;
    const card = track.querySelector(".work");
    if (!card) return 220;
    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.columnGap || cs.gap || "18");
    return card.getBoundingClientRect().width + gap;
  };
  const scroll = (dir) => {
    if (trackRef.current) trackRef.current.scrollBy({ left: dir * stepX(), behavior: "smooth" });
  };

  return (
    <section className="works" id="works">
      <div className="works__inner">
        <motion.div
          className="works__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">{t("works.eyebrow")}</span>
          <SplitText as="h2" variant="tilt" charDelay={36}>
            {t("works.title")}
          </SplitText>
          <p>
            {t("works.intro").split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="row-nav" role="group" aria-label="Works navigation">
            <SquircleButton
              sq
              color="white"
              height={48}
              icon={ChevronLeft}
              iconColor="#0E1116"
              ariaLabel="前へ"
              onClick={() => scroll(-1)}
            />
            <SquircleButton
              sq
              color="lime"
              height={48}
              icon={ChevronRight}
              iconColor="#0E1116"
              ariaLabel="次へ"
              onClick={() => scroll(1)}
            />
          </div>
        </motion.div>

        <motion.div
          className="works__grid"
          ref={trackRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {works.map((w, i) => (
            <motion.a
              key={w.name}
              className="work"
              href={w.href}
              target="_blank"
              rel="noopener"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -6 }}
            >
              <motion.div
                className="work__thumb work__thumb--blob"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <BlobImage src={w.img} seed={200 + i * 11} count={5} duration={6} />
              </motion.div>
              <p className="work__name">{w.name}</p>
              <p className="work__tag">{w.tag}</p>
              <span className="work__more">{t("works.viewMore")}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
