import { NextResponse } from "next/server";
import { listProjects, createProject, initDb } from "@/lib/db";
import { briefSchema, themeSchema } from "@/lib/validation";
import { briefFromIdea, generateFromBrief, generateFromIdea } from "@/lib/generate";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  await initDb();
  return NextResponse.json({ projects: listProjects() });
}

const createSchema = z
  .object({
    idea: z.string().trim().min(12).max(800).optional(),
    brief: briefSchema.optional(),
    title: z.string().trim().min(1).max(120).optional(),
    theme: themeSchema.optional(),
  })
  .refine((v) => Boolean(v.idea || v.brief), {
    message: "Provide idea or brief",
  });

export async function POST(req: Request) {
  try {
    await initDb();
    const body = createSchema.parse(await req.json());
    const generated = body.idea
      ? await generateFromIdea(body.idea)
      : await generateFromBrief(body.brief!);
    const brief = generated.brief || body.brief || briefFromIdea(body.idea || "Untitled");
    const project = createProject({
      title: body.title || brief.productName,
      brief,
      sections: generated.sections,
      theme: body.theme || generated.theme,
    });
    return NextResponse.json({ project, meta: generated }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
