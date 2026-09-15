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
    <div className="home-shell">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="reg-mark tl" src="/textures/reg-marks.svg" alt="" />

      <div className="home-content home-content--job">
        <header className="home-header">
          <div className="brand-lockup">
            <Image
              src="/textures/imagine/quoin-lock.png"
              alt=""
              width={44}
              height={44}
              className="brand-mark-img"
            />
            <strong>Hot Metal Press</strong>
          </div>
          <p className="home-meta">
            <span>One prompt</span>
            <span>Stamped sections</span>
            <span>Export HTML</span>
          </p>
          <HeroReveal
            title="Write the brief. Pull the proof."
            lede="Type what the page is for. We lock hero, features, proof, and CTA you can edit — then stamp static HTML or a ZIP. Private desk. No accounts."
          />
        </header>

        <section className="create-panel t-panel-slide" data-open="true" aria-label="Create from brief">
          <CreateFlow />
        </section>

        <aside className="make-ready" aria-hidden>
          <div className="make-ready-still">
            <Image
              src="/textures/imagine/proof-sheet.png"
              alt=""
              width={640}
              height={480}
              className="home-proof-img"
            />
          </div>
          <div className="ink-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/textures/imagine/quoin-lock.png"
            >
              <source src="/textures/ink-loop.mp4" type="video/mp4" />
            </video>
            <p className="ink-video-caption">Make-ready · ink film</p>
          </div>
        </aside>

        <ProjectList initial={projects} />

        <footer className="site-footer-mini">
          <span>SQLite on disk · ephemeral on the demo host · export keeps a copy</span>
          <span>Live model when a key is set · craft templates offline</span>
        </footer>
      </div>
    </div>
  );
}
