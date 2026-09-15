"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Brief } from "@/lib/types";
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
  useEffect(() => {
    setMounted(true);
  }, []);

  async function submit() {
    setError(null);
    const ideaLive = idea.trim();
    if (!advanced) {
      if (ideaLive.length < 12) {
        setError("Give at least one clear sentence about the page.");
        return;
      }
    } else {
      const missing = (Object.keys(empty) as (keyof Brief)[]).find((k) => !brief[k].trim());
      if (missing) {
        setError("Fill every advanced line, or switch back to the single idea box.");
        return;
      }
    }

    setLoading(true);
    setPressing(true);
    try {
      const body = advanced
        ? { brief }
        : { idea: ideaLive };
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-flow" aria-label="Create landing page from brief">
      <div className="press-meter" aria-hidden>
        <div className="press-meter-fill" style={{ width: pressing ? "100%" : "18%" }} />
        <span className="press-meter-label">
          {pressing ? "PULLING PROOF" : "ONE PROMPT"}
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
            <p className="step-kicker">One job · brief → stamped sections</p>
            <h2 id="create-label">
              {advanced ? "Five-line brief" : "What should this page sell?"}
            </h2>
            <p className="muted">
              {advanced
                ? "Name, promise, who it's for, tone, offer — then the same stamp."
                : "Same job as Mixo: one sentence → a page you can edit and export."}
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
              </>
            ) : (
              <div className="adv-brief-grid">
                {(
                  [
                    ["productName", "Product name", "Letterpress Co"],
                    ["tagline", "Tagline", "Proofs that feel printed"],
                    ["audience", "Audience", "Indie founders shipping one page"],
                    ["tone", "Tone", "Editorial, confident"],
                    ["offer", "Offer", "Brief → editable page → static export"],
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
                {loading ? "Pulling…" : "Pull proof"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
