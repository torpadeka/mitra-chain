import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Franchisee - Coffee Corner",
    image: "/professional-woman-smiling.png",
    content:
      "MitraChain made finding the perfect franchise opportunity so transparent and easy. The blockchain verification gave me confidence in my investment.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Franchisor - FitLife Gyms",
    image: "/professional-man-smiling.png",
    content:
      "As a franchisor, I love how MitraChain connects me with serious investors. The NFT licensing system is revolutionary for our industry.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Franchisee - EduSmart Centers",
    image: "/professional-woman-glasses.png",
    content:
      "The community governance aspect is amazing. We actually have a say in how the platform evolves. This is the future of franchising.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Success Stories from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from franchisors and franchisees who have found success through
            MitraChain's transparent marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={
                      "https://picsum.photos/seed/" +
                      testimonial.name.length +
                      "/300/200"
                    }
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
