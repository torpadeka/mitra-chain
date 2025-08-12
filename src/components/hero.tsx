import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function Hero() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-bold text-4xl md:text-6xl text-gray-900 mb-6">
            Discover Your Perfect
            <span className="text-green-600 block">Franchise Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join the future of franchising with blockchain transparency,
            NFT-based licenses, and community governance. Find, invest, and grow
            with MitraChain.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search franchises by industry, investment level, or location..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none
                text-foreground"
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />
              <Button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary"
                onClick={() => navigate(`/franchises?q=${inputValue}`)}
              >
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              className="btn-primary text-lg px-8 py-4 hover:cursor-pointer"
              onClick={() => navigate("/franchises")}
            >
              Browse Franchises
            </Button>
            <Button
              className="btn-secondary text-lg px-8 py-4 hover:cursor-pointer"
              onClick={() => navigate("/how-it-works")}
            >
              Learn How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">500+</div>
              <div className="text-gray-600">Active Franchises</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">100%</div>
              <div className="text-gray-600">Blockchain Secured</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">10K+</div>
              <div className="text-gray-600">Community Members</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
