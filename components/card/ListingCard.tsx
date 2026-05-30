"use client";

import { useState } from "react";
import { Heart, MapPin, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

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

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = () => {
    if (!listing.price) return "价格面议";
    const unit = listing.unit || "";
    if (listing.originalPrice && listing.originalPrice > listing.price) {
      return (
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-indigo-600">
            {listing.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">{unit}</span>
          <span className="text-xs line-through text-gray-400">
            {listing.originalPrice.toLocaleString()}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-indigo-600">
          {listing.price.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  return (
    <Card className="overflow-hidden group cursor-pointer border-0 bg-white hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={listing.images[0] || "https://picsum.photos/400/300"}
          alt={listing.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {listing.isUrgent && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
              急
            </span>
          )}
          <span className="px-2 py-0.5 bg-black/60 text-white text-xs font-medium rounded-full">
            {listing.category.name}
          </span>
        </div>
        <button
          onClick={handleFavorite}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-black/40 text-white hover:bg-black/60"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-3 min-h-[40px]">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between mb-2">
          {formatPrice()}
        </div>
        {listing.isNegotiable && (
          <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full mb-2">
            可议价
          </span>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {listing.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(listing.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {listing.views}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}