"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Users, FileText, Store, Settings, BarChart3, CheckCircle, XCircle, Eye, Edit3, Trash2, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Listing {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface Business {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/admin/listings")
      .then((res) => res.json())
      .then((data) => setListings(data));

    fetch("/api/admin/businesses")
      .then((res) => res.json())
      .then((data) => setBusinesses(data));

    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">无权访问</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: BarChart3, label: "数据概览", value: "overview" },
    { icon: FileText, label: "信息管理", value: "listings" },
    { icon: Store, label: "商家管理", value: "businesses" },
    { icon: Users, label: "用户管理", value: "users" },
    { icon: Settings, label: "系统设置", value: "settings" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        currentCity=""
        onCityChange={() => {}}
        onSearch={() => {}}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-4 sticky top-24">
              <h2 className="text-lg font-bold mb-4">管理面板</h2>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.value
                        ? "bg-primary text-white"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              {activeTab === "overview" && (
                <>
                  <h2 className="text-xl font-bold mb-6">数据概览</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-primary/10 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">总信息数</p>
                      <p className="text-2xl font-bold text-primary">1,234</p>
                    </div>
                    <div className="bg-secondary/10 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">商家数</p>
                      <p className="text-2xl font-bold text-secondary">345</p>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">用户数</p>
                      <p className="text-2xl font-bold text-accent">5,678</p>
                    </div>
                    <div className="bg-destructive/10 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">待审核</p>
                      <p className="text-2xl font-bold text-destructive">23</p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "listings" && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">信息管理</h2>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg">
                      审核信息
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">标题</th>
                          <th className="text-left py-3 px-4 font-semibold">状态</th>
                          <th className="text-left py-3 px-4 font-semibold">创建时间</th>
                          <th className="text-right py-3 px-4 font-semibold">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listings.map((listing) => (
                          <tr key={listing.id} className="border-b border-border">
                            <td className="py-4 px-4">{listing.title}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                listing.status === "ACTIVE" ? "bg-secondary/10 text-secondary" :
                                listing.status === "PENDING" ? "bg-accent/10 text-accent" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {listing.status === "ACTIVE" ? "已发布" :
                                 listing.status === "PENDING" ? "待审核" : "已关闭"}
                              </span>
                            </td>
                            <td className="py-4 px-4">{new Date(listing.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 hover:bg-muted rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-muted rounded-lg">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === "businesses" && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">商家管理</h2>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg">
                      审核商家
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">商家名称</th>
                          <th className="text-left py-3 px-4 font-semibold">状态</th>
                          <th className="text-left py-3 px-4 font-semibold">创建时间</th>
                          <th className="text-right py-3 px-4 font-semibold">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {businesses.map((business) => (
                          <tr key={business.id} className="border-b border-border">
                            <td className="py-4 px-4">{business.name}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                business.status === "ACTIVE" ? "bg-secondary/10 text-secondary" :
                                business.status === "PENDING" ? "bg-accent/10 text-accent" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {business.status === "ACTIVE" ? "营业中" :
                                 business.status === "PENDING" ? "待审核" : "已关闭"}
                              </span>
                            </td>
                            <td className="py-4 px-4">{new Date(business.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 hover:bg-muted rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-muted rounded-lg">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === "users" && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">用户管理</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">用户名</th>
                          <th className="text-left py-3 px-4 font-semibold">邮箱</th>
                          <th className="text-left py-3 px-4 font-semibold">角色</th>
                          <th className="text-left py-3 px-4 font-semibold">状态</th>
                          <th className="text-right py-3 px-4 font-semibold">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-border">
                            <td className="py-4 px-4">{user.name}</td>
                            <td className="py-4 px-4">{user.email}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                user.role === "ADMIN" ? "bg-primary/10 text-primary" :
                                user.role === "BUSINESS" ? "bg-accent/10 text-accent" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {user.role === "ADMIN" ? "管理员" :
                                 user.role === "BUSINESS" ? "商家" : "普通用户"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {user.status === "ACTIVE" ? (
                                <span className="flex items-center gap-1 text-secondary">
                                  <CheckCircle className="w-4 h-4" />
                                  活跃
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-destructive">
                                  <XCircle className="w-4 h-4" />
                                  封禁
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 hover:bg-muted rounded-lg">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === "settings" && (
                <>
                  <h2 className="text-xl font-bold mb-6">系统设置</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <h3 className="font-semibold mb-2">网站标题</h3>
                      <input
                        type="text"
                        defaultValue="LifeHub - 本地生活服务平台"
                        className="w-full px-4 py-2 border border-border rounded-lg"
                      />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <h3 className="font-semibold mb-2">网站描述</h3>
                      <textarea
                        rows={3}
                        defaultValue="发现身边的精彩生活，汇聚本地优质服务"
                        className="w-full px-4 py-2 border border-border rounded-lg resize-none"
                      />
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg">
                      保存设置
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
