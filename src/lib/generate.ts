import { randomUUID } from "crypto";
import type { Brief, Section, ThemeId } from "./types";

export type GenerateResult = {
  sections: Section[];
  theme: ThemeId;
  mode: "local" | "llm";
  provider?: string;
  note: string;
  brief?: Brief;
};

function pickTheme(brief: Brief): ThemeId {
  const t = `${brief.tone} ${brief.audience} ${brief.tagline}`.toLowerCase();
  if (t.includes("dark") || t.includes("night") || t.includes("bold") || t.includes("noir")) {
    return "night-press";
  }
  if (t.includes("clean") || t.includes("minimal") || t.includes("print") || t.includes("paper")) {
    return "proof-sheet";
  }
  return "hot-metal";
}

/** Expand a freeform Mixo-style idea into a structured brief (local heuristic). */
export function briefFromIdea(idea: string): Brief {
  const clean = idea.replace(/\s+/g, " ").trim();
  const first = clean.split(/[.!?]/)[0]?.trim() || clean;
  const words = first.split(" ").filter(Boolean);
  const productName =
    words.slice(0, Math.min(4, Math.max(2, words.length))).join(" ").replace(/[^a-zA-Z0-9 &+-]/g, "").trim() ||
    "Untitled Press";
  return {
    productName: productName.slice(0, 80),
    tagline: first.slice(0, 160),
    audience: "Founders and small teams who need a sharp one-page site",
    tone: "Clear, concrete, editorial",
    offer: clean.slice(0, 240),
  };
}

/** Local craft generator — works without any API key. No FAQ filler by default. */
export function generateLocal(brief: Brief): GenerateResult {
  const name = brief.productName.trim();
  const sections: Section[] = [
    {
      id: randomUUID(),
      type: "hero",
      visible: true,
      eyebrow: brief.tone.slice(0, 48) || "Proof sheet",
      headline: brief.tagline,
      subhead: `Made for ${brief.audience}. ${brief.offer}`,
      primaryCta: "Start here",
      secondaryCta: "Read the sheet",
    },
    {
      id: randomUUID(),
      type: "features",
      visible: true,
      heading: `What ${name} locks in`,
      items: [
        {
          title: "Starts from your words",
          body: `The brief you typed is the spine — written for ${brief.audience}, not a blank canvas.`,
        },
        {
          title: "Sections you can rewrite",
          body: "Change any line on the desk. The preview tracks the proof as you edit.",
        },
        {
          title: "Files you can take",
          body: "Stamp HTML or ZIP and host it yourself. Nothing held behind an account.",
        },
      ],
    },
    {
      id: randomUUID(),
      type: "social_proof",
      visible: true,
      heading: "Shop note",
      quote: brief.offer,
      attribution: `— drafted for ${brief.audience}`,
    },
    {
      id: randomUUID(),
      type: "cta",
      visible: true,
      heading: `Put ${name} to work`,
      body: `Next step for ${brief.audience}: act on the promise above.`,
      button: "Continue",
    },
    {
      id: randomUUID(),
      type: "footer",
      visible: true,
      brand: name,
      note: `${brief.tagline}`,
    },
  ];

  return {
    sections,
    theme: pickTheme(brief),
    mode: "local",
    note: "Generated with local templates (no API key). Set XAI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_AUTH_TOKEN for richer tone.",
  };
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You write landing page section JSON for a letterpress-styled site builder called Hot Metal Press.
Return ONLY JSON with this shape:
{
  "brief": { "productName": "", "tagline": "", "audience": "", "tone": "", "offer": "" },
  "sections": [ ... ]
}
Section types allowed: hero, features, social_proof, cta, footer.
Optional faq only if the brief truly needs it — prefer omitting FAQ.
Rules:
- Concrete, specific copy grounded in the brief. No vague SaaS slogans.
- No fake stats, no emoji, no "10K+ users", no Trustpilot theater.
- hero needs: eyebrow, headline, subhead, primaryCta, secondaryCta
- features needs: heading, items[{title,body}] (2-4 items, asymmetric not identical filler)
- social_proof needs: heading, quote, attribution (honest sample voice, not fake celebrity)
- cta needs: heading, body, button
- footer needs: brand, note
- Every section needs visible: true and a string id
- Do not invent compliance claims or network effects`;

async function chatCompletionsOpenAICompat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[]
): Promise<string | null> {
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  } as const;

  const attempt = async (withFormat: boolean) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 55_000);
    try {
      const body: Record<string, unknown> = {
        model,
        temperature: 0.55,
        messages,
      };
      if (withFormat) body.response_format = { type: "json_object" };
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return data.choices?.[0]?.message?.content ?? null;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  return (await attempt(true)) || (await attempt(false));
}

async function chatAnthropicCompat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[]
): Promise<string | null> {
  const system = messages.find((m) => m.role === "system")?.content || SYSTEM_PROMPT;
  const userMessages = messages.filter((m) => m.role !== "system");
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${apiKey}`,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.65,
      system,
      messages: userMessages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text;
  return text ?? null;
}

