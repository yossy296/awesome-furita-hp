"use client";


import { motion } from "motion/react";
import SplitText from "./SplitText.jsx";
import { useT } from "@/i18n/I18nProvider";

const cardsBase = [
  {
    color: "lime",
    titleKey: "what.card1Title",
    descKey: "what.card1Desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="9" width="36" height="24" rx="2.5" />
        <path d="M18 39h12M16 33v6M32 33v6" />
        <path d="M11 14h8M11 18h14" />
      </svg>
    ),
  },
  {
    color: "cyan",
    titleKey: "what.card2Title",
    descKey: "what.card2Desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39l4-12L33 7l8 8L21 35l-12 4z" />
        <path d="M28 12l8 8" />
        <path d="M9 39l4-2" />
      </svg>
    ),
  },
  {
    color: "lime",
    titleKey: "what.card3Title",
    descKey: "what.card3Desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 14h7l3-4h18l3 4h7v22H5z" />
        <circle cx="24" cy="24" r="7" />
        <circle cx="37" cy="18" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    color: "cyan",
    titleKey: "what.card4Title",
    descKey: "what.card4Desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 22L8 32l6 4 4 6 9-7 13-7-2-6z" />
        <path d="M27 35l3 5 4-9" />
      </svg>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhatIDo() {
  const { t } = useT();
  return (
    <section className="what">
      <div className="wrap">
        <motion.div
          className="what__head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div variants={fadeUp}>
            <span className="eyebrow">{t("what.eyebrow")}</span>
            <SplitText as="h2" className="jp-h" variant="rise" charDelay={28}>
              {`${t("what.title1")}${t("what.title2")}`}
            </SplitText>
          </motion.div>
          <motion.div variants={fadeUp}>
            <p>{t("what.intro")}</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="what__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {cardsBase.map((c) => {
            const title = t(c.titleKey);
            const desc = t(c.descKey);
            return (
              <motion.article
                key={c.titleKey}
                className="what__card"
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <motion.div
                  className={`what__icon ${c.color}`}
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                >
                  {c.icon}
                </motion.div>
                <h4>{title}</h4>
                <p>
                  {desc.split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
