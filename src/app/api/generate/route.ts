import { NextResponse } from "next/server";
import { briefSchema } from "@/lib/validation";
import { generateFromBrief } from "@/lib/generate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const brief = briefSchema.parse(await req.json());
    const result = await generateFromBrief(brief);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid brief";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
