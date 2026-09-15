import type { ThemeId } from "./types";

/** Aesthetic derived from openssl seed a42a65…dae278… (never shown in UI). */
export const THEMES: Record<
  ThemeId,
  {
    label: string;
    ink: string;
    bone: string;
    acid: string;
    rose: string;
    wine: string;
    slate: string;
    paper: string;
  }
> = {
  "hot-metal": {
    label: "Hot Metal Proof",
    ink: "#11131a",
    bone: "#f2ede3",
    acid: "#dae278",
    rose: "#9f5762",
    wine: "#591034",
    slate: "#2c2f36",
    paper: "#e8e2d6",
  },
  "night-press": {
    label: "Night Press",
    ink: "#f2ede3",
    bone: "#0e1016",
    acid: "#c8d94a",
    rose: "#c47a84",
    wine: "#8a1a4a",
    slate: "#9aa0ae",
    paper: "#161922",
  },
  "proof-sheet": {
    label: "Proof Sheet",
    ink: "#1a1814",
    bone: "#f7f3ea",
    acid: "#b8c93a",
    rose: "#a85d66",
    wine: "#3d1a28",
    slate: "#45423a",
    paper: "#efe9dc",
  },
};

export function themeCssVars(id: ThemeId): string {
  const t = THEMES[id];
  return [
    `--ink:${t.ink}`,
    `--bone:${t.bone}`,
    `--acid:${t.acid}`,
    `--rose:${t.rose}`,
    `--wine:${t.wine}`,
    `--slate:${t.slate}`,
    `--paper:${t.paper}`,
  ].join(";");
}
