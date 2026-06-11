import { Badge } from "@/components/ui/badge";
import { Shield, Award, TrendingUp, Heart, Zap } from "lucide-react";

interface SellerBadgesProps {
  rating: number;
  reviewCount: number;
  responseTime: number;
  returnRate: number;
  isVerified: boolean;
}

export function SellerBadges({
  rating,
  reviewCount,
  responseTime,
  returnRate,
  isVerified,
}: SellerBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Verified Badge */}
      {isVerified && (
        <Badge className="bg-green-600/20 text-green-400 border-green-600/50 flex items-center gap-1">
          <Shield size={14} />
          Verified Seller
        </Badge>
      )}

      {/* Top Rated Badge */}
      {rating >= 4.5 && reviewCount >= 10 && (
        <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50 flex items-center gap-1">
          <Award size={14} />
          Top Rated
        </Badge>
      )}

      {/* Fast Responder Badge */}
      {responseTime <= 2 && (
        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50 flex items-center gap-1">
          <Zap size={14} />
          Fast Responder
        </Badge>
      )}

      {/* Trending Badge */}
      {reviewCount >= 50 && (
        <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/50 flex items-center gap-1">
          <TrendingUp size={14} />
          Trending
        </Badge>
      )}

      {/* Trusted Seller Badge */}
      {rating >= 4.8 && returnRate < 2 && (
        <Badge className="bg-red-600/20 text-red-400 border-red-600/50 flex items-center gap-1">
          <Heart size={14} />
          Trusted Seller
        </Badge>
      )}
    </div>
  );
}
