import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";
import type { Business } from "@prisma/client";

type BusinessWithStatus = Business & { status: { name: string } };

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权访问" },
        { status: 403 }
      );
    }

    const businesses = await prisma.business.findMany({
      include: {
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = (businesses as BusinessWithStatus[]).map((business) => ({
      id: business.id,
      name: business.name,
      status: business.status.name,
      createdAt: business.createdAt,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "获取列表失败" },
      { status: 500 }
    );
  }
}
