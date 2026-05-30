"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryNav } from "@/components/category/CategoryNav";
import { ListingCard } from "@/components/card/ListingCard";
import { BusinessCard } from "@/components/card/BusinessCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, TrendingUp, Sparkles, Clock } from "lucide-react";

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
  user: { name: string; phone: string | null };
}

interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  images: string[];
  workingHours: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export default function HomePage() {
  const [currentCity, setCurrentCity] = useState("北京");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchListings();
    fetchBusinesses();
  }, [currentCity, selectedCategory]);

  const fetchListings = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/listings?city=${encodeURIComponent(currentCity)}${
        selectedCategory ? `&categoryId=${selectedCategory}` : ""
      }&limit=12`
    );
    const data = await response.json();
    setListings(data.listings || []);
    setLoading(false);
  };

  const fetchBusinesses = async () => {
    const response = await fetch(
      `/api/businesses?city=${encodeURIComponent(currentCity)}&limit=6`
    );
    const data = await response.json();
    setBusinesses(data.businesses || []);
  };

  const handleSearch = (keyword: string) => {
    router.push(`/listings?keyword=${encodeURIComponent(keyword)}&city=${encodeURIComponent(currentCity)}`);
  };

  const handleListingClick = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

  const handleBusinessClick = (businessId: string) => {
    router.push(`/business/${businessId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentCity={currentCity}
        onCityChange={setCurrentCity}
        onSearch={handleSearch}
      />
      
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 md:p-12">
            <div className="relative z-10 max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                发现{currentCity}的精彩生活
              </h1>
              <p className="text-white/80 text-base mb-6">
                汇聚本地优质服务，让您的生活更加便捷美好
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg"
                  onClick={() => router.push("/post")}
                >
                  发布信息
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 font-semibold"
                  onClick={() => router.push("/listings")}
                >
                  浏览分类
                </Button>
              </div>
            </div>
            <div className="absolute -right-32 -top-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -right-16 top-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          </div>
        </section>

        <section className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: "热门", count: "2.3万+" },
              { icon: Sparkles, label: "新发布", count: "1.2万+" },
              { icon: Clock, label: "今日", count: "500+" },
              { icon: ArrowRight, label: "更多", count: "" },
            ].map((item, index) => (
              <Card 
                key={index} 
                className="text-center p-5 hover:shadow-md transition-all duration-300 cursor-pointer bg-white border-0"
              >
                <CardContent className="p-0">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-indigo-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  {item.count && (
                    <p className="text-xs text-gray-500 mt-1">{item.count}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">最新发布</h2>
            <button 
              onClick={() => router.push(`/listings?city=${encodeURIComponent(currentCity)}`)}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
            >
              查看更多 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="aspect-[4/5] animate-pulse border-0 bg-gray-100">
                  <CardContent className="h-full p-4">
                    <div className="w-full h-36 bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => handleListingClick(listing.id)}
                  className="group"
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">优质商家</h2>
            <button 
              onClick={() => router.push(`/businesses?city=${encodeURIComponent(currentCity)}`)}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
            >
              查看更多 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                onClick={() => handleBusinessClick(business.id)}
                className="group"
              >
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">加入生活圈商家</h3>
                <p className="text-gray-600 mb-5">
                  免费入驻，获取更多曝光机会，连接更多潜在客户
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 font-semibold">
                  立即入驻
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                {[
                  { value: "5000+", label: "入驻商家" },
                  { value: "100万+", label: "日均访问" },
                  { value: "98%", label: "好评率" },
                ].map((item, index) => (
                  <div key={index}>
                    <p className="text-2xl font-bold text-indigo-600">{item.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}