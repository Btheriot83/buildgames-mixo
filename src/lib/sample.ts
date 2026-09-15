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
      offer: "Turn a 5-line brief into a publishable page in minutes",
    },
    sections: [
      {
        id: "hero-1",
        type: "hero",
        visible: true,
        eyebrow: "Hot metal · cold storage",
        headline: "Landing pages with ink still wet",
        subhead:
          "Brief in. Structured sections out. Edit like a proof sheet — then stamp export and ship static HTML.",
        primaryCta: "Pull a proof",
        secondaryCta: "See the forms",
      },
      {
        id: "features-1",
        type: "features",
        visible: true,
        heading: "The press floor",
        items: [
          {
            title: "Brief → structure",
            body: "No blank canvas panic. A short brief becomes hero, features, proof, CTA, FAQ.",
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
        heading: "Ready to pull ink?",
        body: "One brief. One page. Export and go.",
        button: "Start a proof",
      },
      {
        id: "faq-1",
        type: "faq",
        visible: true,
        heading: "Press FAQ",
        items: [
          {
            q: "Do I need an AI key?",
            a: "No. Local templates craft pages without an API. Optional OPENAI_API_KEY upgrades copy tone.",
          },
          {
            q: "Where is my data?",
            a: "SQLite on disk under ./data. Export anytime. Delete the sample when you are done.",
          },
        ],
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
