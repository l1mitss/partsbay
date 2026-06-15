import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, Filter, X, ChevronDown, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function Search() {
  const [location, navigate] = useLocation();
  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: undefined as number | undefined,
    carMake: "",
    carModel: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    condition: "" as "" | "new" | "used" | "refurbished",
  });

  const [showFilters, setShowFilters] = useState(false);
  const { data: listings, isLoading } = trpc.listings.search.useQuery(filters);
  const { data: categories } = trpc.categories.list.useQuery();

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    setFilters((prev) => ({
      ...prev,
      keyword: params.get("q") || "",
      categoryId: params.get("category") ? parseInt(params.get("category")!) : undefined,
    }));
  }, [location]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      categoryId: undefined,
      carMake: "",
      carModel: "",
      minPrice: undefined,
      maxPrice: undefined,
      condition: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Search Parts</h1>
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-4">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-3 text-slate-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by part name, make, model..."
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange("keyword", e.target.value)}
                  className="pl-10 bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex gap-2 border-slate-600 text-white hover:bg-slate-600"
              >
                <Filter size={20} />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>
            {/* Quick Filter Tags */}
            {(filters.keyword || filters.categoryId || filters.carMake || filters.condition) && (
              <div className="flex flex-wrap gap-2">
                {filters.keyword && (
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-500 border cursor-pointer hover:bg-blue-600/30" onClick={() => handleFilterChange("keyword", "")}>
                    {filters.keyword} <X size={14} className="ml-1" />
                  </Badge>
                )}
                {filters.carMake && (
                  <Badge className="bg-green-600/20 text-green-300 border-green-500 border cursor-pointer hover:bg-green-600/30" onClick={() => handleFilterChange("carMake", "")}>
                    {filters.carMake} <X size={14} className="ml-1" />
                  </Badge>
                )}
                {filters.condition && (
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-500 border cursor-pointer hover:bg-purple-600/30" onClick={() => handleFilterChange("condition", "")}>
                    {filters.condition} <X size={14} className="ml-1" />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="bg-slate-700 border-slate-600 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Clear
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.categoryId || ""}
                    onChange={(e) =>
                      handleFilterChange("categoryId", e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="w-full bg-slate-600 border-slate-500 text-white rounded px-3 py-2"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Car Make */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Car Make
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Toyota"
                    value={filters.carMake}
                    onChange={(e) => handleFilterChange("carMake", e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                </div>

                {/* Car Model */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Car Model
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Camry"
                    value={filters.carModel}
                    onChange={(e) => handleFilterChange("carModel", e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Condition
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange("condition", e.target.value)}
                    className="w-full bg-slate-600 border-slate-500 text-white rounded px-3 py-2"
                  >
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {isLoading ? (
              <div className="text-center text-slate-300 py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Card
                    key={listing.id}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    className="bg-slate-700 border-slate-600 hover:border-blue-500 cursor-pointer transition-all overflow-hidden group"
                  >
                    <div className="h-48 bg-slate-600 flex items-center justify-center group-hover:bg-slate-500 transition">
                      <div className="text-6xl">🚗</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-blue-400">
                          ${listing.price}
                        </span>
                        <span className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded">
                          {listing.condition}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                        {listing.carMake && listing.carModel ? (
                          <>
                            <span>{listing.carMake} {listing.carModel}</span>
                          </>
                        ) : (
                          <span>Universal Part</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-semibold">
                            {listing.averageRating || "N/A"}
                          </span>
                          <span className="text-slate-400">({listing.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-300 py-12">
                <p className="text-lg">No listings found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
