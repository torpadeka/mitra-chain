import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";

export function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-gray-900 mb-6">
              Revolutionizing
              <span className="text-green-600 block">Franchising</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              MitraChain is building the future of franchising through
              blockchain technology, creating a transparent, efficient, and
              community-owned marketplace that empowers both franchisors and
              franchisees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary text-lg px-8 py-4">
                Join Our Mission
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src="/about-hero-image.jpg"
              alt="MitraChain team collaboration"
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />

            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Franchises Listed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
