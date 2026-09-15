import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/db";
import { getSampleProject } from "@/lib/sample";

export const runtime = "nodejs";

export async function POST() {
  const existing = listProjects().find((p) => p.isSample);
  if (existing) return NextResponse.json({ project: existing });
  const sample = getSampleProject();
  const project = createProject({
    title: sample.title,
    brief: sample.brief,
    sections: sample.sections,
    theme: sample.theme,
    isSample: true,
  });
  return NextResponse.json({ project }, { status: 201 });
}
