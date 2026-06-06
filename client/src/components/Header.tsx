import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Header() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <button
            onClick={() => navigate("/search")}
            className="text-slate-300 hover:text-white transition"
          >
            Browse
          </button>
          {user?.role === "seller" && (
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="text-slate-300 hover:text-white transition"
            >
              Seller
            </button>
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
                    onClick={() => navigate("/seller/dashboard")}
                    className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-600 flex items-center gap-2"
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
          <button
            onClick={() => {
              navigate("/search");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded"
          >
            Browse
          </button>
          {user?.role === "seller" && (
            <button
              onClick={() => {
                navigate("/seller/dashboard");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded"
            >
              Seller Dashboard
            </button>
          )}
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded"
            >
              Logout
            </button>
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
