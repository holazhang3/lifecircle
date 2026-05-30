"use client";

import { useState, useEffect } from "react";
import { Building2, Home, ShoppingBag, Users, Wrench, PawPrint, GraduationCap, Calendar, Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  parentId: string | null;
}

interface CategoryNavProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "briefcase": Building2,
  "home": Home,
  "shopping-bag": ShoppingBag,
  "store": Users,
  "users": Users,
  "wrench": Wrench,
  "paw": PawPrint,
  "paw-print": PawPrint,
  "graduation-cap": GraduationCap,
  "book-open": GraduationCap,
  "calendar": Calendar,
  "search": Search,
};

export function CategoryNav({ selectedCategory, onCategorySelect }: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setCategories([]);
        setLoading(false);
      });
  }, []);

  const primaryCategories = Array.isArray(categories) ? categories.filter((cat) => !cat.parentId) : [];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
          <button
            onClick={() => onCategorySelect(null)}
            className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all whitespace-nowrap min-w-[64px] ${
              selectedCategory === null
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">全部</span>
          </button>
          {!loading && primaryCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Search;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all whitespace-nowrap min-w-[64px] ${
                  selectedCategory === category.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}