// 简化版 Redis 客户端
// 在 Vercel 免费环境中我们不依赖真实 Redis
// 使用内存存储作为降级方案

const memoryStore = new Map<string, string>();

export const redis = {
  isReady: true,
  connect: async () => Promise.resolve(),
  on: () => {},
  get: async (key: string) => memoryStore.get(key) || null,
  set: async (key: string, value: string) => {
    memoryStore.set(key, value);
    return "OK";
  },
  del: async (key: string) => memoryStore.delete(key) ? 1 : 0,
  exists: async (key: string) => memoryStore.has(key) ? 1 : 0,
};

export async function connectRedis() {
  return redis;
}
