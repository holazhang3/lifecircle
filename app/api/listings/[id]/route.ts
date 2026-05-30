import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const id = request.url.split("/").pop();
  
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: id || "" },
      include: {
        category: true,
        city: true,
        user: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "信息不存在" }, { status: 404 });
    }

    await prisma.listing.update({
      where: { id: id || "" },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(listing);
  } catch {
    return NextResponse.json(
      { error: "获取信息失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const id = request.url.split("/").pop();
  
  try {
    const deleted = await prisma.listing.delete({
      where: { id: id || "" },
    });
    return NextResponse.json(deleted);
  } catch {
    return NextResponse.json(
      { error: "删除失败" },
      { status: 500 }
    );
  }
}
