import type { Project } from "./types";

/** Clearly labelled demo — Phoenix ops flavor, safe to delete from the UI. */
export function getSampleProject(): Project {
  const now = new Date().toISOString();
  return {
    id: "sample-desert-bay-diesel",
    title: "Desert Bay Diesel — Phoenix (demo · delete OK)",
    isSample: true,
    theme: "hot-metal",
    createdAt: now,
    updatedAt: now,
    brief: {
      productName: "Desert Bay Diesel",
      tagline: "Mobile diesel repair across Phoenix metro",
      audience: "Fleet managers and owner-operators in Maricopa County",
      tone: "Straight talk, shop-floor, no fluff",
      offer: "Book a bay, see the service map, call from the hero",
    },
    sections: [
      {
        id: "hero-1",
        type: "hero",
        visible: true,
        eyebrow: "Phoenix · Mesa · Chandler · Glendale",
        headline: "Diesel down? We come to the yard.",
        subhead:
          "Mobile bay for Class 6–8 and light commercial. Same-day diagnostics on I-10, Loop 101, and the East Valley — book online or call the shop line.",
        primaryCta: "Book a bay",
        secondaryCta: "Call (480) 555-0142",
      },
      {
        id: "features-1",
        type: "features",
        visible: true,
        heading: "What rolls out with the truck",
        items: [
          {
            title: "On-site diagnostics",
            body: "Scan tools, DEF system checks, and roadside injectors — we fix at your lot so the tractor stays in rotation.",
          },
          {
            title: "East Valley coverage",
            body: "Phoenix, Tempe, Mesa, Chandler, and Gilbert weekdays 6a–8p. After-hours triage for fleets on contract.",
          },
          {
            title: "Parts that match the ticket",
            body: "OEM-grade filters and sensors staged on the van. You see the estimate before the wrench turns.",
          },
        ],
      },
      {
        id: "social-1",
        type: "social_proof",
        visible: true,
        heading: "From a yard in Mesa",
        quote:
          "They hit our South Mesa lot before lunch, swapped the DEF pump, and had the unit back on the Loop by shift change.",
        attribution: "— R. Delgado, Delgado Produce Logistics (demo quote)",
      },
      {
        id: "cta-1",
        type: "cta",
        visible: true,
        heading: "Get the truck moving today",
        body: "Tell us the unit, the fault code, and the yard address. We text an ETA within the hour.",
        button: "Request a bay",
      },
      {
        id: "footer-1",
        type: "footer",
        visible: true,
        brand: "Desert Bay Diesel",
        note: "2324 W Van Buren St · Phoenix AZ 85009 · demo project · delete anytime",
      },
    ],
  };
}

/** Home example chips — real-looking AZ / ops briefs, not lorem. */
export const EXAMPLE_BRIEFS = [
  {
    id: "diesel",
    label: "Phoenix diesel",
    idea: "Phoenix mobile diesel repair — book a bay, see the East Valley service map, call from the hero",
  },
  {
    id: "hvac",
    label: "Tucson HVAC",
    idea: "Tucson residential HVAC — same-week AC tune-ups, financing CTA, service area covering Oro Valley and Marana",
  },
  {
    id: "catering",
    label: "Mesa catering",
    idea: "Mesa corporate catering for office parks — weekly lunch menus, allergy notes, order cutoff at 9am",
  },
] as const;
