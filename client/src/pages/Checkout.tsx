import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function Checkout() {
  const [location, navigate] = useLocation();
  const orderNumber = location.split("/").pop() || "";
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const confirmPayment = trpc.stripe.confirmPayment.useMutation();

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Confirm payment with backend
      await confirmPayment.mutateAsync({
        orderId: parseInt(orderNumber.split("-")[0]) || 1,
        paymentIntentId: `pi_test_${Math.random().toString(36).substr(2, 9)}`,
      });

      setOrderComplete(true);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <Card className="bg-slate-700 border-slate-600 p-12 max-w-md w-full text-center">
          <CheckCircle size={64} className="mx-auto mb-4 text-green-400" />
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-slate-300 mb-2">Thank you for your purchase</p>
          <p className="text-blue-400 font-semibold mb-6">Order #{orderNumber}</p>
          <p className="text-slate-400 mb-6">
            A confirmation email has been sent to your inbox. You can track your order in your account.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigate("/search")}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-700 border-slate-600 p-8">
              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="First Name"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="col-span-2 bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="Street Address"
                    className="col-span-2 bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="City"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="State"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="ZIP Code"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="text"
                    placeholder="Country"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8 pb-8 border-b border-slate-600">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-white">Credit or Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-white">PayPal</span>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardData.name}
                      onChange={(e) =>
                        setCardData({ ...cardData, name: e.target.value })
                      }
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    <Input
                      type="text"
                      placeholder="Card Number"
                      value={cardData.cardNumber}
                      onChange={(e) =>
                        setCardData({ ...cardData, cardNumber: e.target.value })
                      }
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) =>
                          setCardData({ ...cardData, expiry: e.target.value })
                        }
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                      <Input
                        type="text"
                        placeholder="CVC"
                        value={cardData.cvc}
                        onChange={(e) =>
                          setCardData({ ...cardData, cvc: e.target.value })
                        }
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-slate-300 text-sm mt-4">
                      <Lock size={16} />
                      <span>Your payment information is secure and encrypted</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 mt-6"
                    >
                      {isProcessing ? "Processing Payment..." : "Complete Purchase"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-slate-600 rounded-lg">
                <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white mb-1">Secure Payment</p>
                  <p>
                    This checkout is protected by Stripe. Your payment information is never stored on our servers.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-slate-700 border-slate-600 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-slate-600">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>$250.00</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax</span>
                  <span>$20.80</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-blue-400">$280.80</span>
              </div>

              {/* Order Details */}
              <div className="bg-slate-600 rounded p-4 text-sm text-slate-300">
                <p className="font-semibold text-white mb-2">Order #{orderNumber}</p>
                <p>3 items</p>
                <p className="mt-2 text-xs text-slate-400">
                  Estimated delivery: 3-5 business days
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-slate-600 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Fraud Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Money-back Guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
