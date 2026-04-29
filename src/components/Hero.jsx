"use client";


import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useT } from "@/i18n/I18nProvider";

const charVariants = {
  hidden: { y: "120%", opacity: 0 },
  visible: (i) => ({
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0.05 * i + 0.2,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function AnimatedRow({ text, base = 0 }) {
  return (
    <span className="row" style={{ display: "block", overflow: "hidden" }}>
      {text.split("").map((c, i) => (
        <motion.span
          key={`${text}-${i}`}
          custom={base + i}
          variants={charVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "inline-block" }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { t } = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <header className="hero" id="top" ref={ref}>
      <motion.div
        className="hero__shape"
        aria-hidden="true"
        style={{ y: bgY }}
      />
      <motion.div className="hero__content" style={{ y: contentY, opacity: contentOpacity }}>
        <h1 className="hero__title">
          <AnimatedRow text={t("hero.title1")} base={0} />
          <AnimatedRow text={t("hero.title2")} base={t("hero.title1").length} />
          <span className="row">
            <motion.span
              className="become"
              initial={{ opacity: 0, y: 20, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("hero.title3")}
            </motion.span>
          </span>
        </h1>
        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.7, duration: 0.7 }}
        >
          {t("hero.sub")}
        </motion.p>
      </motion.div>

      <motion.div
        className="hero__scroll"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span>{t("hero.scroll")}</span>
        <span className="line"></span>
      </motion.div>

      <motion.div
        className="hero__badge"
        aria-hidden="true"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.6, duration: 1, type: "spring", stiffness: 100 }}
      >
        <motion.img
          src="/logo_circle.png"
          alt=""
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </header>
  );
}
