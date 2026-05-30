import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 默认商家数据
const DEFAULT_BUSINESSES = [
  { id: "1", name: "美味餐厅", description: "地道美食，新鲜食材，环境优雅，服务周到。", address: "北京市朝阳区建国路 88 号", phone: "010-88888888", rating: 4.8, reviewCount: 126, images: ["https://picsum.photos/800/600?random=10"], workingHours: "10:00 - 22:00", tags: ["美食", "中餐", "特色菜"], categoryId: "4", cityId: "1", statusId: "1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", name: "阳光咖啡", description: "现磨咖啡，精致甜点，安静舒适的休闲空间。", address: "上海市徐汇区衡山路 123 号", phone: "021-66666666", rating: 4.6, reviewCount: 89, images: ["https://picsum.photos/800/600?random=11"], workingHours: "08:00 - 20:00", tags: ["咖啡", "甜点", "休闲"], categoryId: "4", cityId: "2", statusId: "1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "3", name: "健身工作室", description: "专业健身指导，完善的器材设施，让你拥有健康体魄。", address: "广州市天河区体育西路 456 号", phone: "020-55555555", rating: 4.7, reviewCount: 156, images: ["https://picsum.photos/800/600?random=12"], workingHours: "07:00 - 21:00", tags: ["健身", "运动", "塑形"], categoryId: "4", cityId: "3", statusId: "1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const cityId = searchParams.get("cityId");
    const city = searchParams.get("city");
    const keyword = searchParams.get("keyword");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    const activeStatus = await prisma.businessStatus.findUnique({
      where: { name: "ACTIVE" },
    });

    const where: Record<string, unknown> = {
      statusId: activeStatus?.id,
    };

    if (categoryId && categoryId !== "") {
      where.categoryId = categoryId;
    }

    if (cityId && cityId !== "") {
      where.cityId = cityId;
    } else if (city && city !== "") {
      const foundCity = await prisma.city.findUnique({
        where: { name: city },
      });
      if (foundCity) {
        where.cityId = foundCity.id;
      }
    }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    const businesses = await prisma.business.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.business.count({ where });

    return NextResponse.json({ businesses, total, page, limit });
  } catch {
    // 如果数据库连接失败，返回默认数据
    return NextResponse.json({ 
      businesses: DEFAULT_BUSINESSES, 
      total: DEFAULT_BUSINESSES.length, 
      page: 1, 
      limit: 20 
    });
  }
}
