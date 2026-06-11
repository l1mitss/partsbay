import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export default function EditListing() {
  const [formData, setFormData] = useState({
    title: "OEM Engine Block",
    description: "High quality OEM engine block",
    price: "450",
    condition: "new",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Listing updated successfully!");
    } catch (error) {
      toast.error("Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Edit Listing</h1>
        <Card className="bg-slate-700 border-slate-600 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-white mb-2 block">Title</Label>
              <Input value={formData.title} className="bg-slate-600 border-slate-500 text-white" />
            </div>
            <div>
              <Label className="text-white mb-2 block">Description</Label>
              <Textarea value={formData.description} rows={5} className="bg-slate-600 border-slate-500 text-white" />
            </div>
            <div>
              <Label className="text-white mb-2 block">Price</Label>
              <Input value={formData.price} type="number" className="bg-slate-600 border-slate-500 text-white" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Updating..." : "Update Listing"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
