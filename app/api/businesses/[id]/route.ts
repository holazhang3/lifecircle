import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const id = request.url.split("/").pop();
  
  try {
    const business = await prisma.business.findUnique({
      where: { id: id || "" },
      include: {
        category: true,
        city: true,
        user: { select: { name: true, phone: true } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!business) {
      return NextResponse.json({ error: "商家不存在" }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch {
    return NextResponse.json(
      { error: "获取商家信息失败" },
      { status: 500 }
    );
  }
}
