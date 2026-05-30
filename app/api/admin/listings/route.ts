import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";
import type { Listing } from "@prisma/client";

type ListingWithStatus = Listing & { status: { name: string } };

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权访问" },
        { status: 403 }
      );
    }

    const listings = await prisma.listing.findMany({
      include: {
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = (listings as ListingWithStatus[]).map((listing) => ({
      id: listing.id,
      title: listing.title,
      status: listing.status.name,
      createdAt: listing.createdAt,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "获取列表失败" },
      { status: 500 }
    );
  }
}
