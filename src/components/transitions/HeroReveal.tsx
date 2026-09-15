"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HeroReveal({
  kicker,
  title,
  lede,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
}) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`t-stagger ${shown ? "is-shown" : ""}`}>
      {kicker ? (
        <div className="t-stagger-line t-stagger-line--1">{kicker}</div>
      ) : null}
      <h1 className="t-stagger-line t-stagger-line--2 home-title">{title}</h1>
      {lede ? (
        <p className="t-stagger-line t-stagger-line--3 home-lede">{lede}</p>
      ) : null}
    </div>
  );
}
