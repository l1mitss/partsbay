import { useState } from "react";
import { useLocation } from "wouter";
import { Users, Store, AlertCircle, BarChart3, Settings, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">You don't have permission to access this page</p>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Manage users, shops, listings, and platform settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-700 border-slate-600">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <BarChart3 size={18} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
              <Users size={18} className="mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="shops" className="data-[state=active]:bg-blue-600">
              <Store size={18} className="mr-2" />
              Shops
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
              <AlertCircle size={18} className="mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              <Settings size={18} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-700 border-slate-600 p-6">
                <div className="text-slate-400 text-sm mb-2">Total Users</div>
                <div className="text-3xl font-bold text-white">1,234</div>
                <div className="text-green-400 text-sm mt-2">↑ 12% this month</div>
              </Card>
              <Card className="bg-slate-700 border-slate-600 p-6">
                <div className="text-slate-400 text-sm mb-2">Active Shops</div>
                <div className="text-3xl font-bold text-white">456</div>
                <div className="text-green-400 text-sm mt-2">↑ 8% this month</div>
              </Card>
              <Card className="bg-slate-700 border-slate-600 p-6">
                <div className="text-slate-400 text-sm mb-2">Total Listings</div>
                <div className="text-3xl font-bold text-white">12,890</div>
                <div className="text-green-400 text-sm mt-2">↑ 24% this month</div>
              </Card>
              <Card className="bg-slate-700 border-slate-600 p-6">
                <div className="text-slate-400 text-sm mb-2">Pending Reports</div>
                <div className="text-3xl font-bold text-white">23</div>
                <div className="text-red-400 text-sm mt-2">Requires attention</div>
              </Card>
            </div>

            <Card className="bg-slate-700 border-slate-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-600">
                  <div>
                    <p className="text-white">New user registration</p>
                    <p className="text-slate-400 text-sm">john.doe@example.com</p>
                  </div>
                  <span className="text-slate-400 text-sm">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-600">
                  <div>
                    <p className="text-white">New shop created</p>
                    <p className="text-slate-400 text-sm">AutoParts Pro</p>
                  </div>
                  <span className="text-slate-400 text-sm">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Content reported</p>
                    <p className="text-slate-400 text-sm">Listing #5432</p>
                  </div>
                  <span className="text-slate-400 text-sm">6 hours ago</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card className="bg-slate-700 border-slate-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left text-slate-300 py-3">User</th>
                      <th className="text-left text-slate-300 py-3">Email</th>
                      <th className="text-left text-slate-300 py-3">Role</th>
                      <th className="text-left text-slate-300 py-3">Status</th>
                      <th className="text-left text-slate-300 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-600 hover:bg-slate-600/50">
                      <td className="py-3 text-white">John Doe</td>
                      <td className="py-3 text-slate-300">john@example.com</td>
                      <td className="py-3">
                        <Badge className="bg-blue-600/20 text-blue-300 border-0">Buyer</Badge>
                      </td>
                      <td className="py-3">
                        <Badge className="bg-green-600/20 text-green-300 border-0">Active</Badge>
                      </td>
                      <td className="py-3">
                        <Button size="sm" variant="outline" className="border-slate-500">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-600 hover:bg-slate-600/50">
                      <td className="py-3 text-white">Jane Smith</td>
                      <td className="py-3 text-slate-300">jane@example.com</td>
                      <td className="py-3">
                        <Badge className="bg-green-600/20 text-green-300 border-0">Seller</Badge>
                      </td>
                      <td className="py-3">
                        <Badge className="bg-green-600/20 text-green-300 border-0">Active</Badge>
                      </td>
                      <td className="py-3">
                        <Button size="sm" variant="outline" className="border-slate-500">
                          View
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Shops Tab */}
          <TabsContent value="shops" className="mt-6">
            <Card className="bg-slate-700 border-slate-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Shop Management</h2>
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 bg-slate-600/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">AutoParts Pro</h3>
                    <p className="text-slate-400 text-sm">Owner: Jane Smith</p>
                    <p className="text-slate-400 text-sm">Listings: 234 | Rating: 4.8/5</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle size={16} className="mr-1" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-500">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-start justify-between p-4 bg-slate-600/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">Engine Experts</h3>
                    <p className="text-slate-400 text-sm">Owner: Bob Johnson</p>
                    <p className="text-slate-400 text-sm">Listings: 156 | Rating: 4.5/5</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle size={16} className="mr-1" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-500">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <Card className="bg-slate-700 border-slate-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Reported Content</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold">Listing #5432</h3>
                    <Badge className="bg-red-600/20 text-red-300 border-0">Pending</Badge>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">Reason: Counterfeit product suspected</p>
                  <p className="text-slate-400 text-sm mb-3">Reported by: User #1234 • 2 hours ago</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-500">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="bg-slate-700 border-slate-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Platform Settings</h2>
              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-600">
                  <h3 className="text-white font-semibold mb-2">Commission Rate</h3>
                  <p className="text-slate-400 text-sm mb-3">Current: 5% per transaction</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
                </div>
                <div className="pb-4 border-b border-slate-600">
                  <h3 className="text-white font-semibold mb-2">Verification Requirements</h3>
                  <p className="text-slate-400 text-sm mb-3">Sellers must verify ID and business</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Maintenance Mode</h3>
                  <p className="text-slate-400 text-sm mb-3">Platform is currently online</p>
                  <Button variant="outline" className="border-slate-500">
                    Enable Maintenance
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
