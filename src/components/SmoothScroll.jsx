"use client";


import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      let hash = "";
      let pathOnly = "";
      if (href.startsWith("#")) {
        hash = href;
      } else if (href.includes("#")) {
        const [p, h] = href.split("#");
        pathOnly = p;
        hash = `#${h}`;
      } else {
        return;
      }
      const samePath = !pathOnly || pathOnly === window.location.pathname;
      if (!samePath || hash.length <= 1) return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -40 });
      }
    };
    document.addEventListener("click", handleAnchorClick);

    /** @type {any} */ (window).__lenis = lenis;

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => lenis.scrollTo(target, { offset: -40, immediate: true }), 80);
      }
    }

    return () => {
      gsap.ticker.remove(tickerCallback);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      delete (/** @type {any} */ (window)).__lenis;
    };
  }, []);

  return null;
}
