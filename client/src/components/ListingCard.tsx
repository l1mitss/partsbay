import { Star, Heart, Share2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  id: number;
  title: string;
  description?: string;
  price: number;
  condition: "new" | "used" | "refurbished";
  carMake?: string;
  carModel?: string;
  averageRating?: number;
  totalReviews?: number;
  stock?: number;
  onViewClick?: () => void;
  onWishlistClick?: () => void;
  onShareClick?: () => void;
  isWishlisted?: boolean;
  showActions?: boolean;
}

export default function ListingCard({
  id,
  title,
  description,
  price,
  condition,
  carMake,
  carModel,
  averageRating,
  totalReviews,
  stock,
  onViewClick,
  onWishlistClick,
  onShareClick,
  isWishlisted,
  showActions = true,
}: ListingCardProps) {
  const conditionColors = {
    new: "bg-green-600/20 text-green-300 border-green-500",
    used: "bg-yellow-600/20 text-yellow-300 border-yellow-500",
    refurbished: "bg-blue-600/20 text-blue-300 border-blue-500",
  };

  return (
    <Card className="bg-slate-700 border-slate-600 hover:border-blue-500 cursor-pointer transition-all overflow-hidden group h-full flex flex-col">
      {/* Image Section */}
      <div className="h-48 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center group-hover:from-slate-500 group-hover:to-slate-600 transition relative overflow-hidden">
        <div className="text-6xl group-hover:scale-110 transition-transform">🚗</div>
        
        {/* Wishlist Button */}
        {showActions && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWishlistClick?.();
            }}
            className="absolute top-2 right-2 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              className={isWishlisted ? "fill-red-500 text-red-500" : "text-slate-300"}
            />
          </button>
        )}

        {/* Stock Badge */}
        {stock !== undefined && (
          <div className="absolute bottom-2 left-2 bg-slate-800/80 px-2 py-1 rounded text-xs text-slate-200">
            Stock: {stock}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-300 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Car Make/Model */}
        <div className="text-xs text-slate-400 mb-3">
          {carMake && carModel ? `${carMake} ${carModel}` : "Universal Part"}
        </div>

        {/* Price & Condition */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-blue-400">${price}</span>
          <Badge className={`border ${conditionColors[condition]} text-xs`}>
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </Badge>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-4">
          {averageRating !== undefined && (
            <>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                ({totalReviews || 0} reviews)
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 mt-auto">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewClick?.();
              }}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600 flex items-center justify-center gap-1 text-sm"
            >
              <Eye size={14} />
              View
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onShareClick?.();
              }}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600 flex items-center justify-center gap-1 text-sm"
            >
              <Share2 size={14} />
              Share
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
