"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import { Phone, MapPin, Clock, Star, MessageCircle, Share2, ChevronLeft, ChevronRight, User } from "lucide-react";

export const dynamic = "force-dynamic";

interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string | null;
  website: string | null;
  images: string[];
  workingHours: string | null;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  category: { id: string; name: string };
  city: { name: string };
  user: { id: string; name: string; phone: string; avatar: string | null };
  reviews: Review[];
}

interface Review {
  id: string;
  content: string;
  rating: number;
  images: string[];
  createdAt: string;
  user: { name: string; avatar: string | null };
}

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/businesses/${params.id}`)
        .then((res) => res.json())
        .then((data) => setBusiness(data));
    }
  }, [params?.id]);

  const handleChat = () => {
    if (!session) {
      window.location.href = "/auth/login";
      return;
    }

    fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otherUserId: business?.user.id,
        content: "您好，我对您的店铺感兴趣",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        window.location.href = `/chat`;
      });
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        currentCity={business.city.name}
        onCityChange={() => {}}
        onSearch={() => {}}
      />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft mb-6">
              <div className="relative aspect-[4/3] bg-muted">
                {business.images.length > 0 ? (
                  <img
                    src={business.images[activeImageIndex]}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20business%20storefront%20professional%20clean%20design&image_size=landscape_16_9"
                      alt="Placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {business.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => Math.max(0, prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => Math.min(business.images.length - 1, prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {business.images.length > 1 && (
                <div className="flex gap-3 p-4 overflow-x-auto scrollbar-hide">
                  {business.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImageIndex === index
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {business.category.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span className="font-medium">{business.rating}</span>
                      <span className="text-muted-foreground">({business.reviewCount}条评价)</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <h3 className="font-semibold mb-4">店铺介绍</h3>
                <p className="text-muted-foreground">{business.description}</p>
              </div>

              {business.tags.length > 0 && (
                <div className="border-t border-border pt-6 mb-6">
                  <h3 className="font-semibold mb-4">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {business.reviews.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-4">用户评价</h3>
                  <div className="space-y-6">
                    {business.reviews.map((review) => (
                      <div key={review.id} className="flex gap-4">
                        {review.user.avatar ? (
                          <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.user.name}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "text-accent fill-current" : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <h3 className="font-semibold mb-4">联系商家</h3>

              <div className="flex items-center gap-4 mb-6">
                {business.user.avatar ? (
                  <img
                    src={business.user.avatar}
                    alt={business.user.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-semibold">{business.user.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{business.user.name}</p>
                  <p className="text-sm text-muted-foreground">商家</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5" />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{business.address}</span>
                </div>
                {business.workingHours && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>{business.workingHours}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = `tel:${business.phone}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  拨打电话
                </button>

                <button
                  onClick={handleChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary/90 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  在线咨询
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">服务保障</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 商家已通过平台认证</li>
                <li>• 支持在线咨询</li>
                <li>• 可查看真实用户评价</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
