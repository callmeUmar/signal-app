"use client";

import { useEffect, useRef } from "react";

export default function AmbientPointer() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let x = -400;
    let y = -400;

    const paint = () => {
      glow.current?.style.setProperty("--pointer-x", `${x}px`);
      glow.current?.style.setProperty("--pointer-y", `${y}px`);
      frame = 0;
    };

    const handlePointer = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="ambient-pointer" ref={glow} aria-hidden="true" />;
}
