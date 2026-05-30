import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 默认分类数据
const DEFAULT_CATEGORIES = [
  { id: "1", name: "招聘求职", icon: "briefcase", sortOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", name: "房屋租赁", icon: "home", sortOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "3", name: "二手交易", icon: "shopping-bag", sortOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "4", name: "本地商家", icon: "store", sortOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "5", name: "家政服务", icon: "users", sortOrder: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "6", name: "搬家维修", icon: "wrench", sortOrder: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "7", name: "宠物服务", icon: "paw", sortOrder: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "8", name: "教育培训", icon: "book-open", sortOrder: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "9", name: "同城活动", icon: "calendar", sortOrder: 9, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
    // 如果数据库没有数据，返回默认数据
    if (categories.length === 0) {
      return NextResponse.json(DEFAULT_CATEGORIES);
    }
    return NextResponse.json(categories);
  } catch {
    // 如果数据库连接失败，返回默认数据
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}
