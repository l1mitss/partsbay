import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Zap, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const { data: categories } = trpc.categories.list.useQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categoryIcons: Record<string, string> = {
    Engine: "🔧",
    Brakes: "🛑",
    Suspension: "🚗",
    Electrical: "⚡",
    Body: "🔩",
    Interior: "🪑",
    Transmission: "⚙️",
    Cooling: "❄️",
    Exhaust: "💨",
    Lighting: "💡",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
              Premium Car Parts
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Marketplace
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Discover authentic parts from trusted sellers. Buy with confidence.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-75"></div>
              <div className="relative bg-white rounded-lg p-2 flex items-center gap-2">
                <Search className="text-slate-400 ml-4" size={20} />
                <Input
                  type="text"
                  placeholder="Search parts, make, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus:outline-none text-slate-900 placeholder-slate-500"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 rounded-md"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 text-center text-slate-300">
            <div className="flex flex-col items-center gap-2">
              <Shield size={24} className="text-green-400" />
              <span className="text-sm">Verified Sellers</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck size={24} className="text-blue-400" />
              <span className="text-sm">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap size={24} className="text-yellow-400" />
              <span className="text-sm">Best Prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/search?category=${category.id}`)}
                className="group"
              >
                <Card className="h-24 flex flex-col items-center justify-center gap-2 bg-slate-700 border-slate-600 hover:border-blue-500 hover:bg-slate-600 transition-all cursor-pointer">
                  <span className="text-3xl">
                    {categoryIcons[category.name] || "📦"}
                  </span>
                  <span className="text-sm font-medium text-slate-200 text-center px-2">
                    {category.name}
                  </span>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Become a Seller</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Start selling quality car parts to thousands of buyers
            </p>
            <Button
              onClick={() => navigate("/seller-signup")}
              className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-2 font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
