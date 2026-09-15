"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Brief } from "@/lib/types";
import { EXAMPLE_BRIEFS } from "@/lib/sample";
import { ThinkingLine } from "./transitions/ThinkingLine";

const empty: Brief = {
  productName: "",
  tagline: "",
  audience: "",
  tone: "",
  offer: "",
};

/** Mixo-bar UX: one idea box → stamp. Optional expand for structured brief. */
export function CreateFlow() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [brief, setBrief] = useState<Brief>(empty);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [modeNote, setModeNote] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  async function submit() {
    setError(null);
    const ideaLive = idea.trim();
    if (!advanced) {
      if (ideaLive.length < 12) {
        setError("Give at least one clear sentence about the page.");
        setShake(true);
        window.setTimeout(() => setShake(false), 450);
        return;
      }
    } else {
      const missing = (Object.keys(empty) as (keyof Brief)[]).find((k) => !brief[k].trim());
      if (missing) {
        setError("Fill every advanced line, or switch back to the single idea box.");
        setShake(true);
        window.setTimeout(() => setShake(false), 450);
        return;
      }
    }

    setLoading(true);
    setPressing(true);
    try {
      const body = advanced ? { brief } : { idea: ideaLive };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Press jammed");
      setModeNote(data.meta?.note || null);
      await new Promise((r) => setTimeout(r, 900));
      router.push(`/projects/${data.project.id}`);
    } catch (e) {
      setPressing(false);
      setError(e instanceof Error ? e.message : "Failed to create");
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`create-flow t-error-shake ${shake ? "is-shaking" : ""}`} aria-label="Create landing page from brief">
      <div className="press-meter" aria-hidden>
        <div className="press-meter-fill" style={{ width: pressing ? "100%" : "18%" }} />
        <span className="press-meter-label">
          {pressing ? "Stamping landing…" : "One brief → stamp → export HTML"}
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
            <div className="t-skeleton-stack" aria-hidden>
              <div className="t-skeleton t-skeleton--lg" />
              <div className="t-skeleton t-skeleton--md" />
              <div className="t-skeleton t-skeleton--sm" />
            </div>
            <p className="pressing-title">Stamping landing…</p>
            <p className="muted">
              <ThinkingLine active={pressing} />
            </p>
            {modeNote ? <p className="mono-tag">{modeNote}</p> : null}
          </motion.div>
        ) : (
          <motion.div
            key={advanced ? "adv" : "idea"}
            initial={mounted ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="create-step"
          >
            <p className="step-kicker">Job · brief → stamped landing → export HTML</p>
            <h2 id="create-label">
              {advanced ? "Five-line brief" : "Describe the business in one sentence"}
            </h2>
            <p className="muted">
              {advanced
                ? "Name, promise, who it's for, tone, offer — then the same stamp."
                : "We stamp editable hero, features, proof, and CTA — then you export static HTML."}
            </p>

            {!advanced ? (
              <>
                <label className="sr-only" htmlFor="brief-field">
                  Describe your website idea
                </label>
                <textarea
                  id="brief-field"
                  rows={4}
                  value={idea}
                  placeholder="Phoenix mobile diesel repair — book a bay, see the service map, call from the hero"
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      void submit();
                    }
                  }}
                  autoFocus
                />
                <div className="example-chips" role="group" aria-label="Example briefs">
                  <span className="example-chips-label">Try a real brief</span>
                  {EXAMPLE_BRIEFS.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      className="chip"
                      data-testid={`chip-${ex.id}`}
                      onClick={() => {
                        setIdea(ex.idea);
                        setError(null);
                      }}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="adv-brief-grid">
                {(
                  [
                    ["productName", "Product name", "Desert Bay Diesel"],
                    ["tagline", "Tagline", "Mobile diesel repair across Phoenix metro"],
                    ["audience", "Audience", "Fleet managers in Maricopa County"],
                    ["tone", "Tone", "Straight talk, shop-floor"],
                    ["offer", "Offer", "Book a bay · service map · call from hero"],
                  ] as const
                ).map(([key, label, ph]) => (
                  <label key={key} className="field" htmlFor={`brief-${key}`}>
                    {label}
                    <input
                      id={key === "productName" ? "brief-field" : `brief-${key}`}
                      value={brief[key]}
                      placeholder={ph}
                      onChange={(e) =>
                        setBrief((b) => ({ ...b, [key]: e.target.value }))
                      }
                    />
                  </label>
                ))}
              </div>
            )}

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="create-actions">
              <button
                type="button"
                className="btn-ghost"
                disabled={loading}
                onClick={() => {
                  setError(null);
                  setAdvanced((v) => !v);
                }}
              >
                {advanced ? "Back to one prompt" : "Use five lines"}
              </button>
              <button
                type="button"
                className="btn-acid"
                data-testid="create-next"
                disabled={loading}
                onClick={() => void submit()}
              >
                {loading ? "Stamping…" : "Stamp landing"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
