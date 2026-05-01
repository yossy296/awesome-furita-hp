"use client";


import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function parseAnchor(target) {
  const a = target.closest?.("a[href]");
  if (!a) return null;
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
    return null;
  }
  const samePath = !pathOnly || pathOnly === window.location.pathname;
  if (!samePath || hash.length <= 1) return null;
  return document.querySelector(hash);
}

export default function SmoothScroll() {
  useEffect(() => {
    // Lenis intercepts wheel/touch events with rAF rewrites which can stutter
    // badly on mobile. Skip it on touch / no-hover devices and use the browser's
    // native smooth scroll instead.
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: none), (pointer: coarse)").matches;

    if (isTouch) {
      const handleAnchorClick = (e) => {
        const el = parseAnchor(e.target);
        if (!el) return;
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top, behavior: "smooth" });
      };
      document.addEventListener("click", handleAnchorClick);

      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          setTimeout(() => {
            const top = target.getBoundingClientRect().top + window.scrollY - 40;
            window.scrollTo({ top, behavior: "auto" });
          }, 80);
        }
      }

      return () => document.removeEventListener("click", handleAnchorClick);
    }

    // Desktop: use Lenis for buttery smooth wheel scrolling.
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
      const el = parseAnchor(e.target);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -40 });
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
