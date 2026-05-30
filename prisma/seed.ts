import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("test123", 10);

  const roleAdmin = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "管理员" },
  });

  const roleUser = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER", description: "普通用户" },
  });

  const roleBusiness = await prisma.role.upsert({
    where: { name: "BUSINESS" },
    update: {},
    create: { name: "BUSINESS", description: "商家用户" },
  });

  const statusActive = await prisma.userStatus.upsert({
    where: { name: "ACTIVE" },
    update: {},
    create: { name: "ACTIVE", description: "活跃" },
  });

  await prisma.userStatus.upsert({
    where: { name: "INACTIVE" },
    update: {},
    create: { name: "INACTIVE", description: "非活跃" },
  });

  await prisma.userStatus.upsert({
    where: { name: "BANNED" },
    update: {},
    create: { name: "BANNED", description: "封禁" },
  });

  const listingStatusActive = await prisma.listingStatus.upsert({
    where: { name: "ACTIVE" },
    update: {},
    create: { name: "ACTIVE", description: "发布中" },
  });

  await prisma.listingStatus.upsert({
    where: { name: "SOLD" },
    update: {},
    create: { name: "SOLD", description: "已成交" },
  });

  await prisma.listingStatus.upsert({
    where: { name: "EXPIRED" },
    update: {},
    create: { name: "EXPIRED", description: "已过期" },
  });

  await prisma.listingStatus.upsert({
    where: { name: "DELETED" },
    update: {},
    create: { name: "DELETED", description: "已删除" },
  });

  const businessStatusActive = await prisma.businessStatus.upsert({
    where: { name: "ACTIVE" },
    update: {},
    create: { name: "ACTIVE", description: "营业中" },
  });

  await prisma.businessStatus.upsert({
    where: { name: "CLOSED" },
    update: {},
    create: { name: "CLOSED", description: "已关闭" },
  });

  await prisma.businessStatus.upsert({
    where: { name: "PENDING" },
    update: {},
    create: { name: "PENDING", description: "待审核" },
  });

  await prisma.businessStatus.upsert({
    where: { name: "REJECTED" },
    update: {},
    create: { name: "REJECTED", description: "已拒绝" },
  });

  await prisma.messageType.upsert({
    where: { name: "TEXT" },
    update: {},
    create: { name: "TEXT", description: "文本消息" },
  });

  await prisma.messageType.upsert({
    where: { name: "IMAGE" },
    update: {},
    create: { name: "IMAGE", description: "图片消息" },
  });

  await prisma.messageType.upsert({
    where: { name: "FILE" },
    update: {},
    create: { name: "FILE", description: "文件消息" },
  });

  const cityBeijing = await prisma.city.upsert({
    where: { name: "北京" },
    update: {},
    create: { name: "北京", nameEn: "Beijing", province: "北京", latitude: 39.9042, longitude: 116.4074, population: 21893095 },
  });

  await prisma.city.upsert({
    where: { name: "上海" },
    update: {},
    create: { name: "上海", nameEn: "Shanghai", province: "上海", latitude: 31.2304, longitude: 121.4737, population: 24870895 },
  });

  await prisma.city.upsert({
    where: { name: "广州" },
    update: {},
    create: { name: "广州", nameEn: "Guangzhou", province: "广东", latitude: 23.1291, longitude: 113.2644, population: 18676605 },
  });

  await prisma.city.upsert({
    where: { name: "深圳" },
    update: {},
    create: { name: "深圳", nameEn: "Shenzhen", province: "广东", latitude: 22.5431, longitude: 114.0579, population: 17560061 },
  });

  await prisma.city.upsert({
    where: { name: "杭州" },
    update: {},
    create: { name: "杭州", nameEn: "Hangzhou", province: "浙江", latitude: 30.2741, longitude: 120.1552, population: 12204039 },
  });

  await prisma.city.upsert({
    where: { name: "成都" },
    update: {},
    create: { name: "成都", nameEn: "Chengdu", province: "四川", latitude: 30.5728, longitude: 104.0668, population: 21192000 },
  });

  const catJobs = await prisma.category.upsert({
    where: { name: "招聘求职" },
    update: {},
    create: { name: "招聘求职", nameEn: "Jobs", icon: "briefcase", sortOrder: 1 },
  });

  const catHousing = await prisma.category.upsert({
    where: { name: "房屋租赁" },
    update: {},
    create: { name: "房屋租赁", nameEn: "Housing", icon: "home", sortOrder: 2 },
  });

  const catSecondhand = await prisma.category.upsert({
    where: { name: "二手交易" },
    update: {},
    create: { name: "二手交易", nameEn: "Secondhand", icon: "shopping-bag", sortOrder: 3 },
  });

  const catBusinesses = await prisma.category.upsert({
    where: { name: "本地商家" },
    update: {},
    create: { name: "本地商家", nameEn: "Businesses", icon: "users", sortOrder: 4 },
  });

  await prisma.category.upsert({
    where: { name: "家政服务" },
    update: {},
    create: { name: "家政服务", nameEn: "Housekeeping", icon: "users", sortOrder: 5 },
  });

  await prisma.category.upsert({
    where: { name: "搬家维修" },
    update: {},
    create: { name: "搬家维修", nameEn: "MovingRepair", icon: "wrench", sortOrder: 6 },
  });

  await prisma.category.upsert({
    where: { name: "宠物服务" },
    update: {},
    create: { name: "宠物服务", nameEn: "Pets", icon: "paw-print", sortOrder: 7 },
  });

  await prisma.category.upsert({
    where: { name: "教育培训" },
    update: {},
    create: { name: "教育培训", nameEn: "Education", icon: "graduation-cap", sortOrder: 8 },
  });

  await prisma.category.upsert({
    where: { name: "同城活动" },
    update: {},
    create: { name: "同城活动", nameEn: "Events", icon: "calendar", sortOrder: 9 },
  });

  await prisma.user.upsert({
    where: { email: "admin@lifehub.com" },
    update: {},
    create: {
      name: "管理员",
      email: "admin@lifehub.com",
      password: adminPassword,
      roleId: roleAdmin.id,
      statusId: statusActive.id,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "test@lifehub.com" },
    update: {},
    create: {
      name: "测试用户",
      email: "test@lifehub.com",
      password: userPassword,
      phone: "13800138000",
      roleId: roleUser.id,
      statusId: statusActive.id,
    },
  });

  await prisma.listing.upsert({
    where: { id: "test-listing-1" },
    update: {},
    create: {
      id: "test-listing-1",
      title: "全新iPhone 15 Pro 256G 蓝色",
      description: "全新未拆封，官网购买，有发票，支持验机。因换机闲置出售，价格可议。",
      price: 6500,
      originalPrice: 8999,
      unit: "元",
      location: "北京市朝阳区望京SOHO",
      latitude: 39.9962,
      longitude: 116.4704,
      images: ["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=iPhone%2015%20Pro%20smartphone%20blue%20color%20on%20white%20background&image_size=square"],
      isNegotiable: true,
      isUrgent: false,
      statusId: listingStatusActive.id,
      userId: testUser.id,
      categoryId: catSecondhand.id,
      cityId: cityBeijing.id,
    },
  });

  await prisma.business.upsert({
    where: { id: "test-business-1" },
    update: {},
    create: {
      id: "test-business-1",
      name: "美味餐厅",
      description: "提供正宗川菜，环境优雅，服务周到。招牌菜：水煮鱼、回锅肉、麻婆豆腐。",
      address: "北京市朝阳区三里屯太古里北区",
      phone: "010-12345678",
      email: "info@meiwei.com",
      website: "https://www.meiwei.com",
      images: ["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20restaurant%20interior%20modern%20design%20warm%20lighting&image_size=landscape_16_9"],
      workingHours: "11:00-22:00",
      rating: 4.8,
      reviewCount: 328,
      tags: ["川菜", "聚餐", "家庭聚会"],
      statusId: businessStatusActive.id,
      userId: testUser.id,
      categoryId: catBusinesses.id,
      cityId: cityBeijing.id,
    },
  });

  await prisma.listing.upsert({
    where: { id: "test-job-1" },
    update: {},
    create: {
      id: "test-job-1",
      title: "前端开发工程师",
      description: "负责公司产品的前端开发，要求3年以上React/Next.js经验，熟悉TypeScript。",
      price: 25000,
      unit: "元/月",
      location: "北京市海淀区中关村",
      latitude: 39.9842,
      longitude: 116.3074,
      images: [],
      isNegotiable: true,
      isUrgent: false,
      statusId: listingStatusActive.id,
      userId: testUser.id,
      categoryId: catJobs.id,
      cityId: cityBeijing.id,
    },
  });

  await prisma.listing.upsert({
    where: { id: "test-house-1" },
    update: {},
    create: {
      id: "test-house-1",
      title: "望京SOHO附近精装两居",
      description: "南北通透，采光好，家具家电齐全，紧邻地铁14号线，生活便利。",
      price: 5500,
      unit: "元/月",
      location: "北京市朝阳区望京",
      latitude: 39.9952,
      longitude: 116.4694,
      images: ["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20apartment%20interior%20living%20room%20bright%20sunlight&image_size=landscape_16_9"],
      isNegotiable: false,
      isUrgent: true,
      statusId: listingStatusActive.id,
      userId: testUser.id,
      categoryId: catHousing.id,
      cityId: cityBeijing.id,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
