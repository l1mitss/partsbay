import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [results, setResults] = useState<{ successful: number; failed: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setUploadStatus("success");
    setResults({ successful: 45, failed: 2 });
    toast.success("Bulk upload completed!");
  };

  const downloadTemplate = () => {
    const csv = "title,description,price,condition,category,carMake,carModel,carYear,stock\nExample Part,High quality part,99.99,new,engine,Toyota,Camry,2020,5";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "listings_template.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-2">Bulk Upload Listings</h1>
        <p className="text-slate-400 mb-8">Upload multiple listings at once using a CSV file</p>

        <div className="space-y-6">
          {/* Template Download */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h3 className="text-white font-semibold mb-3">1. Download Template</h3>
            <p className="text-slate-300 text-sm mb-4">Start with our CSV template to ensure correct format</p>
            <Button onClick={downloadTemplate} className="bg-blue-600 hover:bg-blue-700 w-full">
              <Download size={18} className="mr-2" />
              Download CSV Template
            </Button>
          </Card>

          {/* File Upload */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h3 className="text-white font-semibold mb-3">2. Upload CSV File</h3>
            <div className="border-2 border-dashed border-slate-500 rounded-lg p-8 text-center">
              <Upload className="mx-auto mb-3 text-slate-400" size={32} />
              <p className="text-slate-300 mb-3">Drag and drop your CSV file or click to select</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-input"
              />
              <label htmlFor="csv-input" className="cursor-pointer">
                <Button type="button" variant="outline" className="bg-slate-600 border-slate-400">
                  Select File
                </Button>
              </label>
              {file && <p className="text-green-400 text-sm mt-3">✓ {file.name}</p>}
            </div>
          </Card>

          {/* Upload Progress */}
          {uploadStatus !== "idle" && (
            <Card className="bg-slate-700 border-slate-600 p-6">
              <h3 className="text-white font-semibold mb-4">Upload Progress</h3>
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-slate-300 text-sm">{uploadProgress}% complete</p>
            </Card>
          )}

          {/* Results */}
          {uploadStatus === "success" && results && (
            <Card className="bg-green-900/20 border-green-600 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Upload Successful!</h3>
                  <p className="text-green-300 text-sm">
                    ✓ {results.successful} listings created successfully
                  </p>
                  {results.failed > 0 && (
                    <p className="text-yellow-300 text-sm">⚠ {results.failed} listings failed</p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploadStatus === "uploading"}
            className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
          >
            {uploadStatus === "uploading" ? "Uploading..." : "Upload Listings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
