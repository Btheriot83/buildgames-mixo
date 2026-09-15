import { NextResponse } from "next/server";
import { deleteProject, getProject, updateProject, initDb } from "@/lib/db";
import { projectUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  await initDb();
  const { id } = await ctx.params;
  const project = getProject(id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(req: Request, ctx: Ctx) {
  await initDb();
  const { id } = await ctx.params;
  try {
    const patch = projectUpdateSchema.parse(await req.json());
    const project = updateProject(id, patch);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  await initDb();
  const { id } = await ctx.params;
  const ok = deleteProject(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
