import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Zap } from "lucide-react";

export function MissionVision() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Our Purpose
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe franchising should be transparent, accessible, and
            community-driven. Here's what drives us every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize franchising by creating a transparent,
                blockchain-powered marketplace that connects entrepreneurs with
                verified franchise opportunities while eliminating traditional
                barriers and intermediaries.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A world where every entrepreneur has access to transparent
                franchise opportunities, where franchisors can efficiently
                expand their brands, and where the community governs the
                platform that serves them.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">
                Our Values
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Transparency, community ownership, innovation, and empowerment
                guide everything we do. We believe in building technology that
                serves people, not the other way around.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">
                Our Impact
              </h3>
              <p className="text-gray-600 leading-relaxed">
                By leveraging blockchain technology, we're reducing costs,
                increasing transparency, and creating new opportunities for
                entrepreneurs worldwide to build successful franchise
                businesses.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
