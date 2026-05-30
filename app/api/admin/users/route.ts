import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";
import type { User } from "@prisma/client";

type UserWithRoleStatus = User & { role: { name: string }; status: { name: string } };

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "无权访问" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        role: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = (users as UserWithRoleStatus[]).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role.name,
      status: u.status.name,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "获取用户列表失败" },
      { status: 500 }
    );
  }
}
