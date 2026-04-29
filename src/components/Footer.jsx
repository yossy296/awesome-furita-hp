"use client";


import { motion } from "motion/react";
import SocialLinks from "./SocialLinks.jsx";
import { useT } from "@/i18n/I18nProvider";

export default function Footer() {
  const { t } = useT();
  return (
    <motion.footer
      className="foot"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8 }}
    >
      <p className="signature">Furi</p>
      <SocialLinks className="foot__social" />
      <p className="foot__copy">{t("footer.copyright")}</p>
    </motion.footer>
  );
}
