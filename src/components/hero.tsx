"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Shield, Users } from "lucide-react";
import { useState } from "react";
import Waves from "./backgrounds/Waves/Waves";

export function Hero() {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", inputValue);
    // You can replace this with your preferred navigation method
    setInputValue("");
  };

  const handleBrowseClick = () => {
    console.log("Navigate to franchises page");
    // You can replace this with your preferred navigation method
  };

  const handleLearnMoreClick = () => {
    console.log("Navigate to how-it-works page");
    // You can replace this with your preferred navigation method
  };

  return (
    <section className="min-h-screen py-32 relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Waves
              lineColor="#18a54e"
              backgroundColor="rgb(var(--background))"
              waveSpeedX={0.02}
              waveSpeedY={0.01}
              waveAmpX={40}
              waveAmpY={20}
              friction={0.5}
              tension={0.01}
              maxCursorMove={240}
              xGap={24}
              yGap={36}
            />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-background/88" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-sans font-extrabold text-4xl md:text-6xl text-primary dark:text-neutral-100 mb-6 text-balance">
              Discover Your Perfect
              <span className="text-brand-600 block font-jetbrains-mono">
                Franchise Opportunity
              </span>
            </h1>
            <p className="text-xl text-primary/85 mb-8 leading-relaxed text-pretty">
              Join the future of franchising with blockchain transparency,
              NFT-based licenses, and community governance. Find, invest, and
              grow with MitraChain.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search franchises..."
                  className="bg-background text-primary w-full pl-12 pr-4 py-4 text-lg border border-border dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  value={inputValue}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onChange={handleInputChange}
                />
                <Button
                  variant={"primary"}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                variant="primary"
                size={"lg"}
                onClick={handleBrowseClick}
                className=""
              >
                Browse Franchises
              </Button>
              <Button
                variant={"primary_outline"}
                size={"lg"}
                onClick={handleLearnMoreClick}
              >
                Learn How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-500 dark:bg-brand-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-brand-800 dark:text-brand-400" />
                </div>
                <div className="font-bold text-2xl text-primary dark:text-neutral-100 font-jetbrains-mono">
                  500+
                </div>
                <div className="text-primary dark:text-neutral-300">
                  Active Franchises
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-500 dark:bg-brand-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-brand-800 dark:text-brand-400" />
                </div>
                <div className="font-bold text-2xl text-primary dark:text-neutral-100 font-jetbrains-mono">
                  100%
                </div>
                <div className="text-primary dark:text-neutral-300">
                  Blockchain Secured
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-500 dark:bg-brand-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-brand-800 dark:text-brand-400" />
                </div>
                <div className="font-bold text-2xl text-primary dark:text-neutral-100 font-jetbrains-mono">
                  10K+
                </div>
                <div className="text-primary dark:text-neutral-300">
                  Community Members
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
