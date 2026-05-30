"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Menu, Search, MapPin, Bell, User, ChevronDown, X, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface City {
  id: string;
  name: string;
}

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  onSearch: (keyword: string) => void;
}

export function Header({ currentCity, onCityChange, onSearch }: HeaderProps) {
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data);
        } else {
          setCities([]);
        }
      })
      .catch(() => setCities([]));
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            >
              {showMenu ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">生活圈</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索本地服务..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-24 py-2.5 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-colors"
              >
                搜索
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setShowCityPicker(!showCityPicker)}
            >
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="hidden sm:inline text-sm font-medium ml-1 text-gray-700">
                {currentCity}
              </span>
              <ChevronDown className="w-4 h-4 hidden sm:inline text-gray-400" />
            </button>

            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {session?.user ? (
              <>
                <Link
                  href="/post"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  发布
                </Link>
                <div className="relative">
                  <button
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {session.user.avatar ? (
                      <img
                        src={session.user.avatar}
                        alt={session.user.name || ""}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {session.user.name}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>

      {showCityPicker && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onCityChange(city.name);
                    setShowCityPicker(false);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm transition-all",
                    currentCity === city.name
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
          <div className="px-4 py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索本地服务..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <Link
              href="/post"
              className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium mb-4"
            >
              <Plus className="w-4 h-4" />
              发布信息
            </Link>
            {session?.user && (
              <button
                onClick={() => signOut()}
                className="w-full py-2 text-left text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                退出登录
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}