"use client";


import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useT } from "@/i18n/I18nProvider";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 30));
  const { t } = useT();

  return (
    <motion.nav
      className={`nav ${scrolled ? "scrolled" : ""}`}
      id="nav"
      aria-label="Primary"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#top" className="nav__brand" aria-label="Furi">
        Furi
      </a>
      <div className="nav__links">
        {[
          { href: "/", label: t("nav.home") },
          { href: "/#about", label: t("nav.about") },
          { href: "/#journey", label: t("nav.journey") },
          { href: "/#works", label: t("nav.works") },
          { href: "/blog", label: t("nav.blog") },
          { href: "/#contact", label: t("nav.contact") },
        ].map((l, i) => (
          <motion.a
            key={l.label + i}
            href={l.href}
            className="nav__link"
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {l.label}
          </motion.a>
        ))}
        <LanguageToggle />
      </div>
    </motion.nav>
  );
}
