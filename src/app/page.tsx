import Image from "next/image";
import { initDb, listProjects } from "@/lib/db";
import { CreateFlow } from "@/components/CreateFlow";
import { ProjectList } from "@/components/ProjectList";
import { InkShader } from "@/components/InkShader";
import { HeroReveal } from "@/components/transitions/HeroReveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await initDb();
  const projects = listProjects();

  return (
    <div className="home-shell">
      <div className="shader-stage" aria-hidden>
        <InkShader />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="reg-mark tl" src="/textures/reg-marks.svg" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="reg-mark br" src="/textures/reg-marks.svg" alt="" />

      <div className="ink-video" aria-hidden>
        <video autoPlay muted loop playsInline poster="/textures/press-block.svg">
          <source src="/textures/ink-loop.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="home-content">
        <header>
          <div className="brand-lockup">
            <Image src="/textures/ink-blot.svg" alt="" width={48} height={48} />
            <strong>Hot Metal Press</strong>
          </div>
          <p className="home-meta">
            <span>Mixo core loop</span>
            <span>Local SQLite</span>
            <span>Static export</span>
          </p>
          <HeroReveal
            title="Pull a proof, not a template"
            lede="Short brief in. Structured sections out. Edit on the desk, preview live, stamp HTML or ZIP. Single-user, private, no accounts."
          />
        </header>

        <section className="create-panel t-panel-slide" data-open="true" aria-label="Create from brief">
          <CreateFlow />
        </section>

        <ProjectList initial={projects} />

        <footer className="site-footer-mini">
          <span>Data: local SQLite · /tmp on Vercel (ephemeral) · export anytime</span>
          <span>Optional OPENAI_API_KEY · works offline without it</span>
        </footer>
      </div>
    </div>
  );
}
