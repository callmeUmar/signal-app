"use client";

import { useEffect } from "react";

export default function MotionRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      root.dataset.motion = "settled";
      return;
    }

    root.dataset.motion = "running";
    let cancelled = false;
    let entrance: { revert: () => unknown } | undefined;

    const runEntrance = async () => {
      try {
        const [{ createTimeline }, { stagger }] = await Promise.all([
          import("animejs/timeline"),
          import("animejs/utils"),
        ]);
        if (cancelled) return;

        entrance = createTimeline({ defaults: { duration: 620, ease: "out(4)" } })
          .add('[data-enter="nav"]', { opacity: [0, 1], y: [-12, 0] }, 20)
          .add('[data-enter="kicker"]', { opacity: [0, 1], y: [14, 0] }, 90)
          .add('[data-enter="title"]', { opacity: [0, 1], y: [28, 0] }, 130)
          .add('[data-enter="body"]', { opacity: [0, 1], y: [18, 0], delay: stagger(55) }, 250)
          .add('[data-enter="console"]', { opacity: [0, 1], y: [22, 0], scale: [0.99, 1] }, 330)
          .call(() => {
            root.dataset.motion = "settled";
          });
      } catch {
        root.dataset.motion = "settled";
      }
    };

    void runEntrance();

    const observed = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || observed.has(entry.target)) continue;
          observed.add(entry.target);
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    document.querySelectorAll(".reveal-block").forEach((element) => observer.observe(element));

    return () => {
      cancelled = true;
      entrance?.revert();
      observer.disconnect();
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
