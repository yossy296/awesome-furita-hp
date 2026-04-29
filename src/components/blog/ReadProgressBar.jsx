"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export default function ReadProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  useEffect(() => {
    document.body.style.setProperty("--read-progress", "0");
  }, []);

  return <motion.div className="read-bar" style={{ scaleX }} />;
}
