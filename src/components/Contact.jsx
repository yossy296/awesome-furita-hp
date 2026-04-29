"use client";


import { useState } from "react";
import { motion } from "motion/react";
import SplitText from "./SplitText.jsx";
import SquircleButton from "./SquircleButton.jsx";
import { useT } from "@/i18n/I18nProvider";

export default function Contact() {
  const { t } = useT();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [label, setLabel] = useState(t("contact.send"));
  const [sending, setSending] = useState(false);

  const handle = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: false }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (sending) return;
    const newErrs = {};
    ["name", "email", "message"].forEach((k) => {
      if (!form[k].trim()) newErrs[k] = true;
    });
    if (Object.keys(newErrs).length) {
      setErrors(newErrs);
      setLabel(t("contact.fillAll"));
      setTimeout(() => setLabel(t("contact.send")), 1800);
      return;
    }
    setSending(true);
    setLabel(t("contact.sending"));
    setTimeout(() => {
      setLabel(t("contact.thanks"));
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => {
        setLabel(t("contact.send"));
        setSending(false);
      }, 2400);
    }, 800);
  };

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <motion.div
          className="contact__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">{t("contact.eyebrow")}</span>
          <SplitText as="h2" variant="rise" charDelay={36}>
            {t("contact.title")}
          </SplitText>
          <p>
            {t("contact.intro").split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          <motion.img
            className="plane"
            src="/contact_plane.png"
            alt=""
            animate={{ x: [0, 12, 0], y: [0, -8, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.form
          className="contact__form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="row">
            <div className="field">
              <label htmlFor="name">{t("contact.name")}</label>
              <motion.input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handle("name")}
                animate={errors.name ? { x: [0, -8, 8, -6, 6, 0], borderColor: "#E25E5E" } : {}}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="field">
              <label htmlFor="email">{t("contact.email")}</label>
              <motion.input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handle("email")}
                animate={errors.email ? { x: [0, -8, 8, -6, 6, 0], borderColor: "#E25E5E" } : {}}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">{t("contact.message")}</label>
            <motion.textarea
              id="message"
              rows="6"
              value={form.message}
              onChange={handle("message")}
              animate={errors.message ? { x: [0, -8, 8, -6, 6, 0], borderColor: "#E25E5E" } : {}}
              transition={{ duration: 0.4 }}
            />
          </div>
          <SquircleButton
            type="submit"
            color="lime"
            fullWidth
            height={64}
            disabled={sending}
            className="send-btn-sq"
          >
            {label}
          </SquircleButton>
        </motion.form>
      </div>
    </section>
  );
}
