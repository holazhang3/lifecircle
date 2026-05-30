"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { ListingCard } from "../../components/card/ListingCard";
import { User, Settings, Heart, FileText, MessageCircle, LogOut, Edit3, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | null;
  originalPrice: number | null;
  unit: string;
  location: string;
  images: string[];
  isNegotiable: boolean;
  isUrgent: boolean;
  views: number;
  createdAt: string;
  category: { name: string };
  city: { name: string };
  user: { name: string; phone: string };
}

interface Favorite {
  id: string;
  listing: Listing;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch(`/api/listings?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setListings(data.listings));

      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => setFavorites(data));
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">请先登录</p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            立即登录
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: FileText, label: "我的发布", value: "listings" },
    { icon: Heart, label: "我的收藏", value: "favorites" },
    { icon: MessageCircle, label: "消息中心", value: "messages" },
    { icon: Settings, label: "账号设置", value: "settings" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        currentCity=""
        onCityChange={() => {}}
        onSearch={() => {}}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex items-center gap-6">
            {session.user.avatar ? (
              <img
                src={session.user.avatar}
                alt={session.user.name || ""}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{session.user.name}</h1>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                  编辑
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {session.user.email}
                </span>
                {session.user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {session.user.phone}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-4">
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

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              {activeTab === "listings" && (
                <>
                  <h2 className="text-xl font-bold mb-6">我的发布</h2>
                  {listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {listings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">暂无发布</h3>
                      <p className="text-muted-foreground">去发布第一条信息吧</p>
                      <button
                        onClick={() => (window.location.href = "/post")}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
                      >
                        发布信息
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeTab === "favorites" && (
                <>
                  <h2 className="text-xl font-bold mb-6">我的收藏</h2>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favorites.map((favorite) => (
                        <ListingCard
                          key={favorite.id}
                          listing={favorite.listing}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">暂无收藏</h3>
                      <p className="text-muted-foreground">去收藏喜欢的信息吧</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "messages" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">暂无消息</h3>
                  <p className="text-muted-foreground">开始与他人聊天吧</p>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">账号设置</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5" />
                        <span>昵称</span>
                      </div>
                      <span className="text-muted-foreground">{session.user.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5" />
                        <span>邮箱</span>
                      </div>
                      <span className="text-muted-foreground">{session.user.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5" />
                        <span>手机号</span>
                      </div>
                      <span className="text-muted-foreground">{session.user.phone || "未绑定"}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <span>身份</span>
                      </div>
                      <span className="text-muted-foreground">
                        {session.user.role === "ADMIN" ? "管理员" : "普通用户"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
