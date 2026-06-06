import { useState } from "react";
import { useLocation } from "wouter";
import { Star, MapPin, Globe, Phone, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function ShopProfile() {
  const [location, navigate] = useLocation();
  const shopId = parseInt(location.split("/").pop() || "0");
  const [sortBy, setSortBy] = useState("newest");

  const { data: shop, isLoading: shopLoading } = trpc.shops.getById.useQuery({ shopId });
  const { data: listings } = trpc.listings.getByShopId.useQuery({ shopId });
  const { data: reviews } = trpc.reviews.getByShop.useQuery({ shopId });

  if (shopLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Shop Not Found</h1>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{shop.name}</h1>
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Star size={20} className="fill-yellow-300 text-yellow-300" />
                  <span className="font-semibold">{shop.averageRating || "N/A"}</span>
                  <span className="text-blue-100">({shop.totalReviews} reviews)</span>
                </div>
                {shop.isVerified && (
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Verified Seller
                  </span>
                )}
              </div>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 font-semibold">
              Follow Shop
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Shop Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* About */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h3 className="text-lg font-bold text-white mb-4">About</h3>
            <p className="text-slate-300 mb-6">
              {shop.description || "No description provided"}
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              {shop.city && shop.state && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-400" />
                  <span>
                    {shop.city}, {shop.state}
                  </span>
                </div>
              )}
              {shop.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-blue-400" />
                  <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Visit Website
                  </a>
                </div>
              )}
              {shop.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-400" />
                  <span>{shop.phone}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Active Listings</p>
                <p className="text-3xl font-bold text-blue-400">{listings?.length || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Response Time</p>
                <p className="text-white font-semibold">Usually within 24h</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Member Since</p>
                <p className="text-white font-semibold">
                  {new Date(shop.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3 flex items-center justify-center gap-2">
              <MessageCircle size={20} />
              Message Seller
            </Button>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              Report Shop
            </Button>
          </Card>
        </div>

        {/* Listings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Active Listings</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded px-4 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  className="bg-slate-700 border-slate-600 hover:border-blue-500 cursor-pointer transition-all overflow-hidden group"
                >
                  <div className="h-40 bg-slate-600 flex items-center justify-center group-hover:bg-slate-500 transition relative">
                    <span className="text-4xl">🚗</span>
                    <button className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/75 rounded-full text-white transition">
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-blue-400">
                        ${listing.price}
                      </span>
                      <span className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded">
                        {listing.condition}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-yellow-400">
                        ★ {listing.averageRating || "N/A"}
                      </span>
                      <span className="text-slate-400">
                        {listing.totalReviews} reviews
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-700 border-slate-600 p-12 text-center">
              <p className="text-slate-400">No listings available</p>
            </Card>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Buyer Reviews</h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <Card key={review.id} className="bg-slate-700 border-slate-600 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-500"
                            }
                          />
                        ))}
                      </div>
                      {review.title && (
                        <h4 className="font-semibold text-white">{review.title}</h4>
                      )}
                    </div>
                    <span className="text-sm text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-slate-300 text-sm">{review.comment}</p>
                  )}
                </Card>
              ))}
              {reviews.length > 5 && (
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  View All Reviews ({reviews.length})
                </Button>
              )}
            </div>
          ) : (
            <Card className="bg-slate-700 border-slate-600 p-12 text-center">
              <p className="text-slate-400">No reviews yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
