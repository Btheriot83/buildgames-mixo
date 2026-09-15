import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, initDb } from "@/lib/db";
import { ProjectEditor } from "@/components/ProjectEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  await initDb();
  const project = getProject(id);
  if (!project) notFound();

  return (
    <>
      <div style={{ padding: "10px 24px", borderBottom: "1px solid #11131a", fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>
        <Link href="/">← Press floor</Link>
      </div>
      <ProjectEditor initial={project} />
    </>
  );
}
