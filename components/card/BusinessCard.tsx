"use client";

import { useState } from "react";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

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

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border-0">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-1/3 aspect-video sm:aspect-auto overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <img
            src={business.images[0] || "https://picsum.photos/400/300"}
            alt={business.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <CardContent className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-base text-gray-900">{business.name}</h3>
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">{business.rating}</span>
                <span className="text-xs text-gray-500">({business.reviewCount})</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {business.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {business.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{business.workingHours || "营业时间待定"}</span>
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
        </div>
      </div>
    </Card>
  );
}