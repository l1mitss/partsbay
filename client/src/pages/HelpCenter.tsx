import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    category: "Buying",
    question: "How do I search for car parts?",
    answer: "Use the search bar on the homepage or browse by category. You can filter by price, condition, and car make/model/year.",
  },
  {
    id: 2,
    category: "Buying",
    question: "How do I place an order?",
    answer: "Add items to your cart, proceed to checkout, enter your shipping address, and complete payment.",
  },
  {
    id: 3,
    category: "Buying",
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards and PayPal through our secure Stripe payment gateway.",
  },
  {
    id: 4,
    category: "Selling",
    question: "How do I become a seller?",
    answer: "Sign up, select 'Seller' role, complete shop setup, and pass verification to start selling.",
  },
  {
    id: 5,
    category: "Selling",
    question: "How do I create a listing?",
    answer: "Go to your dashboard, click 'Create Listing', add details and photos, and publish.",
  },
  {
    id: 6,
    category: "Selling",
    question: "Can I upload multiple listings at once?",
    answer: "Yes! Use our bulk upload feature with a CSV file to add many listings quickly.",
  },
  {
    id: 7,
    category: "Shipping",
    question: "How long does shipping take?",
    answer: "Shipping times vary by seller and location. Check the listing for estimated delivery.",
  },
  {
    id: 8,
    category: "Returns",
    question: "What is your return policy?",
    answer: "Contact the seller within 30 days of delivery for returns or refunds.",
  },
];

export default function HelpCenter() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

  const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))];
  const filteredFAQs = selectedCategory === "All" ? faqs : faqs.filter((faq) => faq.category === selectedCategory);

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Your message has been sent! We'll respond within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Help Center</h1>
          <p className="text-slate-400">Find answers to common questions or contact us</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="bg-slate-700 border-slate-600 p-6 text-center hover:bg-slate-600 transition cursor-pointer">
            <Mail className="mx-auto mb-3 text-blue-400" size={32} />
            <h3 className="text-white font-semibold mb-1">Email Support</h3>
            <p className="text-slate-400 text-sm">support@partsbay.com</p>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6 text-center hover:bg-slate-600 transition cursor-pointer">
            <Phone className="mx-auto mb-3 text-green-400" size={32} />
            <h3 className="text-white font-semibold mb-1">Phone Support</h3>
            <p className="text-slate-400 text-sm">1-800-PARTS-BAY</p>
          </Card>
          <Card className="bg-slate-700 border-slate-600 p-6 text-center hover:bg-slate-600 transition cursor-pointer">
            <MessageSquare className="mx-auto mb-3 text-purple-400" size={32} />
            <h3 className="text-white font-semibold mb-1">Live Chat</h3>
            <p className="text-slate-400 text-sm">Available 9AM-6PM EST</p>
          </Card>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <Card
                key={faq.id}
                className="bg-slate-700 border-slate-600 overflow-hidden hover:border-slate-500 transition"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-600 transition"
                >
                  <div className="text-left">
                    <p className="text-white font-semibold">{faq.question}</p>
                    <p className="text-slate-400 text-xs mt-1">{faq.category}</p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition ${expandedFAQ === faq.id ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 py-4 bg-slate-600/50 border-t border-slate-600">
                    <p className="text-slate-300">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Can't find what you're looking for?</h2>
          <Card className="bg-slate-700 border-slate-600 p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
                <Input
                  placeholder="Your Email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <Input
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white"
              />
              <Textarea
                placeholder="Your message..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white h-32"
              />
              <Button onClick={handleContactSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                Send Message
              </Button>
            </div>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className="bg-slate-700 border-slate-600 p-6">
          <h3 className="text-white font-semibold mb-4">Additional Resources</h3>
          <ul className="space-y-2 text-slate-300">
            <li>• <a href="#" className="text-blue-400 hover:text-blue-300">Seller Guidelines</a></li>
            <li>• <a href="#" className="text-blue-400 hover:text-blue-300">Buyer Protection Policy</a></li>
            <li>• <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a></li>
            <li>• <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a></li>
            <li>• <a href="#" className="text-blue-400 hover:text-blue-300">Community Guidelines</a></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
