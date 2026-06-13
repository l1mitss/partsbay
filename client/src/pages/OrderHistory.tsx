import { useState } from "react";
import { useLocation } from "wouter";
import { Package, ChevronRight, Calendar, DollarSign, Truck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function OrderHistory() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const { data: orders, isLoading } = trpc.orders.getMyOrders.useQuery(undefined, {
    enabled: !!user,
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={16} />;
      case "processing":
        return <Package size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "delivered":
        return <Package size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for seller to process";
      case "processing":
        return "Seller is preparing your order";
      case "shipped":
        return "On its way to you";
      case "delivered":
        return "Successfully delivered";
      case "cancelled":
        return "Order was cancelled";
      default:
        return "Unknown status";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Order History</h1>
          <p className="text-slate-400">Track and manage your purchases</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Package size={32} className="text-blue-500" />
            </div>
            <p className="text-slate-400 mt-4">Loading orders...</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <Card className="bg-slate-700 border-slate-600 p-12 text-center">
            <Package size={48} className="text-slate-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
            <p className="text-slate-400 mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
              Browse Parts
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="bg-slate-700 border-slate-600 p-6 hover:border-blue-500 transition cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-600/20 p-3 rounded-lg">
                        <Package size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            ${parseFloat(order.totalAmount || "0").toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(order.status || "pending")}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status || "pending")}
                          {(order.status || "pending").charAt(0).toUpperCase() + (order.status || "pending").slice(1)}
                        </span>
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {getStatusDescription(order.status || "pending")}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={24}
                    className={`text-slate-400 transition ${
                      selectedOrder === order.id ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {selectedOrder === order.id && (
                  <div className="mt-6 pt-6 border-t border-slate-600">
                    {/* Order Timeline */}
                    <div className="mb-6 p-4 bg-slate-600/30 rounded-lg">
                      <h4 className="text-sm font-bold text-white mb-3">Order Status Timeline</h4>
                      <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Order placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        {order.status !== "pending" && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Processing started</span>
                          </div>
                        )}
                        {(order.status === "shipped" || order.status === "delivered") && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Shipped</span>
                          </div>
                        )}
                        {order.status === "delivered" && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Delivered</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {(order as any).items && (order as any).items.length > 0 ? (
                        (order as any).items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-300">
                              {item.listingTitle || "Part"}
                              {item.quantity && item.quantity > 1 && ` x${item.quantity}`}
                            </span>
                            <span className="text-white font-semibold">
                              ${(item.price || 0).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400">No items in this order</p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300">Subtotal</span>
                        <span className="text-white">${(parseFloat(order.totalAmount || "0") * 0.9).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-slate-300">Tax</span>
                        <span className="text-white">${(parseFloat(order.totalAmount || "0") * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-white">Total</span>
                        <span className="text-blue-400">${parseFloat(order.totalAmount || "0").toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => toast.info("Order details page coming soon")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Details
                      </Button>
                      <Button 
                        onClick={() => toast.info("Messaging feature coming soon")}
                        variant="outline" 
                        className="border-slate-500 text-slate-300 hover:bg-slate-600"
                      >
                        Contact Seller
                      </Button>
                    </div>

                    {order.status === "delivered" && (
                      <Button 
                        onClick={() => toast.info("Review feature coming soon")}
                        variant="outline" 
                        className="w-full mt-3 border-slate-500 text-slate-300 hover:bg-slate-600"
                      >
                        Leave Review
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
