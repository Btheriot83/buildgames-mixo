import { NextResponse } from "next/server";
import { getProject, initDb } from "@/lib/db";
import { buildExportZip, renderStaticHtml, projectToImportJson } from "@/lib/export";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  await initDb();
  const { id } = await ctx.params;
  const project = getProject(id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "zip";

  if (format === "html") {
    const html = renderStaticHtml(project);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${project.title.replace(/[^\w.-]+/g, "-")}.html"`,
      },
    });
  }

  if (format === "json") {
    return NextResponse.json(projectToImportJson(project), {
      headers: {
        "Content-Disposition": `attachment; filename="${project.title.replace(/[^\w.-]+/g, "-")}.json"`,
      },
    });
  }

  const zip = await buildExportZip(project);
  return new NextResponse(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${project.title.replace(/[^\w.-]+/g, "-")}.zip"`,
    },
  });
}
