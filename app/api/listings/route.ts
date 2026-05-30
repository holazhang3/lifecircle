import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// 默认列表数据
const DEFAULT_LISTINGS = [
  { id: "1", title: "精装两居室出租，地铁旁", description: "位于市中心，交通便利，周边配套设施齐全，拎包入住。", price: 3500, originalPrice: 3800, unit: "元/月", location: "北京市朝阳区", images: ["https://picsum.photos/800/600?random=1"], isNegotiable: true, isUrgent: false, views: 156, createdAt: new Date(Date.now() - 86400000).toISOString(), categoryId: "2", cityId: "1", userId: "1", statusId: "1", category: { id: "2", name: "房屋租赁" }, city: { id: "1", name: "北京" }, user: { id: "1", name: "张先生", phone: "138****1234" } },
  { id: "2", title: "前端开发工程师招聘", description: "招聘前端开发工程师，要求有 React 经验，福利待遇优厚。", price: 20000, originalPrice: null, unit: "元/月", location: "北京市海淀区", images: ["https://picsum.photos/800/600?random=2"], isNegotiable: false, isUrgent: true, views: 234, createdAt: new Date(Date.now() - 172800000).toISOString(), categoryId: "1", cityId: "1", userId: "2", statusId: "1", category: { id: "1", name: "招聘求职" }, city: { id: "1", name: "北京" }, user: { id: "2", name: "李女士", phone: "139****5678" } },
  { id: "3", title: "二手 iPhone 14 Pro Max", description: "九成新，无划痕，原装配件齐全，低价出售。", price: 5999, originalPrice: 8999, unit: "元", location: "上海市浦东新区", images: ["https://picsum.photos/800/600?random=3"], isNegotiable: true, isUrgent: false, views: 456, createdAt: new Date(Date.now() - 259200000).toISOString(), categoryId: "3", cityId: "2", userId: "3", statusId: "1", category: { id: "3", name: "二手交易" }, city: { id: "2", name: "上海" }, user: { id: "3", name: "王先生", phone: "137****9012" } },
  { id: "4", title: "家政保洁服务", description: "专业家政服务，经验丰富，价格合理，服务周到。", price: 80, originalPrice: null, unit: "元/小时", location: "广州市天河区", images: ["https://picsum.photos/800/600?random=4"], isNegotiable: true, isUrgent: false, views: 123, createdAt: new Date(Date.now() - 345600000).toISOString(), categoryId: "5", cityId: "3", userId: "4", statusId: "1", category: { id: "5", name: "家政服务" }, city: { id: "3", name: "广州" }, user: { id: "4", name: "刘阿姨", phone: "136****3456" } },
  { id: "5", title: "专业搬家服务", description: "专业搬家团队，安全可靠，价格透明，欢迎咨询。", price: 300, originalPrice: null, unit: "元/次", location: "深圳市南山区", images: ["https://picsum.photos/800/600?random=5"], isNegotiable: false, isUrgent: false, views: 89, createdAt: new Date(Date.now() - 432000000).toISOString(), categoryId: "6", cityId: "4", userId: "5", statusId: "1", category: { id: "6", name: "搬家维修" }, city: { id: "4", name: "深圳" }, user: { id: "5", name: "赵师傅", phone: "135****7890" } },
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
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");

    const skip = (page - 1) * limit;

    const activeStatus = await prisma.listingStatus.findUnique({
      where: { name: "ACTIVE" },
    });

    const where: Record<string, unknown> = {
      statusId: activeStatus?.id,
    };
    const priceFilter: Record<string, number> = {};

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
        { title: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    if (priceMin) {
      priceFilter.gte = parseFloat(priceMin);
    }

    if (priceMax) {
      priceFilter.lte = parseFloat(priceMax);
    }

    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
    }

    const listings = await prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        city: true,
        user: { select: { name: true, phone: true } },
      },
    });

    const total = await prisma.listing.count({ where });

    return NextResponse.json({ listings, total, page, limit });
  } catch {
    // 如果数据库连接失败，返回默认数据
    return NextResponse.json({ 
      listings: DEFAULT_LISTINGS, 
      total: DEFAULT_LISTINGS.length, 
      page: 1, 
      limit: 20 
    });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const {
      title,
      description,
      price,
      originalPrice,
      unit,
      location,
      images,
      isNegotiable,
      isUrgent,
      categoryId,
      cityId,
    } = await request.json();

    const activeStatus = await prisma.listingStatus.findUnique({
      where: { name: "ACTIVE" },
    });

    if (!activeStatus) {
      return NextResponse.json(
        { error: "系统配置错误" },
        { status: 500 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        originalPrice,
        unit: unit || "",
        location: location || "",
        images: images || [],
        isNegotiable: isNegotiable || false,
        isUrgent: isUrgent || false,
        statusId: activeStatus.id,
        userId: user.id,
        categoryId,
        cityId,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "发布失败" },
      { status: 500 }
    );
  }
}
