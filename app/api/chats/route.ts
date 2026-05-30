import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { Chat } from "@prisma/client";

type ChatWithUsers = Chat & {
  user1: { id: string; name: string | null; avatar: string | null };
  user2: { id: string; name: string | null; avatar: string | null };
  messages: { content: string }[];
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { user1Id: user.id },
          { user2Id: user.id },
        ],
      },
      include: {
        user1: { select: { id: true, name: true, avatar: true } },
        user2: { select: { id: true, name: true, avatar: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedChats = (chats as ChatWithUsers[]).map((chat) => {
      const otherUser = chat.user1Id === user.id ? chat.user2 : chat.user1;
      return {
        id: chat.id,
        otherUser,
        lastMessage: chat.messages[0]?.content || "",
        updatedAt: chat.updatedAt,
      };
    });

    return NextResponse.json(formattedChats);
  } catch {
    return NextResponse.json(
      { error: "获取聊天列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { otherUserId, message } = await request.json();

    if (user.id === otherUserId) {
      return NextResponse.json(
        { error: "不能与自己聊天" },
        { status: 400 }
      );
    }

    const textType = await prisma.messageType.findUnique({
      where: { name: "TEXT" },
    });

    let chat = await prisma.chat.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: user.id,
          user2Id: otherUserId,
        },
      },
    });

    if (!chat) {
      try {
        chat = await prisma.chat.create({
          data: {
            user1Id: user.id,
            user2Id: otherUserId,
          },
        });
      } catch {
        chat = await prisma.chat.findUnique({
          where: {
            user1Id_user2Id: {
              user1Id: otherUserId,
              user2Id: user.id,
            },
          },
        });
      }
    }

    if (!chat) {
      return NextResponse.json(
        { error: "创建聊天失败" },
        { status: 500 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        content: message,
        typeId: textType?.id || "",
        userId: user.id,
        chatId: chat.id,
      },
    });

    await prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "发送消息失败" },
      { status: 500 }
    );
  }
}
