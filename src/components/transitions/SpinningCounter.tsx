"use client";

import { useEffect, useRef } from "react";

/** Slot-machine digit reels for forme index (transitions.dev spinning-counter). */
export function SpinningCounter({
  value,
  pad = 2,
  className = "",
}: {
  value: number;
  pad?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const str = String(Math.max(0, value)).padStart(pad, "0");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.replaceChildren();

    const cs = getComputedStyle(document.documentElement);
    const cell =
      parseFloat(cs.getPropertyValue("--reel-cell")) ||
      parseFloat(getComputedStyle(root).getPropertyValue("--reel-cell")) ||
      30;
    const spins = 2;

    [...str].forEach((ch, col) => {
      const digit = Number(ch);
      const colEl = document.createElement("div");
      colEl.className = "t-reel-col";
      colEl.style.width = `${cell * 0.72}px`;

      const strip = document.createElement("div");
      strip.className = "t-reel-strip";
      // two full 0-9 cycles + landing digit
      for (let cycle = 0; cycle < spins + 1; cycle++) {
        for (let d = 0; d < 10; d++) {
          const cellEl = document.createElement("div");
          cellEl.className = "t-reel-digit";
          cellEl.textContent = String(d);
          strip.appendChild(cellEl);
        }
      }
      const land = document.createElement("div");
      land.className = "t-reel-digit";
      land.textContent = ch;
      strip.appendChild(land);

      colEl.appendChild(strip);
      root.appendChild(colEl);

      const targetY = -((spins * 10 + digit) * cell);
      strip.style.transform = "translateY(0)";
      void strip.offsetHeight;
      if (reduce) {
        strip.style.transform = `translateY(${targetY}px)`;
      } else {
        strip.style.transition = `transform var(--reel-dur) var(--reel-ease) ${col * 90}ms`;
        requestAnimationFrame(() => {
          strip.style.transform = `translateY(${targetY}px)`;
        });
      }
    });
  }, [str, pad]);

  return (
    <div
      ref={rootRef}
      className={`t-reel ${className}`}
      aria-label={str}
      role="img"
    />
  );
}
