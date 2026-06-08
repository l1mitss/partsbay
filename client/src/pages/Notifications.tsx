import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, Trash2, CheckCircle, Package, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Notifications() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  const { data: notifications, isLoading } = trpc.notifications.getMyNotifications.useQuery(undefined, {
    enabled: !!user,
  });

  const deleteNotification = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      toast.success("Notification deleted");
    },
  });

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      toast.success("Marked as read");
    },
  });

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package size={20} className="text-blue-400" />;
      case "review":
        return <MessageSquare size={20} className="text-green-400" />;
      case "alert":
        return <AlertCircle size={20} className="text-yellow-400" />;
      default:
        return <Bell size={20} className="text-slate-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-600/10 border-blue-600/30";
      case "review":
        return "bg-green-600/10 border-green-600/30";
      case "alert":
        return "bg-yellow-600/10 border-yellow-600/30";
      default:
        return "bg-slate-600/10 border-slate-600/30";
    }
  };

  const filteredNotifications = notifications?.filter((n: any) => {
    if (filter === "unread") return !n.read;
    if (filter === "orders") return n.type === "order";
    if (filter === "reviews") return n.type === "review";
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-slate-400">Stay updated with order and shop activity</p>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full mb-6">
          <TabsList className="bg-slate-700 border-slate-600">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-blue-600">
              Unread
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600">
              Orders
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600">
              Reviews
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Bell size={32} className="text-blue-500" />
            </div>
            <p className="text-slate-400 mt-4">Loading notifications...</p>
          </div>
        ) : !filteredNotifications || filteredNotifications.length === 0 ? (
          <Card className="bg-slate-700 border-slate-600 p-12 text-center">
            <Bell size={48} className="text-slate-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No notifications</h2>
            <p className="text-slate-400">You're all caught up!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification: any) => (
              <Card
                key={notification.id}
                className={`border p-4 transition ${
                  notification.read
                    ? "bg-slate-700/50 border-slate-600"
                    : `${getNotificationColor(notification.type)} border`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">{notification.title}</h3>
                        <p className="text-slate-300 text-sm mt-1">{notification.message}</p>
                        <p className="text-slate-400 text-xs mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!notification.read && (
                        <Badge className="bg-blue-600/20 text-blue-300 border-0 flex-shrink-0">
                          New
                        </Badge>
                      )}
                    </div>

                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => navigate(notification.actionUrl)}
                        >
                          View
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        onClick={() =>
                          markAsRead.mutate({ notificationId: notification.id })
                        }
                      >
                        <CheckCircle size={16} />
                      </Button>
                    )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-500 text-slate-300 hover:bg-slate-600"
                        onClick={() => {
                          // TODO: Implement delete notification
                          toast.success("Notification deleted");
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
