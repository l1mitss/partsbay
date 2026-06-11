import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ShopSetup() {
  const [step, setStep] = useState(1);
  const [shopData, setShopData] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = async () => {
    if (!shopData.name || !shopData.email) {
      toast.error("Please fill required fields");
      return;
    }
    toast.success("Shop created successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Create Your Shop</h1>
        <Card className="bg-slate-700 border-slate-600 p-8">
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 flex-1 mx-1 rounded ${s <= step ? "bg-blue-600" : "bg-slate-600"}`} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Shop Name</Label>
              <Input value={shopData.name} onChange={(e) => setShopData({...shopData, name: e.target.value})} className="bg-slate-600 border-slate-500 text-white" />
            </div>
            <div>
              <Label className="text-white">Email</Label>
              <Input value={shopData.email} onChange={(e) => setShopData({...shopData, email: e.target.value})} className="bg-slate-600 border-slate-500 text-white" />
            </div>
            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">Create Shop</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
