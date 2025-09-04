import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import NoPP from '../assets/no_pp.webp'

const reviews = [
  {
    id: "1",
    author: "Sarah Johnson",
    role: "Franchisee - 2 years",
    rating: 5,
    date: "2 months ago",
    content:
      "Excellent support from the franchisor team. The training program was comprehensive and the ongoing support has been invaluable. My location has been profitable since month 8.",
    helpful: 12,
    avatar: "/reviewer-1.jpg",
  },
  {
    id: "2",
    author: "Michael Chen",
    role: "Franchisee - 1 year",
    rating: 4,
    date: "4 months ago",
    content:
      "Great brand recognition and customer loyalty. The initial investment was significant but the ROI has been solid. Marketing support could be improved.",
    helpful: 8,
    avatar: "/reviewer-2.jpg",
  },
  {
    id: "3",
    author: "Emily Rodriguez",
    role: "Franchisee - 3 years",
    rating: 5,
    date: "6 months ago",
    content:
      "This franchise has exceeded my expectations. The community focus really resonates with customers and the sustainable practices align with my values.",
    helpful: 15,
    avatar: "/reviewer-3.jpg",
  },
];

interface FranchiseReviewsProps {
  franchiseId: string;
}

export function FranchiseReviews({ franchiseId }: FranchiseReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Reviews & Testimonials
          </CardTitle>
          <Button variant="outline" size="sm">
            Write Review
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">124 reviews</div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width:
                          rating === 5 ? "70%" : rating === 4 ? "20%" : "5%",
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {rating === 5 ? "87" : rating === 4 ? "25" : "6"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      review.avatar || NoPP
                    }
                    alt={review.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {review.author}
                        </div>
                        <div className="text-sm text-gray-600">
                          {review.role}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {review.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button variant="outline">Load More Reviews</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
