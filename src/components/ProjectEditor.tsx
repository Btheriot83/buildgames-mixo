"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project, Section, ThemeId } from "@/lib/types";
import { SectionEditor } from "./SectionEditor";
import { PagePreview } from "./PagePreview";
import { StampOverlay } from "./StampOverlay";
import { THEMES } from "@/lib/themes";
import { SpinningCounter } from "./transitions/SpinningCounter";

export function ProjectEditor({ initial }: { initial: Project }) {
  const [project, setProject] = useState(initial);
  const [activeId, setActiveId] = useState(initial.sections[0]?.id || "");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [stamp, setStamp] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [errShake, setErrShake] = useState(false);
  const [restamping, setRestamping] = useState(false);

  const active = project.sections.find((s) => s.id === activeId) || project.sections[0];

  const persist = useCallback(
    async (next: Project) => {
      setSaving(true);
      setStatus("idle");
      try {
        const res = await fetch(`/api/projects/${next.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: next.title,
            brief: next.brief,
            sections: next.sections,
            theme: next.theme,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Save failed");
        setProject(data.project);
        setStatus("saved");
        setMessage("Chase locked");
        setSaveToast(true);
        window.setTimeout(() => setSaveToast(false), 1800);
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Save failed");
        setErrShake(true);
        window.setTimeout(() => setErrShake(false), 450);
      } finally {
        setSaving(false);
      }
    },
    []
  );

  useEffect(() => {
    if (status === "saved") {
      const t = setTimeout(() => setStatus("idle"), 1600);
      return () => clearTimeout(t);
    }
  }, [status]);

  function updateSection(next: Section) {
    const sections = project.sections.map((s) => (s.id === next.id ? next : s));
    setProject({ ...project, sections });
  }

  async function exportZip() {
    setMessage(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/export?format=zip`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title.replace(/[^\w.-]+/g, "-")}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStamp(true);
      setTimeout(() => setStamp(false), 1800);
      setMessage("ZIP stamped — check downloads");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Export failed");
    }
  }

  async function exportHtml() {
    setMessage(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/export?format=html`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title.replace(/[^\w.-]+/g, "-")}.html`;
      a.click();
      URL.revokeObjectURL(url);
      setStamp(true);
      setTimeout(() => setStamp(false), 1800);
      setMessage("HTML stamped — check downloads");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Export failed");
    }
  }

  async function exportJson() {
    const res = await fetch(`/api/projects/${project.id}/export?format=json`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/[^\w.-]+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }


  async function restampFromBrief() {
    setRestamping(true);
    setMessage(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: project.brief }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restamp failed");
      const next = {
        ...project,
        sections: data.sections,
        theme: data.theme || project.theme,
      };
      setProject(next);
      setActiveId(data.sections?.[0]?.id || "");
      await persist(next);
      setMessage(data.note || (data.mode === "llm" ? "Restamped with live model" : "Restamped with local templates"));
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Restamp failed");
    } finally {
      setRestamping(false);
    }
  }

  return (
    <div className={`editor-shell t-error-shake ${errShake ? "is-shaking" : ""}`}>
      <StampOverlay show={stamp} />
      <div className={`t-toast ${saveToast ? "is-open" : ""}`} role="status" style={{
        position: "fixed", bottom: "1.5rem", left: "50%", translate: "-50% 0",
        padding: "0.65rem 1.1rem", border: "2px solid var(--ink)", background: "var(--acid)",
        color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
        zIndex: 60, boxShadow: "4px 4px 0 var(--ink)"
      }}>Chase locked — desk saved</div>
      <header className="editor-top">
        <div>
          <p className="mono-tag">Proof desk · brief stamped · export ready</p>
          <input
            className="title-input"
            aria-label="Project title"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
          />
        </div>
        <div className="editor-top-actions">
          <p className="editor-job-pill" aria-hidden>
            Edit sections · Stamp HTML
          </p>
          <label className="field compact">
            <span>Theme</span>
            <select
              value={project.theme}
              onChange={(e) =>
                setProject({ ...project, theme: e.target.value as ThemeId })
              }
            >
              {(Object.keys(THEMES) as ThemeId[]).map((id) => (
                <option key={id} value={id}>
                  {THEMES[id].label}
                </option>
              ))}
            </select>
          </label>
          <div className="vp-toggle" role="group" aria-label="Preview width">
            {(["desktop", "tablet", "mobile"] as const).map((v) => (
              <button
                key={v}
                type="button"
                className={viewport === v ? "active" : ""}
                onClick={() => setViewport(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn-ghost"
            disabled={saving}
            onClick={() => void persist(project)}
          >
            {saving ? "Locking…" : "Save"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            disabled={restamping || saving}
            onClick={() => void restampFromBrief()}
          >
            {restamping ? "Restamping…" : "Restamp AI"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => void exportJson()}>
            JSON
          </button>
          <button type="button" className="btn-ghost" onClick={() => void exportZip()}>
            ZIP
          </button>
          <button
            type="button"
            className="btn-ink"
            data-testid="stamp-html"
            onClick={() => void exportHtml()}
          >
            Stamp HTML
          </button>
        </div>
      </header>

      {(message || status === "error") && (
        <p className={status === "error" ? "form-error banner" : "form-ok banner"} role="status">
          {message}
        </p>
      )}

      <div className="editor-grid">
        <aside className="section-rail" aria-label="Sections">
          <p className="rail-label">Sections</p>
          {project.sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`rail-item ${s.id === active?.id ? "active" : ""} ${s.visible ? "" : "dim"}`}
              onClick={() => setActiveId(s.id)}
            >
              <span className="rail-index"><SpinningCounter value={i + 1} pad={2} /></span>
              {s.type.replace("_", " ")}
            </button>
          ))}
          {active && (
            <SectionEditor
              section={active}
              onChange={updateSection}
            />
          )}
        </aside>
        <main className="preview-pane" aria-label="Live preview">
          <PagePreview project={project} viewport={viewport} />
        </main>
      </div>
    </div>
  );
}
