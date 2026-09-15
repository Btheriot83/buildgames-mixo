import { randomUUID } from "crypto";
import type { Brief, Section, ThemeId } from "./types";

export type GenerateResult = {
  sections: Section[];
  theme: ThemeId;
  mode: "local" | "llm";
  note: string;
};

function pickTheme(brief: Brief): ThemeId {
  const t = `${brief.tone} ${brief.audience}`.toLowerCase();
  if (t.includes("dark") || t.includes("night") || t.includes("bold")) {
    return "night-press";
  }
  if (t.includes("clean") || t.includes("minimal") || t.includes("print")) {
    return "proof-sheet";
  }
  return "hot-metal";
}

/** Local craft generator — works without any API key. */
export function generateLocal(brief: Brief): GenerateResult {
  const name = brief.productName.trim();
  const sections: Section[] = [
    {
      id: randomUUID(),
      type: "hero",
      visible: true,
      eyebrow: brief.tone.slice(0, 48),
      headline: brief.tagline,
      subhead: `${name} for ${brief.audience}. ${brief.offer}`,
      primaryCta: "Get started",
      secondaryCta: "See how it works",
    },
    {
      id: randomUUID(),
      type: "features",
      visible: true,
      heading: `Why ${name}`,
      items: [
        {
          title: "Built from a brief",
          body: `Start with what ${brief.audience} already know they need — not a blank canvas.`,
        },
        {
          title: "Editable formes",
          body: "Rewrite every section. Preview updates live. Keep the structure, change the ink.",
        },
        {
          title: "Export that ships",
          body: "Static HTML or ZIP. Host anywhere. No account required to leave with your work.",
        },
      ],
    },
    {
      id: randomUUID(),
      type: "social_proof",
      visible: true,
      heading: "Field note",
      quote: `${name} keeps the promise simple: ${brief.offer}`,
      attribution: `— written for ${brief.audience}`,
    },
    {
      id: randomUUID(),
      type: "cta",
      visible: true,
      heading: `Try ${name}`,
      body: brief.offer,
      button: "Pull a proof",
    },
    {
      id: randomUUID(),
      type: "faq",
      visible: true,
      heading: "Quick answers",
      items: [
        {
          q: `Who is ${name} for?`,
          a: brief.audience,
        },
        {
          q: "What do I get?",
          a: brief.offer,
        },
      ],
    },
    {
      id: randomUUID(),
      type: "footer",
      visible: true,
      brand: name,
      note: `${brief.tagline} · local draft`,
    },
  ];

  return {
    sections,
    theme: pickTheme(brief),
    mode: "local",
    note: "Generated with local templates (no API key). Set OPENAI_API_KEY for richer tone.",
  };
}

export async function generateFromBrief(brief: Brief): Promise<GenerateResult> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return generateLocal(brief);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You write landing page section JSON for a letterpress-styled builder. Return JSON with key sections: array of section objects matching types hero|features|social_proof|cta|faq|footer. Specific concrete copy only — no vague SaaS slogans, no fake stats, no emoji.",
          },
          {
            role: "user",
            content: JSON.stringify(brief),
          },
        ],
      }),
    });
    if (!res.ok) return generateLocal(brief);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return generateLocal(brief);
    const parsed = JSON.parse(raw) as { sections?: Section[] };
    if (!parsed.sections?.length) return generateLocal(brief);
    const withIds = parsed.sections.map((s) => ({
      ...s,
      id: s.id || randomUUID(),
      visible: s.visible !== false,
    }));
    return {
      sections: withIds as Section[],
      theme: pickTheme(brief),
      mode: "llm",
      note: "Generated with optional OpenAI key.",
    };
  } catch {
    return {
      ...generateLocal(brief),
      note: "LLM request failed — fell back to local templates.",
    };
  }
}
