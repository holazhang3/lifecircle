import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("redirect" in auth && auth.redirect) {
    return NextResponse.redirect(auth.redirect.destination);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: { role: true, status: true },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count();

    return NextResponse.json({ users, total, page, limit });
  } catch {
    return NextResponse.json(
      { error: "获取用户列表失败" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { name, phone, avatar } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, phone, avatar },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
    });
  } catch {
    return NextResponse.json(
      { error: "更新用户信息失败" },
      { status: 500 }
    );
  }
}
