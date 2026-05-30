"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Heart, MapPin, Phone, Clock, Eye, ChevronLeft, ChevronRight, MessageCircle, Share2, Flag } from "lucide-react";
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
  latitude: number | null;
  longitude: number | null;
  images: string[];
  isNegotiable: boolean;
  isUrgent: boolean;
  views: number;
  createdAt: string;
  category: { id: string; name: string };
  city: { id: string; name: string };
  user: { id: string; name: string; phone: string | null };
}

export default function ListingDetailPage() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    setLoading(true);
    const response = await fetch(`/api/listings/${params.id}`);
    if (response.ok) {
      const data = await response.json();
      setListing(data);
    } else {
      router.push("/404");
    }
    setLoading(false);
  };

  const formatPrice = () => {
    if (!listing?.price) return "价格面议";
    const unit = listing.unit || "";
    if (listing.originalPrice && listing.originalPrice > listing.price) {
      return (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {listing.price.toLocaleString()}
          </span>
          <span className="text-lg text-muted-foreground">{unit}</span>
          <span className="text-lg line-through text-muted-foreground">
            {listing.originalPrice.toLocaleString()}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-primary">
          {listing.price.toLocaleString()}
        </span>
        <span className="text-lg text-muted-foreground">{unit}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrevImage = () => {
    if (listing && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (listing && currentImageIndex < listing.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl p-4 animate-pulse">
                <div className="w-full h-80 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">信息不存在或已被删除</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/50">
      <Header
        currentCity={listing.city.name}
        onCityChange={() => {}}
        onSearch={() => {}}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          返回
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={listing.images[currentImageIndex] || "/placeholder-image.svg"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/70"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {listing.images.length > 1 && (
                <CardContent className="p-4">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors",
                          index === currentImageIndex
                            ? "border-primary"
                            : "border-transparent hover:border-muted"
                        )}
                      >
                        <img
                          src={image}
                          alt={`${listing.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {listing.isUrgent && (
                        <span className="px-2 py-1 bg-destructive text-white text-xs rounded-full">
                          急售
                        </span>
                      )}
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {listing.category.name}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {listing.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(listing.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      isFavorite
                        ? "bg-red-500 text-white"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                  </button>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">详细描述</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">位置信息</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{listing.city.name} - {listing.location}</span>
                  </div>
                  {listing.latitude && listing.longitude && (
                    <div className="mt-4 h-48 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">地图加载中...</p>
                    </div>
                  )}
                </div>

                {listing.isNegotiable && (
                  <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-lg">
                    <span className="font-medium">支持议价</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-bold">{listing.user.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{listing.user.name}</p>
                      <button
                        onClick={() => setShowContact(!showContact)}
                        className="text-sm text-primary hover:underline"
                      >
                        {showContact ? "隐藏联系方式" : "查看联系方式"}
                      </button>
                    </div>
                  </div>
                  {showContact && listing.user.phone && (
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{listing.user.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">价格</h3>
                  {formatPrice()}
                  {listing.isNegotiable && (
                    <p className="text-sm text-accent mt-2">价格可议</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-12 text-base" size="lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    联系卖家
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-base" size="lg">
                    <Share2 className="w-5 h-5 mr-2" />
                    分享信息
                  </Button>
                  <Button variant="outline" className="w-full h-10 text-sm text-destructive hover:text-destructive" size="sm">
                    <Flag className="w-4 h-4 mr-2" />
                    举报信息
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">安全提示</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    交易前请仔细核实对方身份
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    建议选择当面交易
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    切勿提前支付全款
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
