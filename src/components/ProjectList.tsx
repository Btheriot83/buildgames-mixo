"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export function ProjectList({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setProjects(initial);
    setOpen(false);
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, [initial]);

  async function remove(id: string) {
    setError(null);
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete");
      return;
    }
    setProjects((p) => p.filter((x) => x.id !== id));
  }

  async function onImport(file: File) {
    setError(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      router.push(`/projects/${data.project.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    }
  }

  if (projects.length === 0) {
    return (
      <div className="empty-state t-panel-slide" data-open={open ? "true" : "false"}>
        <div className="empty-state-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/textures/imagine/empty-type.png" alt="" />
        </div>
        <h2>Nothing on the bed yet</h2>
        <p>Describe an idea above to stamp your first landing — or import a JSON proof.</p>
        <label className="btn-ghost file-btn">
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImport(f);
            }}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="project-list t-panel-slide" data-open={open ? "true" : "false"}>
      <div className="list-head">
        <h2>Proofs on the bed</h2>
        <label className="btn-ghost file-btn">
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImport(f);
            }}
          />
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/projects/${p.id}`} className="project-card">
              <span className="mono-tag">{p.isSample ? "SAMPLE" : p.theme}</span>
              <strong>{p.title}</strong>
              <em>{p.brief.tagline}</em>
            </Link>
            <button type="button" className="btn-ghost danger" onClick={() => void remove(p.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
