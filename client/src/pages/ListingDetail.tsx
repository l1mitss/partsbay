import { useState } from "react";
import { useLocation } from "wouter";
import { Star, ShoppingCart, Share2, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ListingDetail() {
  const [location, navigate] = useLocation();
  const listingId = parseInt(location.split("/").pop() || "0");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();

  const { data: listing, isLoading: listingLoading } = trpc.listings.getById.useQuery({
    id: listingId,
  });
  const { data: photos } = trpc.listings.getPhotos.useQuery({ listingId });
  const { data: shop } = trpc.shops.getById.useQuery(
    { shopId: listing?.shopId || 0 },
    { enabled: !!listing }
  );
  const { data: reviews } = trpc.reviews.getByListing.useQuery({ listingId });
  const addToCart = trpc.cart.addItem.useMutation();

  if (listingLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Listing Not Found</h1>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await addToCart.mutateAsync({ listingId, quantity });
  };

  const nextPhoto = () => {
    if (photos) setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    if (photos) setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ChevronLeft size={20} />
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-700 border-slate-600 overflow-hidden">
              <div className="relative bg-slate-600 aspect-square flex items-center justify-center">
                {photos && photos.length > 0 ? (
                  <img
                    src={photos[currentPhotoIndex]?.photoUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">🚗</div>
                )}

                {photos && photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {photos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPhotoIndex(idx)}
                          className={`w-2 h-2 rounded-full transition ${
                            idx === currentPhotoIndex ? "bg-blue-400" : "bg-slate-400"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {photos && photos.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 transition ${
                        idx === currentPhotoIndex
                          ? "border-blue-400"
                          : "border-slate-500 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={photo.photoUrl}
                        alt={`${listing.title} ${idx + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Product Info */}
          <div>
            {/* Title & Price */}
            <h1 className="text-3xl font-bold text-white mb-2">{listing.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{listing.averageRating || "N/A"}</span>
              </div>
              <span className="text-slate-400">({listing.totalReviews} reviews)</span>
            </div>

            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">${listing.price}</div>
              <div className="flex gap-4 text-sm text-slate-300 mb-4">
                <span className="bg-slate-600 px-3 py-1 rounded">{listing.condition}</span>
                <span className="bg-slate-600 px-3 py-1 rounded">Stock: {listing.stock}</span>
              </div>

              {listing.carMake && listing.carModel && (
                <div className="text-slate-300 mb-4">
                  <p className="text-sm">
                    <strong>Fits:</strong> {listing.carMake} {listing.carModel}
                    {listing.carYear && ` (${listing.carYear})`}
                  </p>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex gap-2 mb-4">
                <div className="flex items-center border border-slate-600 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-400 hover:text-white"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center bg-transparent text-white border-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2 mb-3"
              >
                <ShoppingCart size={20} />
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-600 flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Share
              </Button>
            </div>

            {/* Report */}
            <Button
              variant="ghost"
              className="w-full text-red-400 hover:text-red-300 hover:bg-slate-700 flex items-center justify-center gap-2"
            >
              <Flag size={20} />
              Report Listing
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-700 border-slate-600 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-slate-300 whitespace-pre-wrap">{listing.description}</p>
            </Card>
          </div>

          {/* Seller Info */}
          {shop && (
            <Card className="bg-slate-700 border-slate-600 p-6 h-fit">
              <h3 className="text-xl font-bold text-white mb-4">Seller</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-white mb-2">{shop.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-slate-300">
                    {shop.averageRating} ({shop.totalReviews} reviews)
                  </span>
                </div>
                {shop.isVerified && (
                  <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">
                    ✓ Verified
                  </span>
                )}
              </div>
              <Button
                onClick={() => navigate(`/shop/${shop.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View Shop
              </Button>
            </Card>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-600 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
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
                        <span className="text-slate-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-white mb-1">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-slate-300 text-sm">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No reviews yet</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
