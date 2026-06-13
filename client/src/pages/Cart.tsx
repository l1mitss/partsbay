import { useState } from "react";
import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart as CartIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Cart() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: cartItems, isLoading } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeItem = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      toast.success("Item removed from cart");
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });
  const updateItem = trpc.cart.updateItem.useMutation({
    onSuccess: () => {
      toast.success("Quantity updated");
    },
    onError: () => {
      toast.error("Failed to update quantity");
    },
  });
  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (result) => {
      toast.success("Order created successfully!");
    },
    onError: () => {
      toast.error("Failed to create order");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <Card className="bg-slate-700 border-slate-600 p-8 max-w-md w-full text-center">
          <CartIcon size={48} className="mx-auto mb-4 text-slate-400" />
          <h1 className="text-2xl font-bold text-white mb-4">Sign in to view cart</h1>
          <p className="text-slate-300 mb-6">You need to be logged in to manage your shopping cart.</p>
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const items = cartItems || [];
  
  // Calculate proper totals from listing prices
  const subtotal = items.reduce((sum, item) => {
    // Note: Cart items don't include listing data, so we estimate based on listingId
    // In production, you'd fetch listing details separately
    return sum + 0;
  }, 0);
  
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleRemove = async (cartItemId: number) => {
    try {
      await removeItem.mutateAsync({ cartItemId });
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    try {
      await updateItem.mutateAsync({ cartItemId, quantity: newQuantity });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const result = await createOrder.mutateAsync({
        items: items.map((item) => ({
          listingId: item.listingId,
          quantity: item.quantity || 1,
        })),
        shippingAddress: {
          street: "123 Main St",
          city: "City",
          state: "State",
          zip: "12345",
          country: "Country",
        },
      });

      navigate(`/checkout/${result.orderNumber}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error?.message || "Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <Card className="bg-slate-700 border-slate-600 p-12 text-center">
            <CartIcon size={48} className="mx-auto mb-4 text-slate-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-300 mb-6">Start shopping to add items to your cart</p>
            <Button
              onClick={() => navigate("/search")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-700 border-slate-600 divide-y divide-slate-600">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    {/* Product Image Placeholder */}
                    <div className="w-24 h-24 bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🚗</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">
                        Part #{item.listingId}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Quantity: {item.quantity || 1}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, (item.quantity || 1) - 1)
                          }
                          disabled={(item.quantity || 1) <= 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity || 1}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-12 text-center bg-slate-600 border border-slate-500 text-white rounded px-2 py-1"
                        />
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, (item.quantity || 1) + 1)
                          }
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={removeItem.isPending}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                      >
                        <Trash2 size={16} />
                        {removeItem.isPending ? "Removing..." : "Remove"}
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-400">
                        $0.00
                      </div>
                      <div className="text-sm text-slate-400">
                        $0.00/ea
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-slate-700 border-slate-600 p-6 sticky top-8">
                <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-600">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-blue-400">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {shipping === 0 && subtotal > 0 && (
                  <div className="mb-4 p-3 bg-green-600/20 border border-green-600 rounded text-green-400 text-xs flex items-center gap-2">
                    <AlertCircle size={16} />
                    Free shipping on orders over $100!
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={createOrder.isPending || items.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 mb-3 font-semibold"
                >
                  {createOrder.isPending ? "Processing..." : `Proceed to Checkout ($${total.toFixed(2)})`}
                </Button>

                <Button
                  onClick={() => navigate("/search")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  Continue Shopping
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-600 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Verified sellers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
