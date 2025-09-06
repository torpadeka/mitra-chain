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
    <section className="min-h-screen py-20 bg-secondary bg-gradient-to-b from-neutral-50 to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 dark:text-neutral-100 mb-4 text-balance">
            Success Stories from Our Community
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto text-pretty">
            Hear from franchisors and franchisees who have found success through
            MitraChain's transparent marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-background dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:shadow-lg hover:shadow-brand-200/20 transition-all duration-300 hover:border-brand-400"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed text-pretty">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={
                      "https://picsum.photos/seed/" +
                        testimonial.name.length +
                        "/300/200" || "/placeholder.svg"
                    }
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-brand-200 dark:border-brand-700"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 font-jetbrains-mono">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
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
