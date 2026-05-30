import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const id = request.url.split("/").pop();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: id || "" },
      include: {
        user1: { select: { id: true, name: true, avatar: true } },
        user2: { select: { id: true, name: true, avatar: true } },
        messages: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "聊天不存在" }, { status: 404 });
    }

    if (chat.user1Id !== user.id && chat.user2Id !== user.id) {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    const otherUser = chat.user1Id === user.id ? chat.user2 : chat.user1;

    await prisma.message.updateMany({
      where: {
        chatId: id || "",
        userId: { not: user.id },
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ chat, otherUser });
  } catch {
    return NextResponse.json(
      { error: "获取聊天详情失败" },
      { status: 500 }
    );
  }
}
