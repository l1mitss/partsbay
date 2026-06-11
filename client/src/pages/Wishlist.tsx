import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Trash2, ShoppingCart } from "lucide-react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([
    { id: 1, title: "OEM Engine Block", price: 450, seller: "AutoParts Pro", image: "🔧" },
    { id: 2, title: "Brake Pads Set", price: 120, seller: "Parts Hub", image: "🛑" },
    { id: 3, title: "Air Filter", price: 35, seller: "Quality Parts", image: "💨" },
  ]);

  const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Wishlist</h1>
          <p className="text-slate-400">{wishlist.length} items saved</p>
        </div>

        {wishlist.length === 0 ? (
          <Card className="bg-slate-700 border-slate-600 p-12 text-center">
            <Heart size={48} className="text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Your wishlist is empty</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Continue Shopping</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="bg-slate-700 border-slate-600 overflow-hidden hover:border-blue-500 transition">
                <div className="bg-slate-600 h-40 flex items-center justify-center text-6xl">{item.image}</div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">{item.seller}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-green-400 font-bold text-lg">${item.price}</span>
                    <Heart size={20} className="text-red-500 fill-red-500" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm">
                      <ShoppingCart size={16} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      className="bg-slate-600 border-slate-500 hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
