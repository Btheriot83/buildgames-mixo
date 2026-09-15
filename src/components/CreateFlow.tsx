"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Brief } from "@/lib/types";
import { SpinningCounter } from "./transitions/SpinningCounter";
import { ThinkingLine } from "./transitions/ThinkingLine";

const STEPS = [
  { key: "productName", label: "Name the forme", hint: "Product or page name", placeholder: "Letterpress Co" },
  { key: "tagline", label: "Set the headline ink", hint: "One sharp promise", placeholder: "Proofs that feel printed" },
  { key: "audience", label: "Who reads the sheet?", hint: "Audience in plain words", placeholder: "Indie founders shipping one page" },
  { key: "tone", label: "Press mood", hint: "Tone — editorial, wry, strict…", placeholder: "Editorial, confident" },
  { key: "offer", label: "The offer lockup", hint: "What they get", placeholder: "Brief → editable page → static export" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

const empty: Brief = {
  productName: "",
  tagline: "",
  audience: "",
  tone: "",
  offer: "",
};

export function CreateFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>(empty);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const current = STEPS[step];
  const value = brief[current.key as StepKey];
  const progress = ((step + 1) / (STEPS.length + 1)) * 100;

  function next() {
    const el = document.getElementById("brief-field") as HTMLTextAreaElement | null;
    const live = (el?.value ?? value).trim();
    if (!live) {
      setError("Fill this line before advancing the chase.");
      return;
    }
    const key = current.key as StepKey;
    setBrief((b) => ({ ...b, [key]: live }));
    setError(null);
    if (step < STEPS.length - 1) setStep(step + 1);
    else void submitWith({ ...brief, [key]: live });
  }

  async function submitWith(finalBrief: Brief) {
    setLoading(true);
    setPressing(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: finalBrief }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Press jammed");
      await new Promise((r) => setTimeout(r, 1400));
      router.push(`/projects/${data.project.id}`);
    } catch (e) {
      setPressing(false);
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-flow" aria-label="Create landing page">
      <div className="press-meter" aria-hidden>
        <div className="press-meter-fill" style={{ width: `${progress}%` }} />
        <span className="press-meter-label">
          FORME{" "}
          <SpinningCounter value={step + 1} pad={2} />
          {" / "}
          {String(STEPS.length).padStart(2, "0")}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {pressing ? (
          <motion.div
            key="press"
            className="pressing-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="press-ram" aria-hidden />
            <p className="pressing-title">Pulling proof…</p>
            <p className="muted">
              <ThinkingLine active={pressing} />
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={current.key}
            initial={mounted ? { opacity: 0, x: 24 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
            className="create-step"
          >
            <p className="step-kicker">Brief · line {step + 1}</p>
            <h2 id="create-label">{current.label}</h2>
            <p className="muted">{current.hint}</p>
            <label className="sr-only" htmlFor="brief-field">
              {current.label}
            </label>
            <textarea
              id="brief-field"
              rows={step === 4 ? 3 : 2}
              value={value}
              placeholder={current.placeholder}
              onChange={(e) =>
                setBrief((b) => ({ ...b, [current.key]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  next();
                }
              }}
              autoFocus
            />
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="create-actions">
              <button
                type="button"
                className="btn-ghost"
                disabled={step === 0 || loading}
                onClick={() => {
                  setError(null);
                  setStep((s) => Math.max(0, s - 1));
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-acid"
                data-testid="create-next"
                disabled={loading}
                onClick={next}
              >
                {step === STEPS.length - 1
                  ? loading
                    ? "Inking…"
                    : "Pull proof"
                  : "Next line"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
