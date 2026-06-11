import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  conditions: string[];
  rating: number;
}

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [],
    conditions: [],
    rating: 0,
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    condition: true,
    rating: false,
  });

  const categories = ["Engine", "Brakes", "Suspension", "Electrical", "Body", "Interior"];
  const conditions = ["New", "Like New", "Used", "Refurbished"];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...filters.conditions, condition]
      : filters.conditions.filter((c) => c !== condition);
    const newFilters = { ...filters, conditions: newConditions };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="bg-slate-700 border-slate-600 p-6 h-fit sticky top-4">
      <h3 className="text-white font-bold text-lg mb-4">Filters</h3>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-white font-semibold mb-3 hover:text-blue-400"
        >
          Price Range
          <ChevronDown size={18} className={expandedSections.price ? "rotate-180" : ""} />
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <Slider
              defaultValue={[0, 1000]}
              max={5000}
              step={50}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-300">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-white font-semibold mb-3 hover:text-blue-400"
        >
          Category
          <ChevronDown size={18} className={expandedSections.category ? "rotate-180" : ""} />
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center">
                <Checkbox
                  id={cat}
                  checked={filters.categories.includes(cat)}
                  onCheckedChange={(checked) => handleCategoryChange(cat, checked as boolean)}
                  className="border-slate-500"
                />
                <Label htmlFor={cat} className="ml-2 text-slate-300 cursor-pointer">
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("condition")}
          className="flex items-center justify-between w-full text-white font-semibold mb-3 hover:text-blue-400"
        >
          Condition
          <ChevronDown size={18} className={expandedSections.condition ? "rotate-180" : ""} />
        </button>
        {expandedSections.condition && (
          <div className="space-y-2">
            {conditions.map((cond) => (
              <div key={cond} className="flex items-center">
                <Checkbox
                  id={cond}
                  checked={filters.conditions.includes(cond)}
                  onCheckedChange={(checked) => handleConditionChange(cond, checked as boolean)}
                  className="border-slate-500"
                />
                <Label htmlFor={cond} className="ml-2 text-slate-300 cursor-pointer">
                  {cond}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        className="w-full bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
        onClick={() => {
          const defaultFilters = { priceRange: [0, 1000] as [number, number], categories: [], conditions: [], rating: 0 };
          setFilters(defaultFilters);
          onFilterChange(defaultFilters);
        }}
      >
        Reset Filters
      </Button>
    </Card>
  );
}
