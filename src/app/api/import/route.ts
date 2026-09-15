import { NextResponse } from "next/server";
import { createProject, initDb } from "@/lib/db";
import { importSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await initDb();
    const body = importSchema.parse(await req.json());
    const project = createProject({
      title: body.title,
      brief: body.brief,
      sections: body.sections,
      theme: body.theme,
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid import";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
