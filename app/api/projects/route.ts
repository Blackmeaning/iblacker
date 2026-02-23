import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        prompt: true,
        mode: true,
        result: true,
      },
    });

    return NextResponse.json({ projects });
  } catch (e: any) {
    return NextResponse.json(
      { error: "projects_fetch_failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}