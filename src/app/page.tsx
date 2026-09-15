import Image from "next/image";
import { initDb, listProjects } from "@/lib/db";
import { CreateFlow } from "@/components/CreateFlow";
import { ProjectList } from "@/components/ProjectList";
import { HeroReveal } from "@/components/transitions/HeroReveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await initDb();
  const projects = listProjects();

  return (
    <div className="home-shell home-shell--billboard">
      <div className="acid-tape" aria-hidden>
        <span>MAKE-READY</span>
        <span>QUOIN LOCK</span>
        <span>HOT METAL</span>
        <span>PROOF DESK</span>
      </div>

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
                <span>One prompt</span>
                <span>Stamped sections</span>
                <span>Export HTML</span>
              </p>
            </div>
          </div>

          <HeroReveal
            title={
              <>
                Write the brief.
                <br />
                Pull the proof.
              </>
            }
            lede="Type what the page is for. We lock hero, features, proof, and CTA you can edit — then stamp static HTML or a ZIP."
          />

          <section
            className="create-panel create-panel--billboard t-panel-slide"
            data-open="true"
            aria-label="Create from brief"
          >
            <CreateFlow />
          </section>
        </div>

        <aside className="billboard-materials" aria-hidden>
          <figure className="billboard-proof">
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
          <div className="ink-video ink-video--billboard">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/textures/imagine/quoin-lock.png"
            >
              <source src="/textures/ink-loop.mp4" type="video/mp4" />
            </video>
            <p className="ink-video-caption">Ink film · make-ready loop</p>
          </div>
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
