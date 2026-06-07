import { useEffect } from "react";
import { useLocation } from "wouter";
import { Store, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function RoleSelection() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const promoteToSeller = trpc.users.promoteToSeller.useMutation();

  const handleSelectRole = async (role: "buyer" | "seller" | "admin") => {
    try {
      if (role === "seller") {
        await promoteToSeller.mutateAsync();
        navigate("/create-shop");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to PartsBay!</h1>
          <p className="text-xl text-slate-300">
            Choose how you'd like to use our marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyer Option */}
          <Card className="bg-slate-700 border-slate-600 p-8 hover:border-blue-500 transition cursor-pointer">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-blue-600 p-4 rounded-full">
                  <ShoppingCart size={48} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">I'm a Buyer</h2>
              <p className="text-slate-300 mb-8">
                Browse and purchase authentic car parts from verified sellers. Find exactly what you need with advanced search and filters.
              </p>
              <ul className="text-left text-slate-300 mb-8 space-y-2">
                <li>✓ Browse thousands of parts</li>
                <li>✓ Advanced search & filters</li>
                <li>✓ Secure checkout</li>
                <li>✓ Order tracking</li>
                <li>✓ Leave reviews</li>
              </ul>
              <Button
                onClick={() => handleSelectRole("buyer")}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3"
              >
                Continue as Buyer
              </Button>
            </div>
          </Card>

          {/* Seller Option */}
          <Card className="bg-slate-700 border-slate-600 p-8 hover:border-green-500 transition cursor-pointer">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-green-600 p-4 rounded-full">
                  <Store size={48} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">I'm a Seller</h2>
              <p className="text-slate-300 mb-8">
                Start your shop and reach thousands of buyers. Manage inventory, track orders, and grow your business.
              </p>
              <ul className="text-left text-slate-300 mb-8 space-y-2">
                <li>✓ Create your shop</li>
                <li>✓ List unlimited parts</li>
                <li>✓ Seller dashboard</li>
                <li>✓ Order management</li>
                <li>✓ Build reputation</li>
              </ul>
              <Button
                onClick={() => handleSelectRole("seller")}
                disabled={promoteToSeller.isPending}
                className="w-full bg-green-600 hover:bg-green-700 py-3"
              >
                {promoteToSeller.isPending ? "Setting up..." : "Continue as Seller"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400">
            You can change your role anytime from your account settings
          </p>
        </div>
      </div>
    </div>
  );
}
