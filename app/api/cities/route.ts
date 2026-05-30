import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 默认城市数据
const DEFAULT_CITIES = [
  { id: "1", name: "北京", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", name: "上海", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "3", name: "广州", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "4", name: "深圳", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "5", name: "杭州", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
    });
    // 如果数据库没有数据，返回默认数据
    if (cities.length === 0) {
      return NextResponse.json(DEFAULT_CITIES);
    }
    return NextResponse.json(cities);
  } catch {
    // 如果数据库连接失败，返回默认数据
    return NextResponse.json(DEFAULT_CITIES);
  }
}
