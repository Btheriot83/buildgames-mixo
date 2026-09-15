"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_STATES = [
  "Locking sections…",
  "Inking type…",
  "Registering marks…",
  "Pulling proof…",
];

export function ThinkingLine({
  active,
  states = DEFAULT_STATES,
}: {
  active: boolean;
  states?: string[];
}) {
  const [i, setI] = useState(0);
  const liveRef = useRef<HTMLSpanElement>(null);
  const longest = states.reduce((a, b) => (a.length >= b.length ? a : b), "");

  useEffect(() => {
    if (!active) {
      setI(0);
      return;
    }
    const hold = 900;
    const id = window.setInterval(() => {
      const live = liveRef.current;
      if (!live) {
        setI((n) => (n + 1) % states.length);
        return;
      }
      live.classList.add("is-exit");
      window.setTimeout(() => {
        setI((n) => (n + 1) % states.length);
        live.classList.remove("is-exit");
        live.classList.add("is-enter-start");
        void live.offsetWidth;
        live.classList.remove("is-enter-start");
      }, 150);
    }, hold);
    return () => clearInterval(id);
  }, [active, states.length]);

  if (!active) return null;
  const text = states[i] || states[0];

  return (
    <span className="t-think" role="status">
      <span className="t-think-sizer" aria-hidden="true">
        {longest}
      </span>
      <span
        ref={liveRef}
        className="t-think-text"
        data-text={text}
      >
        {text}
      </span>
    </span>
  );
}
