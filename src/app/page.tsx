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
    <div className="home-shell home-shell--billboard home-shell--r2 home-shell--r3">
      <div className="acid-tape" aria-hidden>
        <span>MAKE-READY</span>
        <span>QUOIN LOCK</span>
        <span>HOT METAL</span>
        <span>PROOF DESK</span>
      </div>

      <ol className="job-ladder" aria-label="Product job in three steps">
        <li>
          <span className="job-n">1</span>
          <strong>Brief</strong>
          <em>One sentence</em>
        </li>
        <li className="job-arrow" aria-hidden>
          →
        </li>
        <li>
          <span className="job-n">2</span>
          <strong>Stamp landing</strong>
          <em>Editable sections</em>
        </li>
        <li className="job-arrow" aria-hidden>
          →
        </li>
        <li>
          <span className="job-n">3</span>
          <strong>Export HTML</strong>
          <em>Static files</em>
        </li>
      </ol>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="reg-mark tl" src="/textures/reg-marks.svg" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="reg-mark br" src="/textures/reg-marks.svg" alt="" />

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
            title={
              <>
                One brief.
                <br />
                A stamped page.
              </>
            }
            lede="Describe the business in one sentence. We stamp an editable landing — hero, features, proof, CTA — then you export static HTML. Print-shop desk for the Mixo job."
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
