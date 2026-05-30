"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryNav } from "@/components/category/CategoryNav";
import { ListingCard } from "@/components/card/ListingCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Filter, ArrowDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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

function ListingsContent() {
  const [currentCity, setCurrentCity] = useState("北京");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showFilter, setShowFilter] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    const urlCity = searchParams.get("city");
    const urlCategory = searchParams.get("categoryId");
    
    if (urlKeyword) setKeyword(urlKeyword);
    if (urlCity) setCurrentCity(urlCity);
    if (urlCategory) setSelectedCategory(urlCategory);
    
    fetchListings();
  }, [page, selectedCategory, keyword, priceMin, priceMax, sortBy]);

  const fetchListings = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      city: currentCity,
      page: page.toString(),
      limit: "20",
      sortBy,
      sortOrder: "desc",
    });
    
    if (selectedCategory) params.set("categoryId", selectedCategory);
    if (keyword) params.set("keyword", keyword);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    
    const response = await fetch(`/api/listings?${params}`);
    const data = await response.json();
    setListings(data.listings || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
    setPage(1);
    router.push(`/listings?keyword=${encodeURIComponent(searchKeyword)}&city=${encodeURIComponent(currentCity)}`);
  };

  const handleListingClick = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

  const handleFilter = () => {
    setPage(1);
    fetchListings();
  };

  const handleResetFilter = () => {
    setPriceMin("");
    setPriceMax("");
    setSortBy("createdAt");
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/50">
      <Header
        currentCity={currentCity}
        onCityChange={setCurrentCity}
        onSearch={handleSearch}
      />
      
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {keyword ? `搜索 "${keyword}"` : "全部信息"}
          </h1>
          <p className="text-muted-foreground">
            共找到 {total} 条相关信息
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索标题或描述..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === "Enter" && handleFilter()}
            />
          </div>
          <Button onClick={handleFilter} className="whitespace-nowrap">
            <Search className="w-4 h-4 mr-2" />
            搜索
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{currentCity}</span>
            </div>
            {selectedCategory && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full whitespace-nowrap">
                分类筛选
              </span>
            )}
            {priceMin || priceMax ? (
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full whitespace-nowrap">
                价格筛选
              </span>
            ) : null}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                showFilter ? "bg-primary text-white border-primary" : "hover:bg-muted"
              )}
            >
              <Filter className="w-4 h-4" />
              筛选
            </button>
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <span className="text-sm">排序:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm focus:outline-none"
              >
                <option value="createdAt">最新发布</option>
                <option value="price">价格从低到高</option>
                <option value="-price">价格从高到低</option>
                <option value="views">最多浏览</option>
              </select>
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="bg-white rounded-xl p-4 mb-6 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">最低价格</label>
                <Input
                  type="number"
                  placeholder="最低价格"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">最高价格</label>
                <Input
                  type="number"
                  placeholder="最高价格"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  应用筛选
                </Button>
                <Button variant="outline" onClick={handleResetFilter}>
                  重置
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="w-full h-32 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => handleListingClick(listing.id)}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">未找到相关信息</h3>
            <p className="text-muted-foreground mb-4">
              尝试调整搜索条件或筛选条件
            </p>
            <Button onClick={() => {
              setKeyword("");
              setSelectedCategory(null);
              setPage(1);
            }}>
              清除筛选
            </Button>
          </div>
        )}

        {!loading && total > 20 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              上一页
            </Button>
            <span className="text-sm">
              第 {page} 页 / 共 {Math.ceil(total / 20)} 页
            </span>
            <Button
              variant="outline"
              disabled={page >= Math.ceil(total / 20)}
              onClick={() => setPage(page + 1)}
            >
              下一页
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
