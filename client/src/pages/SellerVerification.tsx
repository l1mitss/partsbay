import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SellerVerification() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    taxId: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    agreeTerms: false,
  });
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "rejected" | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.businessName || !formData.taxId || !formData.agreeTerms) {
      toast.error("Please fill all required fields");
      return;
    }

    setVerificationStatus("pending");
    setTimeout(() => {
      setVerificationStatus("verified");
      toast.success("Verification submitted! You'll be verified within 24 hours.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-2">Seller Verification</h1>
        <p className="text-slate-400 mb-8">Complete KYC to unlock seller features and build trust</p>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  s <= step ? "bg-blue-600 text-white" : "bg-slate-600 text-slate-400"
                }`}
              >
                {s}
              </div>
              <p className="text-xs text-slate-400">{s === 1 ? "Business Info" : s === 2 ? "Documents" : "Review"}</p>
            </div>
          ))}
        </div>

        {/* Status Cards */}
        {verificationStatus && (
          <Card className={`mb-8 p-4 border-2 ${verificationStatus === "verified" ? "bg-green-900/20 border-green-600" : "bg-yellow-900/20 border-yellow-600"}`}>
            <div className="flex items-center gap-3">
              {verificationStatus === "verified" ? (
                <>
                  <CheckCircle className="text-green-400" size={24} />
                  <div>
                    <p className="text-green-400 font-semibold">Verification Submitted</p>
                    <p className="text-green-300 text-sm">You'll be verified within 24 hours</p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="text-yellow-400" size={24} />
                  <div>
                    <p className="text-yellow-400 font-semibold">Verification Pending</p>
                    <p className="text-yellow-300 text-sm">Our team is reviewing your information</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Form */}
        <Card className="bg-slate-700 border-slate-600 p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-white font-bold text-lg mb-6">Business Information</h2>
              <div>
                <Label className="text-white mb-2 block">Business Name *</Label>
                <Input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your business name"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Tax ID *</Label>
                <Input
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Your tax ID"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Business Address</Label>
                <Input
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="Full address"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <Button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-white font-bold text-lg mb-6">Contact Information</h2>
              <div>
                <Label className="text-white mb-2 block">Business Phone</Label>
                <Input
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Business Email</Label>
                <Input
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 bg-slate-600 border-slate-500">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-white font-bold text-lg mb-6">Review & Submit</h2>
              <div className="bg-slate-600 p-4 rounded-lg mb-4">
                <p className="text-slate-300 text-sm">
                  <strong>Business Name:</strong> {formData.businessName}
                </p>
                <p className="text-slate-300 text-sm">
                  <strong>Tax ID:</strong> {formData.taxId}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={formData.agreeTerms}
                  onCheckedChange={handleCheckboxChange}
                  className="border-slate-500 mt-1"
                />
                <Label className="text-slate-300 text-sm cursor-pointer">
                  I agree to the seller terms and certify that all information provided is accurate
                </Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1 bg-slate-600 border-slate-500">
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.agreeTerms} className="flex-1 bg-green-600 hover:bg-green-700">
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
