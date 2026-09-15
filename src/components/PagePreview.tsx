"use client";

import type { CSSProperties } from "react";

import type { Project, Section } from "@/lib/types";
import { THEMES } from "@/lib/themes";

function SectionView({ section }: { section: Section }) {
  if (!section.visible) return null;
  switch (section.type) {
    case "hero":
      return (
        <section className="pv-hero">
          <div>
            <p className="pv-eyebrow">{section.eyebrow}</p>
            <h1>{section.headline}</h1>
            <p className="pv-sub">{section.subhead}</p>
            <div className="pv-actions">
              <span className="pv-btn-ink">{section.primaryCta}</span>
              <span className="pv-btn-line">{section.secondaryCta}</span>
            </div>
          </div>
          <figure className="pv-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/textures/press-block.svg" alt="" />
          </figure>
        </section>
      );
    case "features":
      return (
        <section className="pv-features">
          <h2>{section.heading}</h2>
          <div className="pv-rail">
            {section.items.map((item, i) => (
              <article key={i} style={{ marginLeft: i * 28 }}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      );
    case "social_proof":
      return (
        <section className="pv-proof">
          <p className="pv-eyebrow">{section.heading}</p>
          <blockquote>{section.quote}</blockquote>
          <cite>{section.attribution}</cite>
        </section>
      );
    case "cta":
      return (
        <section className="pv-cta">
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
          <span className="pv-btn-acid">{section.button}</span>
        </section>
      );
    case "faq":
      return (
        <section className="pv-faq">
          <h2>{section.heading}</h2>
          {section.items.map((item, i) => (
            <details key={i}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      );
    case "footer":
      return (
        <footer className="pv-footer">
          <strong>{section.brand}</strong>
          <span>{section.note}</span>
        </footer>
      );
  }
}

export function PagePreview({
  project,
  viewport = "desktop",
}: {
  project: Project;
  viewport?: "desktop" | "tablet" | "mobile";
}) {
  const theme = THEMES[project.theme];
  return (
    <div
      className={`page-preview vp-${viewport}`}
      style={
        {
          "--ink": theme.ink,
          "--bone": theme.bone,
          "--acid": theme.acid,
          "--rose": theme.rose,
          "--wine": theme.wine,
          "--slate": theme.slate,
          "--paper": theme.paper,
        } as CSSProperties
      }
    >
      <div className="page-preview-inner">
        {project.sections.map((s) => (
          <SectionView key={s.id} section={s} />
        ))}
      </div>
    </div>
  );
}
