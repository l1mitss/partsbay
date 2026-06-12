import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, TrendingDown, Package, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface InventoryItem {
  id: number;
  title: string;
  sku: string;
  stock: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, title: "Brake Pads", sku: "BP-001", stock: 45, price: 29.99, status: "in-stock" },
    { id: 2, title: "Oil Filter", sku: "OF-002", stock: 8, price: 12.99, status: "low-stock" },
    { id: 3, title: "Air Filter", sku: "AF-003", stock: 0, price: 19.99, status: "out-of-stock" },
    { id: 4, title: "Spark Plugs", sku: "SP-004", stock: 120, price: 8.99, status: "in-stock" },
    { id: 5, title: "Battery", sku: "BAT-005", stock: 3, price: 89.99, status: "low-stock" },
  ]);

  const filteredInventory = inventory.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = inventory.reduce((sum, item) => sum + item.stock * item.price, 0);
  const lowStockCount = inventory.filter((item) => item.status === "low-stock").length;
  const outOfStockCount = inventory.filter((item) => item.status === "out-of-stock").length;

  const updateStock = (id: number, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let status: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
          if (newStock === 0) status = "out-of-stock";
          else if (newStock < 10) status = "low-stock";
          return { ...item, stock: newStock, status };
        }
        return item;
      })
    );
    toast.success("Stock updated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-2">Inventory Management</h1>
        <p className="text-slate-400 mb-8">Track and manage your product inventory</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Inventory Value</p>
                <p className="text-white text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
              <DollarSign className="text-blue-400" size={32} />
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Items</p>
                <p className="text-white text-2xl font-bold">{inventory.reduce((sum, item) => sum + item.stock, 0)}</p>
              </div>
              <Package className="text-green-400" size={32} />
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Low Stock</p>
                <p className="text-white text-2xl font-bold">{lowStockCount}</p>
              </div>
              <AlertCircle className="text-yellow-400" size={32} />
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Out of Stock</p>
                <p className="text-white text-2xl font-bold">{outOfStockCount}</p>
              </div>
              <TrendingDown className="text-red-400" size={32} />
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-700 border-slate-600 p-6 mb-8">
          <Input
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </Card>

        {/* Inventory Table */}
        <Card className="bg-slate-700 border-slate-600 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-600">
              <TableRow>
                <TableHead className="text-slate-300">Product</TableHead>
                <TableHead className="text-slate-300">SKU</TableHead>
                <TableHead className="text-slate-300">Stock</TableHead>
                <TableHead className="text-slate-300">Price</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id} className="border-slate-600 hover:bg-slate-600/50">
                  <TableCell className="text-white font-medium">{item.title}</TableCell>
                  <TableCell className="text-slate-300">{item.sku}</TableCell>
                  <TableCell className="text-slate-300">{item.stock}</TableCell>
                  <TableCell className="text-slate-300">${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "in-stock"
                          ? "bg-green-600/20 text-green-400"
                          : item.status === "low-stock"
                            ? "bg-yellow-600/20 text-yellow-400"
                            : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {item.status === "in-stock" ? "In Stock" : item.status === "low-stock" ? "Low Stock" : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={item.stock}
                        onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 bg-slate-600 border-slate-500 text-white text-sm"
                      />
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
