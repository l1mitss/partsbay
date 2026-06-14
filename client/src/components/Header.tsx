import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, User, LogOut, ChevronDown, Package, Heart, MessageSquare, Settings, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Header() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const buyerLinks = [
    { label: "Browse Listings", href: "/search", icon: Package },
    { label: "My Orders", href: "/orders", icon: Package },
    { label: "My Wishlist", href: "/wishlist", icon: Heart },
    { label: "My Reviews", href: "/reviews", icon: MessageSquare },
    { label: "Messages", href: "/messages", icon: MessageSquare },
  ];

  const sellerLinks = [
    { label: "Dashboard", href: "/seller/dashboard", icon: BarChart3 },
    { label: "Create Listing", href: "/create-listing", icon: Package },
    { label: "My Listings", href: "/seller/dashboard", icon: Package },
    { label: "Bulk Upload", href: "/bulk-upload", icon: Upload },
    { label: "Analytics", href: "/seller-analytics", icon: BarChart3 },
    { label: "Settings", href: "/seller/dashboard", icon: Settings },
  ];

  const adminLinks = user?.role === "admin" ? [
    { label: "Admin Panel", href: "/admin", icon: Settings },
  ] : [];

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 hover:opacity-80 transition"
        >
          PartsBay
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Browse Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-slate-300 hover:text-white transition px-3 py-2 rounded hover:bg-slate-700">
              Browse
              <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 mt-0 w-64 bg-slate-700 border border-slate-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
              {buyerLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-600 transition first:rounded-t-lg last:rounded-b-lg border-b border-slate-600 last:border-b-0"
                  >
                    <Icon size={18} className="text-blue-400" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seller Dropdown */}
          {user?.role === "seller" && (
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition px-3 py-2 rounded hover:bg-slate-700">
                Seller
                <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 mt-0 w-64 bg-slate-700 border border-slate-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                {sellerLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.href}
                      onClick={() => navigate(link.href)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-600 transition first:rounded-t-lg last:rounded-b-lg border-b border-slate-600 last:border-b-0"
                    >
                      <Icon size={18} className="text-green-400" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Dropdown */}
          {user?.role === "admin" && (
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-300 hover:text-white transition px-3 py-2 rounded hover:bg-slate-700">
                Admin
                <ChevronDown size={16} />
              </button>
              <div className="absolute left-0 mt-0 w-64 bg-slate-700 border border-slate-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.href}
                      onClick={() => navigate(link.href)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-600 transition first:rounded-t-lg last:rounded-b-lg border-b border-slate-600 last:border-b-0"
                    >
                      <Icon size={18} className="text-purple-400" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={() => navigate("/cart")}
                className="relative text-slate-300 hover:text-white transition"
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                  <User size={20} />
                  <span className="text-sm">{user.name || "Account"}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <button
                    onClick={() => navigate("/messages")}
                    className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600"
                  >
                    Messages
                  </button>
                  <button
                    onClick={() => navigate("/notifications")}
                    className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600"
                  >
                    Notifications
                  </button>
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-600 flex items-center gap-2 rounded-b-lg"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-700 border-t border-slate-600 p-4 space-y-3">
          {/* Browse Section */}
          <div>
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "browse" ? null : "browse")}
              className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded font-semibold flex items-center justify-between"
            >
              Browse
              <ChevronDown size={16} className={dropdownOpen === "browse" ? "rotate-180" : ""} />
            </button>
            {dropdownOpen === "browse" && (
              <div className="pl-4 space-y-2 mt-2">
                {buyerLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => {
                      navigate(link.href);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded text-sm"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seller Section */}
          {user?.role === "seller" && (
            <div>
              <button
                onClick={() => setDropdownOpen(dropdownOpen === "seller" ? null : "seller")}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded font-semibold flex items-center justify-between"
              >
                Seller Tools
                <ChevronDown size={16} className={dropdownOpen === "seller" ? "rotate-180" : ""} />
              </button>
              {dropdownOpen === "seller" && (
                <div className="pl-4 space-y-2 mt-2">
                  {sellerLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => {
                        navigate(link.href);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded text-sm"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin Section */}
          {user?.role === "admin" && (
            <div>
              <button
                onClick={() => setDropdownOpen(dropdownOpen === "admin" ? null : "admin")}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded font-semibold flex items-center justify-between"
              >
                Admin
                <ChevronDown size={16} className={dropdownOpen === "admin" ? "rotate-180" : ""} />
              </button>
              {dropdownOpen === "admin" && (
                <div className="pl-4 space-y-2 mt-2">
                  {adminLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => {
                        navigate(link.href);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded text-sm"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Actions */}
          {user ? (
            <>
              <button
                onClick={() => {
                  navigate("/messages");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded"
              >
                Messages
              </button>
              <button
                onClick={() => {
                  navigate("/notifications");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded"
              >
                Notifications
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
