"use client";

import type { Section } from "@/lib/types";

type Props = {
  section: Section;
  onChange: (next: Section) => void;
};

export function SectionEditor({ section, onChange }: Props) {
  const set = (patch: Partial<Section>) =>
    onChange({ ...section, ...patch } as Section);

  return (
    <div className="section-editor">
      <div className="section-editor-head">
        <span className="mono-tag">{section.type.replace("_", " ")}</span>
        <label className="toggle">
          <input
            type="checkbox"
            checked={section.visible}
            onChange={(e) => set({ visible: e.target.checked })}
          />
          Visible
        </label>
      </div>

      {section.type === "hero" && (
        <>
          <Field label="Eyebrow" value={section.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <Field label="Headline" value={section.headline} onChange={(v) => set({ headline: v })} />
          <Field label="Subhead" value={section.subhead} onChange={(v) => set({ subhead: v })} rows={3} />
          <Field label="Primary CTA" value={section.primaryCta} onChange={(v) => set({ primaryCta: v })} />
          <Field label="Secondary CTA" value={section.secondaryCta} onChange={(v) => set({ secondaryCta: v })} />
        </>
      )}

      {section.type === "features" && (
        <>
          <Field label="Heading" value={section.heading} onChange={(v) => set({ heading: v })} />
          {section.items.map((item, i) => (
            <div key={i} className="nested-fields">
              <Field
                label={`Feature ${i + 1} title`}
                value={item.title}
                onChange={(v) => {
                  const items = section.items.slice();
                  items[i] = { ...items[i], title: v };
                  set({ items });
                }}
              />
              <Field
                label={`Feature ${i + 1} body`}
                value={item.body}
                rows={2}
                onChange={(v) => {
                  const items = section.items.slice();
                  items[i] = { ...items[i], body: v };
                  set({ items });
                }}
              />
            </div>
          ))}
        </>
      )}

      {section.type === "social_proof" && (
        <>
          <Field label="Heading" value={section.heading} onChange={(v) => set({ heading: v })} />
          <Field label="Quote" value={section.quote} rows={3} onChange={(v) => set({ quote: v })} />
          <Field label="Attribution" value={section.attribution} onChange={(v) => set({ attribution: v })} />
        </>
      )}

      {section.type === "cta" && (
        <>
          <Field label="Heading" value={section.heading} onChange={(v) => set({ heading: v })} />
          <Field label="Body" value={section.body} rows={2} onChange={(v) => set({ body: v })} />
          <Field label="Button" value={section.button} onChange={(v) => set({ button: v })} />
        </>
      )}

      {section.type === "faq" && (
        <>
          <Field label="Heading" value={section.heading} onChange={(v) => set({ heading: v })} />
          {section.items.map((item, i) => (
            <div key={i} className="nested-fields">
              <Field
                label={`Q${i + 1}`}
                value={item.q}
                onChange={(v) => {
                  const items = section.items.slice();
                  items[i] = { ...items[i], q: v };
                  set({ items });
                }}
              />
              <Field
                label={`A${i + 1}`}
                value={item.a}
                rows={2}
                onChange={(v) => {
                  const items = section.items.slice();
                  items[i] = { ...items[i], a: v };
                  set({ items });
                }}
              />
            </div>
          ))}
        </>
      )}

      {section.type === "footer" && (
        <>
          <Field label="Brand" value={section.brand} onChange={(v) => set({ brand: v })} />
          <Field label="Note" value={section.note} onChange={(v) => set({ note: v })} />
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows = 1,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {rows > 1 ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
