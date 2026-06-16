import { Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartItemCardProps {
  id: number;
  title: string;
  price: number;
  quantity: number;
  seller?: string;
  condition?: "new" | "used" | "refurbished";
  carMake?: string;
  carModel?: string;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  maxStock?: number;
  isOutOfStock?: boolean;
}

export default function CartItemCard({
  id,
  title,
  price,
  quantity,
  seller,
  condition,
  carMake,
  carModel,
  onQuantityChange,
  onRemove,
  maxStock,
  isOutOfStock,
}: CartItemCardProps) {
  const subtotal = price * quantity;
  const canIncrement = !maxStock || quantity < maxStock;

  const conditionColors = {
    new: "bg-green-600/20 text-green-300 border-green-500",
    used: "bg-yellow-600/20 text-yellow-300 border-yellow-500",
    refurbished: "bg-blue-600/20 text-blue-300 border-blue-500",
  };

  return (
    <Card className="bg-slate-700 border-slate-600 p-4 hover:border-slate-500 transition">
      <div className="flex gap-4">
        {/* Image Placeholder */}
        <div className="w-24 h-24 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="text-3xl">🚗</div>
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          {/* Title & Seller */}
          <div className="mb-2">
            <h3 className="font-semibold text-white line-clamp-2 mb-1">
              {title}
            </h3>
            {seller && (
              <p className="text-xs text-slate-400">
                Sold by: <span className="text-slate-300">{seller}</span>
              </p>
            )}
          </div>

          {/* Car Info & Condition */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {carMake && carModel && (
              <span className="text-xs text-slate-400">
                {carMake} {carModel}
              </span>
            )}
            {condition && (
              <Badge className={`border text-xs ${conditionColors[condition]}`}>
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </Badge>
            )}
          </div>

          {/* Price & Quantity Controls */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Unit Price</p>
              <p className="text-lg font-bold text-blue-400">${price}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="p-1 bg-slate-600 hover:bg-slate-500 rounded transition disabled:opacity-50"
                disabled={quantity <= 1}
                title="Decrease quantity"
              >
                <Minus size={16} className="text-slate-300" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val > 0 && (!maxStock || val <= maxStock)) {
                    onQuantityChange(val);
                  }
                }}
                className="w-12 text-center bg-slate-600 border border-slate-500 rounded text-white text-sm"
                min="1"
                max={maxStock}
              />
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="p-1 bg-slate-600 hover:bg-slate-500 rounded transition disabled:opacity-50"
                disabled={!canIncrement}
                title="Increase quantity"
              >
                <Plus size={16} className="text-slate-300" />
              </button>
            </div>

            {/* Subtotal & Remove */}
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-2">Subtotal</p>
              <p className="text-lg font-bold text-green-400 mb-2">
                ${subtotal.toFixed(2)}
              </p>
              <button
                onClick={onRemove}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition"
                title="Remove from cart"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Out of Stock Warning */}
          {isOutOfStock && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-red-600/20 border border-red-500 rounded">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-300">
                This item is out of stock
              </span>
            </div>
          )}

          {/* Stock Warning */}
          {maxStock && quantity > maxStock && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-yellow-600/20 border border-yellow-500 rounded">
              <AlertCircle size={16} className="text-yellow-400 flex-shrink-0" />
              <span className="text-xs text-yellow-300">
                Only {maxStock} available
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
