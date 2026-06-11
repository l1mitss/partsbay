import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Star, TrendingUp } from "lucide-react";

export default function SellerAnalytics() {
  const data = [
    { month: "Jan", sales: 400, revenue: 2400 },
    { month: "Feb", sales: 300, revenue: 1398 },
    { month: "Mar", sales: 200, revenue: 9800 },
    { month: "Apr", sales: 278, revenue: 3908 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Seller Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-700 border-slate-600 p-6">
            <p className="text-slate-400 text-sm">Total Sales</p>
            <p className="text-3xl font-bold text-white">1,234</p>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6">
            <p className="text-slate-400 text-sm">Revenue</p>
            <p className="text-3xl font-bold text-green-400">$45,678</p>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6">
            <p className="text-slate-400 text-sm">Avg Order Value</p>
            <p className="text-3xl font-bold text-white">$37</p>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" />
              <div>
                <p className="text-slate-400 text-sm">Rating</p>
                <p className="text-3xl font-bold text-white">4.8</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-slate-700 border-slate-600 p-6">
          <h2 className="text-white font-bold mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
