import { z } from "zod";

export const briefSchema = z.object({
  productName: z.string().trim().min(1).max(80),
  tagline: z.string().trim().min(1).max(160),
  audience: z.string().trim().min(1).max(160),
  tone: z.string().trim().min(1).max(80),
  offer: z.string().trim().min(1).max(240),
});

export const themeSchema = z.enum(["hot-metal", "night-press", "proof-sheet"]);

const sectionBase = {
  id: z.string().min(1).max(64),
  visible: z.boolean(),
};

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    ...sectionBase,
    type: z.literal("hero"),
    eyebrow: z.string().max(80),
    headline: z.string().max(160),
    subhead: z.string().max(320),
    primaryCta: z.string().max(40),
    secondaryCta: z.string().max(40),
  }),
  z.object({
    ...sectionBase,
    type: z.literal("features"),
    heading: z.string().max(120),
    items: z
      .array(
        z.object({
          title: z.string().max(80),
          body: z.string().max(240),
        })
      )
      .max(6),
  }),
  z.object({
    ...sectionBase,
    type: z.literal("social_proof"),
    heading: z.string().max(120),
    quote: z.string().max(400),
    attribution: z.string().max(120),
  }),
  z.object({
    ...sectionBase,
    type: z.literal("cta"),
    heading: z.string().max(120),
    body: z.string().max(240),
    button: z.string().max(40),
  }),
  z.object({
    ...sectionBase,
    type: z.literal("faq"),
    heading: z.string().max(120),
    items: z
      .array(
        z.object({
          q: z.string().max(160),
          a: z.string().max(400),
        })
      )
      .max(8),
  }),
  z.object({
    ...sectionBase,
    type: z.literal("footer"),
    brand: z.string().max(80),
    note: z.string().max(200),
  }),
]);

export const projectUpdateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  brief: briefSchema.optional(),
  sections: z.array(sectionSchema).min(1).max(12).optional(),
  theme: themeSchema.optional(),
});

export const importSchema = z.object({
  title: z.string().trim().min(1).max(120),
  brief: briefSchema,
  sections: z.array(sectionSchema).min(1).max(12),
  theme: themeSchema.default("hot-metal"),
});
