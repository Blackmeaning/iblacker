import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      prompt: true,
      mode: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ projects });
}