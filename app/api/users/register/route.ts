import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "请填写必填项" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "该邮箱已被注册" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await prisma.role.findUnique({
      where: { name: "USER" },
    });

    const userStatus = await prisma.userStatus.findUnique({
      where: { name: "ACTIVE" },
    });

    if (!userRole || !userStatus) {
      return NextResponse.json(
        { message: "系统配置错误" },
        { status: 500 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        roleId: userRole.id,
        statusId: userStatus.id,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch {
    return NextResponse.json(
      { message: "注册失败" },
      { status: 500 }
    );
  }
}
