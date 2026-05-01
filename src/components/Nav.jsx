"use client";


import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useT } from "@/i18n/I18nProvider";
import LanguageToggle from "./LanguageToggle.jsx";
import SquircleButton from "./SquircleButton.jsx";

const hamburgerIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="20" height="2.6" rx="1.3" fill="currentColor" />
    <rect x="2" y="11" width="20" height="2.6" rx="1.3" fill="currentColor" />
    <rect x="2" y="17" width="20" height="2.6" rx="1.3" fill="currentColor" />
  </svg>
);

const closeIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <line x1="4.5" y1="4.5" x2="19.5" y2="19.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="19.5" y1="4.5" x2="4.5" y2="19.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 30));
  const { t } = useT();

  // Close drawer on Escape, and lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/#about", label: t("nav.about") },
    { href: "/#journey", label: t("nav.journey") },
    { href: "/#works", label: t("nav.works") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  return (
    <motion.nav
      className={`nav ${scrolled ? "scrolled" : ""} ${open ? "nav--open" : ""}`}
      id="nav"
      aria-label="Primary"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#top" className="nav__brand" aria-label="Furi">
        Furi
      </a>
      <div className="nav__links" id="nav-drawer">
        {links.map((l, i) => (
          <motion.a
            key={l.label + i}
            href={l.href}
            className="nav__link"
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </motion.a>
        ))}
        <LanguageToggle />
      </div>
      <SquircleButton
        className="nav__menu"
        sq
        color="lime"
        height={44}
        pressed={open}
        icon={open ? closeIcon : hamburgerIcon}
        ariaLabel={open ? "メニューを閉じる" : "メニューを開く"}
        onClick={() => setOpen((o) => !o)}
      />
    </motion.nav>
  );
}
