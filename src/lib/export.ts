import JSZip from "jszip";
import type { Project, Section, ThemeId } from "./types";
import { themeCssVars } from "./themes";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSection(section: Section): string {
  if (!section.visible) return "";
  switch (section.type) {
    case "hero":
      return `<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">${esc(section.eyebrow)}</p>
    <h1>${esc(section.headline)}</h1>
    <p class="sub">${esc(section.subhead)}</p>
    <div class="actions">
      <a class="btn-ink" href="#cta">${esc(section.primaryCta)}</a>
      <a class="btn-line" href="#features">${esc(section.secondaryCta)}</a>
    </div>
  </div>
  <figure class="hero-figure">
    <img src="assets/press-block.svg" alt="" width="640" height="480"/>
  </figure>
</section>`;
    case "features":
      return `<section id="features" class="features">
  <h2>${esc(section.heading)}</h2>
  <div class="feature-rail">
    ${section.items
      .map(
        (item, i) => `<article class="feature" data-i="${i}">
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.body)}</p>
    </article>`
      )
      .join("\n")}
  </div>
</section>`;
    case "social_proof":
      return `<section class="proof">
  <p class="proof-label">${esc(section.heading)}</p>
  <blockquote>${esc(section.quote)}</blockquote>
  <cite>${esc(section.attribution)}</cite>
</section>`;
    case "cta":
      return `<section id="cta" class="cta-band">
  <h2>${esc(section.heading)}</h2>
  <p>${esc(section.body)}</p>
  <a class="btn-acid" href="#">${esc(section.button)}</a>
</section>`;
    case "faq":
      return `<section class="faq">
  <h2>${esc(section.heading)}</h2>
  ${section.items
    .map(
      (item) => `<details>
    <summary>${esc(item.q)}</summary>
    <p>${esc(item.a)}</p>
  </details>`
    )
    .join("\n")}
</section>`;
    case "footer":
      return `<footer>
  <strong>${esc(section.brand)}</strong>
  <span>${esc(section.note)}</span>
</footer>`;
  }
}

export function renderStaticHtml(project: Project): string {
  const body = project.sections.map(renderSection).filter(Boolean).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(project.title)}</title>
<style>
:root{${themeCssVars(project.theme)};--font-display:Georgia,"Times New Roman",serif;--font-mono:ui-monospace,Menlo,Consolas,monospace}
*{box-sizing:border-box}body{margin:0;background:var(--bone);color:var(--ink);font-family:var(--font-display);line-height:1.45}
body::before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.35;background-image:url(assets/paper-grain.svg);mix-blend-mode:multiply}
.wrap{max-width:1120px;margin:0 auto;padding:48px 24px 80px;position:relative}
.hero{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:end;min-height:70vh;border-bottom:2px solid var(--ink);padding-bottom:48px}
.eyebrow{font-family:var(--font-mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--rose);margin:0 0 16px}
h1{font-size:clamp(2.6rem,6vw,4.6rem);line-height:.95;margin:0 0 20px;letter-spacing:-.02em;max-width:12ch}
.sub{font-size:1.15rem;max-width:36ch;color:var(--slate)}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.btn-ink,.btn-acid{display:inline-block;padding:14px 22px;background:var(--ink);color:var(--bone);text-decoration:none;font-family:var(--font-mono);font-size:13px;letter-spacing:.04em;text-transform:uppercase}
.btn-acid{background:var(--acid);color:var(--ink)}
.btn-line{display:inline-block;padding:14px 22px;border:1.5px solid var(--ink);text-decoration:none;font-family:var(--font-mono);font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink)}
.hero-figure{justify-self:end;border:2px solid var(--ink);box-shadow:12px 12px 0 var(--acid)}
.hero-figure img{display:block;max-width:100%;height:auto}
.features{padding:64px 0;display:grid;grid-template-columns:280px 1fr;gap:40px}
.features h2{font-size:2rem;margin:0;position:sticky;top:24px;align-self:start}
.feature-rail{display:flex;flex-direction:column;gap:0}
.feature{border-top:1px solid var(--ink);padding:28px 0 28px 24px;display:grid;grid-template-columns:1fr;gap:8px}
.feature[data-i="1"]{margin-left:48px}.feature[data-i="2"]{margin-left:96px}
.feature h3{margin:0;font-size:1.35rem}.feature p{margin:0;color:var(--slate);max-width:42ch}
.proof{padding:72px 0;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);background:var(--paper)}
.proof-label{font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--rose)}
blockquote{font-size:clamp(1.6rem,3vw,2.4rem);margin:16px 0;max-width:22ch;line-height:1.15}
cite{font-style:normal;font-family:var(--font-mono);font-size:12px;color:var(--slate)}
.cta-band{padding:72px 0;display:grid;gap:16px;max-width:28ch}
.cta-band h2{font-size:2.4rem;margin:0;line-height:1}
.faq{padding:48px 0}.faq details{border-top:1px solid var(--ink);padding:16px 0}
.faq summary{cursor:pointer;font-weight:600}.faq p{color:var(--slate)}
footer{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:32px;border-top:2px solid var(--ink);font-family:var(--font-mono);font-size:12px}
@media(max-width:800px){.hero,.features{grid-template-columns:1fr}.feature[data-i="1"],.feature[data-i="2"]{margin-left:0}.hero-figure{justify-self:stretch}}
</style>
</head>
<body data-theme="${project.theme}">
<div class="wrap">
${body}
</div>
</body>
</html>`;
}

export async function buildExportZip(project: Project): Promise<Buffer> {
  const zip = new JSZip();
  zip.file("index.html", renderStaticHtml(project));
  zip.file(
    "project.json",
    JSON.stringify(
      {
        title: project.title,
        brief: project.brief,
        sections: project.sections,
        theme: project.theme,
      },
      null,
      2
    )
  );
  const assets = zip.folder("assets");
  const fs = await import("fs");
  const path = await import("path");
  const tex = path.join(process.cwd(), "public", "textures");
  for (const name of ["paper-grain.svg", "press-block.svg", "reg-marks.svg", "ink-blot.svg"]) {
    const p = path.join(tex, name);
    if (fs.existsSync(p)) assets!.file(name, fs.readFileSync(p));
  }
  const out = await zip.generateAsync({ type: "nodebuffer" });
  return out;
}

export function projectToImportJson(project: Project) {
  return {
    title: project.title,
    brief: project.brief,
    sections: project.sections,
    theme: project.theme as ThemeId,
  };
}
