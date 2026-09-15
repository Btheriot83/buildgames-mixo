import type { Project } from "./types";

/** Clearly labelled sample — safe to delete from the UI. */
export function getSampleProject(): Project {
  const now = new Date().toISOString();
  return {
    id: "sample-letterpress-co",
    title: "[SAMPLE] Letterpress Co — delete anytime",
    isSample: true,
    theme: "hot-metal",
    createdAt: now,
    updatedAt: now,
    brief: {
      productName: "Letterpress Co",
      tagline: "Proofs that feel printed, not generated",
      audience: "Indie founders shipping one sharp landing page",
      tone: "Editorial, confident, slightly mischievous",
      offer: "One prompt into a publishable page in minutes",
    },
    sections: [
      {
        id: "hero-1",
        type: "hero",
        visible: true,
        eyebrow: "Hot metal · cold storage",
        headline: "A page that looks pulled, not pasted",
        subhead:
          "One sentence in. Sections you can rewrite. Preview on the desk, then stamp HTML or ZIP and host it yourself.",
        primaryCta: "Start from a brief",
        secondaryCta: "Open the sample",
      },
      {
        id: "features-1",
        type: "features",
        visible: true,
        heading: "The press floor",
        items: [
          {
            title: "Brief → structure",
            body: "No blank canvas panic. One idea becomes hero, features, proof, and CTA.",
          },
          {
            title: "Edit the formes",
            body: "Rewrite copy section by section. Live preview tracks every keystroke.",
          },
          {
            title: "Stamp & export",
            body: "Static HTML or ZIP. Your files, your host. No account wall.",
          },
        ],
      },
      {
        id: "social-1",
        type: "social_proof",
        visible: true,
        heading: "From the shop floor",
        quote:
          "Finally a builder that looks like a studio tool instead of another purple dashboard.",
        attribution: "— A. Voss, indie operator (sample quote)",
      },
      {
        id: "cta-1",
        type: "cta",
        visible: true,
        heading: "Ready when the brief is",
        body: "No account wall. Leave with files.",
        button: "Write a brief",
      },
      {
        id: "footer-1",
        type: "footer",
        visible: true,
        brand: "Letterpress Co",
        note: "Sample project · Build Games Mixo replacement",
      },
    ],
  };
}
