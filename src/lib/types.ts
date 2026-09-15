export type SectionType =
  | "hero"
  | "features"
  | "social_proof"
  | "cta"
  | "faq"
  | "footer";

export interface SectionBase {
  id: string;
  type: SectionType;
  visible: boolean;
}

export interface HeroSection extends SectionBase {
  type: "hero";
  eyebrow: string;
  headline: string;
  subhead: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface FeaturesSection extends SectionBase {
  type: "features";
  heading: string;
  items: { title: string; body: string }[];
}

export interface SocialProofSection extends SectionBase {
  type: "social_proof";
  heading: string;
  quote: string;
  attribution: string;
}

export interface CtaSection extends SectionBase {
  type: "cta";
  heading: string;
  body: string;
  button: string;
}

export interface FaqSection extends SectionBase {
  type: "faq";
  heading: string;
  items: { q: string; a: string }[];
}

export interface FooterSection extends SectionBase {
  type: "footer";
  brand: string;
  note: string;
}

export type Section =
  | HeroSection
  | FeaturesSection
  | SocialProofSection
  | CtaSection
  | FaqSection
  | FooterSection;

export interface Brief {
  productName: string;
  tagline: string;
  audience: string;
  tone: string;
  offer: string;
}

export interface Project {
  id: string;
  title: string;
  brief: Brief;
  sections: Section[];
  theme: ThemeId;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ThemeId = "hot-metal" | "night-press" | "proof-sheet";

export interface ProjectRow {
  id: string;
  title: string;
  brief_json: string;
  sections_json: string;
  theme: string;
  is_sample: number;
  created_at: string;
  updated_at: string;
}
