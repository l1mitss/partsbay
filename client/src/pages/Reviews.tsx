import { useState } from "react";
import { useLocation } from "wouter";
import { Star, MessageSquare, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Reviews() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: reviews, isLoading } = trpc.reviews.getByShop.useQuery(
    { shopId: 1 }, // TODO: Get from context
    { enabled: !!user }
  );

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review posted successfully!");
      setTitle("");
      setComment("");
      setRating(5);
      setShowForm(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post review");
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

  const handleSubmitReview = async () => {
    if (!title.trim()) {
      toast.error("Please enter a review title");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    await createReview.mutateAsync({
      orderId: 1, // TODO: Get from order context
      shopId: 1, // TODO: Get from shop context
      listingId: 1, // TODO: Get from listing context
      rating,
      title,
      comment,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Reviews</h1>
          <p className="text-slate-400">Share your feedback about parts you've purchased</p>
        </div>

        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare size={18} className="mr-2" />
            Write a Review
          </Button>
        ) : (
          <Card className="bg-slate-700 border-slate-600 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Write Your Review</h2>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-500"
                      } transition`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">Review Title</label>
              <Input
                placeholder="Summarize your experience..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">Your Review</label>
              <Textarea
                placeholder="Tell other buyers about this part..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmitReview}
                disabled={createReview.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createReview.isPending ? "Posting..." : "Post Review"}
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="border-slate-500 text-slate-300 hover:bg-slate-600"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Reviews</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <MessageSquare size={32} className="text-blue-500" />
              </div>
              <p className="text-slate-400 mt-4">Loading reviews...</p>
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <Card className="bg-slate-700 border-slate-600 p-12 text-center">
              <MessageSquare size={48} className="text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
              <p className="text-slate-400">Start writing reviews to help other buyers</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <Card key={review.id || Math.random()} className="bg-slate-700 border-slate-600 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-500"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-400">
                          {review.rating} out of 5
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{review.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{review.comment}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      {user?.name || "Anonymous"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
