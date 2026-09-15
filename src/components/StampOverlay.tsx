"use client";

import { useEffect, useState } from "react";

/** Gamified "press stamp" delight on successful export / publish. */
export function StampOverlay({
  show,
  label = "PROOF PULLED",
}: {
  show: boolean;
  label?: string;
}) {
  const [checkIn, setCheckIn] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setCheckIn(false);
      setToastOpen(false);
      return;
    }
    setCheckIn(false);
    setToastOpen(false);
    const id = requestAnimationFrame(() => {
      setCheckIn(true);
      setToastOpen(true);
    });
    return () => cancelAnimationFrame(id);
  }, [show]);

  if (!show) return null;

  return (
    <div className="stamp-overlay" role="status" aria-live="polite">
      <div className="stamp-mark" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <span
          className="t-success-check"
          data-state={checkIn ? "in" : "out"}
          aria-hidden="true"
          style={{ color: "var(--acid, #c8f542)" }}
        >
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" opacity="0.35" />
            <path
              d="M14 25.5 L21 32.5 L34 16.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
        <strong>{label}</strong>
        <em>HOT METAL · EXPORT OK</em>
      </div>
      <div
        className={`t-toast ${toastOpen ? "is-open" : ""}`}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          translate: "-50% 0",
          padding: "0.6rem 1rem",
          border: "1px solid var(--rule, #333)",
          background: "var(--panel, #161616)",
          color: "var(--acid, #c8f542)",
          fontFamily: "ui-monospace, monospace",
          fontSize: "0.75rem",
          zIndex: 60,
        }}
      >
        Stamp complete — check downloads
      </div>
    </div>
  );
}
