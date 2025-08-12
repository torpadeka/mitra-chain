import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, MessageCircle, Users } from "lucide-react";

export function JoinUs() {
  return (
    <section className="py-20 from-green-600 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
            Join the Revolution
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Be part of the community that's transforming franchising. Whether
            you're an investor, franchisor, or just passionate about innovation,
            there's a place for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white mb-4">
                Join Our Community
              </h3>
              <p className="text-green-100 mb-6 leading-relaxed">
                Connect with other entrepreneurs, franchisors, and blockchain
                enthusiasts in our growing community.
              </p>
              <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                Join Discord
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-green-100 mb-6 leading-relaxed">
                Get the latest updates on platform developments, new features,
                and community events.
              </p>
              <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white mb-4">
                Get in Touch
              </h3>
              <p className="text-green-100 mb-6 leading-relaxed">
                Have questions or want to learn more? Our team is here to help
                you get started.
              </p>
              <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
