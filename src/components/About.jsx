"use client";


import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import SocialLinks from "./SocialLinks.jsx";
import SplitText from "./SplitText.jsx";
import MorphingBlob from "./MorphingBlob.jsx";
import { useT } from "@/i18n/I18nProvider";

function Counter({ to, duration = 1.4, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  const { t } = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["-30px", "30px"]);

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about__inner">
        <motion.div
          className="about__photo"
          style={{ y: portraitY }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="blob-bg" aria-hidden="true"></div>
          <MorphingBlob
            className="portrait portrait--morph"
            seed={42}
            count={6}
            duration={5}
            extraPoints={10}
            randomness={3.5}
          >
            <img
              src="/furi-portrait.jpg"
              alt="Furi portrait"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "right center",
              }}
            />
          </MorphingBlob>
        </motion.div>

        <motion.div
          className="about__content"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="about__heading">
            <motion.span variants={itemVariants} className="eyebrow">
              {t("about.eyebrow")}
            </motion.span>
            <motion.div variants={itemVariants}>
              <SplitText as="h2" className="jp-h" variant="rise" charDelay={32}>
                {t("about.title")}
              </SplitText>
            </motion.div>
            <motion.p variants={itemVariants} className="about__copy">
              {t("about.copyL1")}<br />
              {t("about.copyL2")}<br />
              {t("about.copyL3")}<br />
              {t("about.copyL4")}<br />
              {t("about.copyL5")}
              <strong>
                <Counter to={32} suffix={t("about.countriesSuffix")} />
              </strong>
              {t("about.copyL6")}<br />
              {t("about.copyL7")}<br />
              <strong>
                <Counter to={400} suffix={t("about.sessionsSuffix")} />
              </strong>
              {t("about.copyL8")}
            </motion.p>
            <motion.div variants={itemVariants} className="about__signature">
              Furi
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="about__meta"
          style={{ gridColumn: 2, alignSelf: "center" }}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {[
            { label: t("about.metaName"), icon: "person" },
            { label: t("about.metaLocation"), icon: "pin" },
            { label: t("about.metaJob"), icon: "case" },
            { label: t("about.metaSessions"), icon: "cal" },
          ].map((row) => (
            <motion.div key={row.label} className="row" variants={itemVariants}>
              <MetaIcon name={row.icon} />
              <span>{row.label}</span>
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="about__social-label">
            {t("about.follow")}
          </motion.div>
          <motion.div variants={itemVariants}>
            <SocialLinks className="about__social" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function MetaIcon({ name }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "person")
    return (
      <svg viewBox="0 0 24 24" {...stroke}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    );
  if (name === "pin")
    return (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  if (name === "case")
    return (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M3 7h18v13H3z" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}
