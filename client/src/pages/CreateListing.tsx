import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function CreateListing() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    categoryId: "1",
    title: "",
    description: "",
    price: "",
    condition: "new" as "new" | "used" | "refurbished",
    carMake: "",
    carModel: "",
    carYear: "",
    stock: "1",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createListing = trpc.listings.create.useMutation();
  const uploadPhotos = trpc.listings.uploadPhotos.useMutation();
  const { data: categoriesData } = trpc.categories.list.useQuery();

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: categoriesData[0].id.toString() }));
      }
    }
  }, [categoriesData]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (photos.length === 0) {
      toast.error("At least one photo is required");
      return;
    }
    if (photos.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Create listing
      const listingResponse = await createListing.mutateAsync({
        categoryId: parseInt(formData.categoryId),
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condition: formData.condition,
        carMake: formData.carMake || undefined,
        carModel: formData.carModel || undefined,
        carYear: formData.carYear ? parseInt(formData.carYear) : undefined,
        stock: parseInt(formData.stock),
      });

      // Get the listing ID from the response (or query for it)
      // For now, we'll fetch the latest listing
      const utils = trpc.useUtils();
      const listings = await utils.listings.search.fetch({ limit: 1 });
      const listingId = listings?.[0]?.id;

      if (!listingId) {
        toast.error("Failed to get listing ID");
        return;
      }

      // Step 2: Upload photos
      const photoData = await Promise.all(
        photos.map(async (photo) => {
          const arrayBuffer = await photo.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let base64 = "";
          for (let i = 0; i < bytes.length; i++) {
            base64 += String.fromCharCode(bytes[i]);
          }
          return {
            data: btoa(base64),
            name: photo.name,
          };
        })
      );

      if (photoData.length > 0) {
        await uploadPhotos.mutateAsync({
          listingId,
          photos: photoData,
        });
      }

      toast.success("Listing created successfully!");
      setTimeout(() => navigate("/seller/dashboard"), 500);
    } catch (error: any) {
      console.error("Error creating listing:", error);
      const errorMsg = error?.message || "Failed to create listing. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Create Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId.toString()}
                  onChange={handleInputChange}
                  className="w-full bg-slate-600 border border-slate-500 text-white rounded px-4 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  placeholder="e.g., OEM Brake Pads for Toyota Camry"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the part, condition, and any special features..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded px-4 py-2"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Pricing & Stock */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Pricing & Stock</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full bg-slate-600 border border-slate-500 text-white rounded px-4 py-2"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Stock *
                </label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="bg-slate-600 border-slate-500 text-white"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Car Compatibility */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Car Compatibility</h2>
            <div className="grid grid-cols-3 gap-4">
              <Input
                type="text"
                name="carMake"
                placeholder="Make (e.g., Toyota)"
                value={formData.carMake}
                onChange={handleInputChange}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
              <Input
                type="text"
                name="carModel"
                placeholder="Model (e.g., Camry)"
                value={formData.carModel}
                onChange={handleInputChange}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
              <Input
                type="number"
                name="carYear"
                placeholder="Year"
                value={formData.carYear}
                onChange={handleInputChange}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
            </div>
          </Card>

          {/* Photos */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Photos</h2>
            <div className="border-2 border-dashed border-slate-500 rounded-lg p-8 text-center hover:border-slate-400 transition">
              <Upload size={32} className="mx-auto mb-2 text-slate-400" />
              <p className="text-slate-300 mb-2">Drag & drop photos or click to upload</p>
              <p className="text-sm text-slate-400 mb-4">Max 5 photos, 10MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button
                  type="button"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Choose Photos
                </Button>
              </label>
            </div>

            {photos.length > 0 && (
              <div className="mt-6 grid grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading || createListing.isPending || uploadPhotos.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3"
            >
              {isLoading ? "Creating..." : "Create Listing"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/seller/dashboard")}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
