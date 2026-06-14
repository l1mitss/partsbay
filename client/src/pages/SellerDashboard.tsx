import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, Edit2, Trash2, Eye, TrendingUp, Package, Star, DollarSign, BarChart3, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function SellerDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: shop } = trpc.shops.getMine.useQuery();
  const { data: listings } = trpc.listings.getByShopId.useQuery(
    { shopId: shop?.id || 0 },
    { enabled: !!shop }
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in</h1>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <Card className="bg-slate-700 border-slate-600 p-8 max-w-md w-full text-center">
          <Package size={48} className="mx-auto mb-4 text-slate-400" />
          <h1 className="text-2xl font-bold text-white mb-4">No Shop Found</h1>
          <p className="text-slate-300 mb-6">
            You don't have a shop yet. Create one to start selling car parts.
          </p>
          <Button
            onClick={() => navigate("/create-shop")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Create Shop
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{shop.name}</h1>
          <p className="text-slate-400">Manage your shop and listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-700 border-slate-600 p-6 hover:border-green-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Sales</p>
                <p className="text-3xl font-bold text-white">$12,450</p>
                <p className="text-xs text-green-400 mt-2">↑ 12% from last month</p>
              </div>
              <DollarSign size={32} className="text-green-400" />
            </div>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6 hover:border-blue-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Listings</p>
                <p className="text-3xl font-bold text-white">{listings?.length || 0}</p>
                <p className="text-xs text-blue-400 mt-2">Ready to sell</p>
              </div>
              <Package size={32} className="text-blue-400" />
            </div>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6 hover:border-yellow-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Shop Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-white">{shop.averageRating || "N/A"}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < Math.round(parseFloat(shop.averageRating || "0")) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"} />
                    ))}
                  </div>
                </div>
              </div>
              <Star size={32} className="text-yellow-400" />
            </div>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6 hover:border-purple-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Reviews</p>
                <p className="text-3xl font-bold text-white">{shop.totalReviews || 0}</p>
                <p className="text-xs text-purple-400 mt-2">Customer feedback</p>
              </div>
              <TrendingUp size={32} className="text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-600">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "overview"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "listings"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "orders"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "settings"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-slate-700 border-slate-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-600">
                    <div className="flex items-start gap-3 flex-1">
                      <CheckCircle size={20} className="text-green-400 mt-1" />
                      <div>
                        <p className="font-semibold text-white">Order #ORD-123456</p>
                        <p className="text-sm text-slate-400">Brake Pads x2 • Shipped</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">+$89.99</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-600">
                    <div className="flex items-start gap-3 flex-1">
                      <Star size={20} className="text-yellow-400 fill-yellow-400 mt-1" />
                      <div>
                        <p className="font-semibold text-white">New 5-Star Review</p>
                        <p className="text-sm text-slate-400">Great quality and fast shipping!</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <CheckCircle size={20} className="text-green-400 mt-1" />
                      <div>
                        <p className="font-semibold text-white">Order #ORD-123455</p>
                        <p className="text-sm text-slate-400">Air Filter x1 • Delivered</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">+$24.99</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-slate-700 border-slate-600 p-6 h-fit">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/create-listing")}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create Listing
                </Button>
                <Button
                  onClick={() => setActiveTab("settings")}
                  className="w-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center gap-2"
                >
                  <Edit2 size={20} />
                  Edit Shop
                </Button>
                <Button
                  onClick={() => toast.info("Analytics coming soon")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-600 flex items-center justify-center gap-2"
                >
                  <BarChart3 size={20} />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "listings" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Listings</h2>
              <Button
                onClick={() => navigate("/create-listing")}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                New Listing
              </Button>
            </div>

            {listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Card key={listing.id} className="bg-slate-700 border-slate-600 overflow-hidden">
                    <div className="h-40 bg-slate-600 flex items-center justify-center">
                      <span className="text-4xl">🚗</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {listing.title}
                      </h3>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-blue-400">
                          ${listing.price}
                        </span>
                        <span className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded">
                          {listing.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400 mb-4">
                        Stock: {listing.stock} | Views: 124
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/listing/${listing.id}`)}
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600 flex items-center justify-center gap-1"
                          title="View listing"
                        >
                          <Eye size={16} />
                          View
                        </Button>
                        <Button
                          onClick={() => navigate(`/edit-listing/${listing.id}`)}
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600 flex items-center justify-center gap-1"
                          title="Edit listing"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>
                        <Button
                          onClick={() => toast.info("Delete feature coming soon")}
                          variant="outline"
                          className="flex-1 border-red-600 text-red-400 hover:bg-red-600/20 flex items-center justify-center gap-1"
                          title="Delete listing"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-700 border-slate-600 p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="text-slate-300 mb-6">No listings yet. Create your first one!</p>
                <Button
                  onClick={() => navigate("/create-listing")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Listing
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-600">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white">Order #ORD-123456</p>
                    <Badge className="bg-green-600/20 text-green-300 border-0 text-xs">Shipped</Badge>
                  </div>
                  <p className="text-sm text-slate-400">3 items • Brake Pads, Air Filter, Oil Filter</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">$89.99</p>
                  <p className="text-sm text-green-400">Paid</p>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-600">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white">Order #ORD-123455</p>
                    <Badge className="bg-blue-600/20 text-blue-300 border-0 text-xs">Processing</Badge>
                  </div>
                  <p className="text-sm text-slate-400">2 items • Battery, Spark Plugs</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">$45.50</p>
                  <p className="text-sm text-green-400">Paid</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white">Order #ORD-123454</p>
                    <Badge className="bg-purple-600/20 text-purple-300 border-0 text-xs">Delivered</Badge>
                  </div>
                  <p className="text-sm text-slate-400">1 item • Windshield Wipers</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">$24.99</p>
                  <p className="text-sm text-green-400">Paid</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card className="bg-slate-700 border-slate-600 p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Shop Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  defaultValue={shop.name}
                  className="w-full bg-slate-600 border border-slate-500 text-white rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  defaultValue={shop.description || ""}
                  rows={4}
                  className="w-full bg-slate-600 border border-slate-500 text-white rounded px-4 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue={shop.city || ""}
                    className="w-full bg-slate-600 border border-slate-500 text-white rounded px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    defaultValue={shop.state || ""}
                    className="w-full bg-slate-600 border border-slate-500 text-white rounded px-4 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Shop settings saved!")}>Save Changes</Button>
                <Button variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600" onClick={() => setActiveTab("overview")}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
