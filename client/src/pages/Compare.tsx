import { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Compare() {
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const allListings = [
    { id: 1, title: "OEM Engine Block", price: 450, condition: "New", seller: "AutoParts Pro", rating: 4.8 },
    { id: 2, title: "OEM Engine Block", price: 420, condition: "New", seller: "Parts Hub", rating: 4.5 },
    { id: 3, title: "OEM Engine Block", price: 480, condition: "Like New", seller: "Quality Parts", rating: 4.9 },
  ];

  const filteredListings = allListings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const comparingListings = allListings.filter((l) => selectedListings.includes(l.id));

  const toggleListing = (id: number) => {
    if (selectedListings.includes(id)) {
      setSelectedListings(selectedListings.filter((lid) => lid !== id));
    } else {
      if (selectedListings.length >= 4) {
        toast.error("Maximum 4 listings can be compared");
        return;
      }
      setSelectedListings([...selectedListings, id]);
    }
  };

  const removeListing = (id: number) => {
    setSelectedListings(selectedListings.filter((lid) => lid !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Compare Listings</h1>
          <p className="text-slate-400">Compare up to 4 listings side-by-side to find the best deal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-700 border-slate-600 p-6 lg:col-span-1">
            <h2 className="text-white font-bold mb-4">Search Listings</h2>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredListings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => toggleListing(listing.id)}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedListings.includes(listing.id)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{listing.title}</p>
                      <p className="text-sm opacity-75">${listing.price}</p>
                    </div>
                    {selectedListings.includes(listing.id) && <Check size={18} />}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-4">{selectedListings.length} / 4 selected</p>
          </Card>

          <div className="lg:col-span-3">
            {selectedListings.length === 0 ? (
              <Card className="bg-slate-700 border-slate-600 p-12 text-center">
                <Plus size={48} className="text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Select listings to compare</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-4 px-4 text-slate-400 font-medium">Attribute</th>
                      {comparingListings.map((listing) => (
                        <th key={listing.id} className="text-center py-4 px-4">
                          <div className="relative">
                            <button
                              onClick={() => removeListing(listing.id)}
                              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-1 transition"
                            >
                              <X size={14} className="text-white" />
                            </button>
                            <div className="text-white font-semibold text-sm">{listing.title}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-600 hover:bg-slate-700/50">
                      <td className="py-4 px-4 text-slate-300 font-medium">Price</td>
                      {comparingListings.map((listing) => (
                        <td key={listing.id} className="text-center py-4 px-4">
                          <span className="text-green-400 font-bold text-lg">${listing.price}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-600 hover:bg-slate-700/50">
                      <td className="py-4 px-4 text-slate-300 font-medium">Condition</td>
                      {comparingListings.map((listing) => (
                        <td key={listing.id} className="text-center py-4 px-4">
                          <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {listing.condition}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-600 hover:bg-slate-700/50">
                      <td className="py-4 px-4 text-slate-300 font-medium">Seller</td>
                      {comparingListings.map((listing) => (
                        <td key={listing.id} className="text-center py-4 px-4">
                          <span className="text-white">{listing.seller}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-600 hover:bg-slate-700/50">
                      <td className="py-4 px-4 text-slate-300 font-medium">Rating</td>
                      {comparingListings.map((listing) => (
                        <td key={listing.id} className="text-center py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white font-semibold">{listing.rating}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4"></td>
                      {comparingListings.map((listing) => (
                        <td key={listing.id} className="text-center py-4 px-4">
                          <Button className="bg-blue-600 hover:bg-blue-700 w-full">View Details</Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {selectedListings.length > 0 && (
          <Card className="bg-slate-700 border-slate-600 p-6 mt-8">
            <h3 className="text-white font-bold mb-3">💡 Comparison Tips</h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Compare prices to find the best value</li>
              <li>• Check seller ratings for reliability</li>
              <li>• Consider condition for long-term value</li>
              <li>• Click "View Details" to see full information</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
