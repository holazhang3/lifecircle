import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../lib/auth";

export async function GET(request: Request) {
  const urlParts = request.url.split("/");
  const chatId = urlParts[urlParts.length - 2];

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId || "" },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "聊天不存在" },
        { status: 404 }
      );
    }

    if (chat.user1Id !== user.id && chat.user2Id !== user.id) {
      return NextResponse.json(
        { error: "无权访问" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { chatId: chatId || "" },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch {
    return NextResponse.json(
      { error: "获取消息失败" },
      { status: 500 }
    );
  }
}
