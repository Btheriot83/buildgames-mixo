import { NextResponse } from "next/server";
import { listProjects, createProject } from "@/lib/db";
import { briefSchema, themeSchema } from "@/lib/validation";
import { generateFromBrief } from "@/lib/generate";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ projects: listProjects() });
}

const createSchema = z.object({
  brief: briefSchema,
  title: z.string().trim().min(1).max(120).optional(),
  theme: themeSchema.optional(),
});

export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());
    const generated = await generateFromBrief(body.brief);
    const project = createProject({
      title: body.title || body.brief.productName,
      brief: body.brief,
      sections: generated.sections,
      theme: body.theme || generated.theme,
    });
    return NextResponse.json({ project, meta: generated }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
