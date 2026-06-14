import { useLocation } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [, navigate] = useLocation();
  const currentYear = new Date().getFullYear();

  const buyerLinks = [
    { label: "Browse Listings", href: "/search" },
    { label: "My Orders", href: "/orders" },
    { label: "My Wishlist", href: "/wishlist" },
    { label: "My Reviews", href: "/reviews" },
    { label: "Track Shipment", href: "/track" },
  ];

  const sellerLinks = [
    { label: "Seller Dashboard", href: "/seller/dashboard" },
    { label: "Create Listing", href: "/create-listing" },
    { label: "Seller Guide", href: "/seller-guide" },
    { label: "Pricing", href: "/seller-pricing" },
    { label: "Seller Support", href: "/seller-support" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Dispute Resolution", href: "/disputes" },
    { label: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
              PartsBay
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Premium car parts marketplace connecting buyers and sellers worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:support@partsbay.com" className="hover:text-white transition">
                  support@partsbay.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone size={16} className="text-blue-400" />
                <a href="tel:+1-800-PARTS-BAY" className="hover:text-white transition">
                  +1-800-PARTS-BAY
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={16} className="text-blue-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Buyer Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Buyers</h4>
            <ul className="space-y-2">
              {buyerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-slate-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Sellers</h4>
            <ul className="space-y-2">
              {sellerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-slate-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-slate-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-slate-400 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Bottom */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Social Links */}
            <div className="flex gap-4 mb-6 md:mb-0">
              <a
                href="https://facebook.com/partsbay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
                title="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/partsbay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
                title="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/partsbay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-pink-400 transition"
                title="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com/company/partsbay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
                title="Follow us on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-slate-400 text-sm text-center md:text-right">
              <p>© {currentYear} PartsBay. All rights reserved.</p>
              <p className="mt-1">
                Trusted by thousands of car enthusiasts and professionals worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-400">100K+</p>
              <p className="text-slate-400 text-sm">Active Sellers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">500K+</p>
              <p className="text-slate-400 text-sm">Parts Listed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">4.8★</p>
              <p className="text-slate-400 text-sm">Average Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">24/7</p>
              <p className="text-slate-400 text-sm">Support</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
