import Image from "next/image";
import { initDb, listProjects } from "@/lib/db";
import { getSampleProject } from "@/lib/sample";
import { CreateFlow } from "@/components/CreateFlow";
import { ProjectList } from "@/components/ProjectList";
import { PagePreview } from "@/components/PagePreview";
import { HeroReveal } from "@/components/transitions/HeroReveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await initDb();
  const projects = listProjects();
  const demoProof = projects.find((p) => p.isSample) ?? getSampleProject();

  return (
    <div className="home-shell home-shell--billboard home-shell--r2 home-shell--r3 home-shell--r4">
      <header className="top-bar top-bar--dream">
        <div className="top-bar-brand">
          <Image
            src="/textures/imagine/quoin-lock.png"
            alt=""
            width={36}
            height={36}
            className="brand-mark-img brand-mark-img--sm"
            priority
          />
          <strong>Hot Metal Press</strong>
        </div>
        <p className="job-crumb" aria-label="Product job">
          <span>Job</span>
          <span aria-hidden>→</span>
          <strong>Brief</strong>
          <span aria-hidden>→</span>
          <span>Stamped landing</span>
          <span aria-hidden>→</span>
          <span>Export HTML</span>
        </p>
      </header>

      <div className="billboard-stage">
        <div className="billboard-copy">
          <div className="brand-lockup brand-lockup--lg">
            <Image
              src="/textures/imagine/quoin-lock.png"
              alt=""
              width={72}
              height={72}
              className="brand-mark-img brand-mark-img--lg"
              priority
            />
            <div>
              <strong>Hot Metal Press</strong>
              <p className="home-meta">
                <span>Brief</span>
                <span>Stamp landing</span>
                <span>Export HTML</span>
              </p>
            </div>
          </div>

          <HeroReveal
            title={<>Describe the business in one sentence</>}
            lede="We stamp editable hero, features, proof, and CTA — then you export static HTML."
          />

          <section
            className="create-panel create-panel--billboard t-panel-slide"
            data-open="true"
            aria-label="Create from brief"
          >
            <CreateFlow />
          </section>
        </div>

        <aside className="billboard-materials" aria-label="Demo stamped landing">
          <div className="home-demo-preview">
            <div className="home-demo-preview-head">
              <span className="mono-tag">Demo proof on the bed</span>
              <strong>{demoProof.brief.productName}</strong>
              <em>{demoProof.brief.tagline}</em>
            </div>
            <div className="home-demo-preview-frame">
              <PagePreview project={demoProof} viewport="tablet" />
            </div>
          </div>
          <figure className="billboard-proof billboard-proof--compact">
            <Image
              src="/textures/imagine/proof-sheet.png"
              alt=""
              width={1200}
              height={900}
              className="home-proof-img"
              priority
            />
            <figcaption>Pulled proof · Imagine plate</figcaption>
          </figure>
        </aside>
      </div>

      <div className="home-content home-content--job">
        <ProjectList initial={projects} />
        <footer className="site-footer-mini">
          <span>SQLite on disk · ephemeral on the demo host · export keeps a copy</span>
          <span>Live model when a key is set · craft templates offline</span>
        </footer>
      </div>
    </div>
  );
}
