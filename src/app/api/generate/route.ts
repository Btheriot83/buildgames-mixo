import { NextResponse } from "next/server";
import { briefSchema } from "@/lib/validation";
import { generateFromBrief, generateFromIdea } from "@/lib/generate";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.union([
  z.object({ brief: briefSchema }),
  z.object({ idea: z.string().trim().min(12).max(800) }),
]);

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const result =
      "idea" in body
        ? await generateFromIdea(body.idea)
        : await generateFromBrief(body.brief);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid brief";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