function parseLlmPayload(raw: string, fallbackBrief: Brief): GenerateResult | null {
  let parsed: { sections?: Section[]; brief?: Brief };
  try {
    // Strip accidental markdown fences
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    parsed = JSON.parse(cleaned) as { sections?: Section[]; brief?: Brief };
  } catch {
    return null;
  }
  if (!parsed.sections?.length) return null;
  const brief = parsed.brief && parsed.brief.productName ? { ...fallbackBrief, ...parsed.brief } : fallbackBrief;
  const withIds = parsed.sections
    .filter((s) => s && s.type)
    .map((s) => ({
      ...s,
      id: s.id || randomUUID(),
      visible: s.visible !== false,
    })) as Section[];
  if (!withIds.length) return null;
  return {
    sections: withIds,
    theme: pickTheme(brief),
    mode: "llm",
    brief,
    note: "Generated via live LLM API.",
  };
}

type ProviderAttempt = {
  name: string;
  run: () => Promise<string | null>;
};

function providerAttempts(userPayload: string): ProviderAttempt[] {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPayload },
  ];
  const attempts: ProviderAttempt[] = [];
  const seen = new Set<string>();

  const pushOpenAICompat = (
    name: string,
    baseUrl: string,
    apiKey: string,
    model: string
  ) => {
    const fingerprint = `${name}:${baseUrl}:${model}:${apiKey.slice(0, 4)}`;
    if (seen.has(fingerprint)) return;
    seen.add(fingerprint);
    attempts.push({
      name,
      run: () => chatCompletionsOpenAICompat(baseUrl, apiKey, model, messages),
    });
  };

  const shared = process.env.BUILD_GAMES_LLM_API_KEY?.trim();
  // LLM.md: prefer xAI if key looks like xai-, else OpenAI-compatible
  if (shared?.startsWith("xai-")) {
    pushOpenAICompat(
      "build-games-xai",
      "https://api.x.ai/v1",
      shared,
      process.env.XAI_MODEL || process.env.GROK_MODEL || "grok-4.6"
    );
  } else if (shared && process.env.OPENAI_BASE_URL?.trim() && !process.env.OPENAI_API_KEY?.trim()) {
    pushOpenAICompat(
      "build-games-llm",
      process.env.OPENAI_BASE_URL,
      shared,
      process.env.OPENAI_MODEL || "gpt-4o-mini"
    );
  }

  const xai = process.env.XAI_API_KEY?.trim() || process.env.GROK_API_KEY?.trim();
  if (xai) {
    pushOpenAICompat(
      "xai",
      "https://api.x.ai/v1",
      xai,
      process.env.XAI_MODEL || process.env.GROK_MODEL || "grok-4.6"
    );
  }

  const openai = process.env.OPENAI_API_KEY?.trim();
  if (openai) {
    pushOpenAICompat(
      "openai",
      process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      openai,
      process.env.OPENAI_MODEL || "gpt-4o-mini"
    );
  }

  const anthropic =
    process.env.ANTHROPIC_AUTH_TOKEN?.trim() || process.env.ANTHROPIC_API_KEY?.trim();
  if (anthropic) {
    const base = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
    const model = process.env.ANTHROPIC_MODEL || "glm-5.3";
    attempts.push({
      name: "anthropic",
      run: () => chatAnthropicCompat(base, anthropic, model, messages),
    });
  }

  return attempts;
}

export async function generateFromBrief(brief: Brief): Promise<GenerateResult> {
  const attempts = providerAttempts(JSON.stringify({ brief }));
  for (const attempt of attempts) {
    try {
      const raw = await attempt.run();
      if (!raw) continue;
      const parsed = parseLlmPayload(raw, brief);
      if (parsed) {
        return {
          ...parsed,
          provider: attempt.name,
          note: `Generated with ${attempt.name}.`,
        };
      }
    } catch {
      // try next provider
    }
  }
  return generateLocal(brief);
}

/** One-shot Mixo path: freeform idea → brief + stamped sections. */
export async function generateFromIdea(idea: string): Promise<GenerateResult> {
  const seed = briefFromIdea(idea);
  const attempts = providerAttempts(
    JSON.stringify({
      idea,
      hint: "Expand this one-sentence website idea into brief + stamped landing sections.",
    })
  );
  for (const attempt of attempts) {
    try {
      const raw = await attempt.run();
      if (!raw) continue;
      const parsed = parseLlmPayload(raw, seed);
      if (parsed) {
        return {
          ...parsed,
          provider: attempt.name,
          note: `Generated from idea via ${attempt.name}.`,
          brief: parsed.brief || seed,
        };
      }
    } catch {
      // next
    }
  }
  const local = generateLocal(seed);
  return { ...local, brief: seed, note: local.note + " (from idea)" };
}
