"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import NoPP from "../assets/no_pp.webp";

interface FranchiseGalleryProps {
  images: string[];
}

export function FranchiseGallery({ images }: FranchiseGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-green-600" />
          Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative">
            <img
              src={images[currentImage] || NoPP}
              alt={`Gallery image ${currentImage + 1}`}
              className="w-full h-80 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevImage}
                className="bg-background hover:bg-background/80"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextImage}
                className="bg-background hover:bg-background/80"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-background/80 text-primary px-3 py-1 rounded-full text-sm font-jetbrains-mono">
                {currentImage + 1} / {images.length}
              </div>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative overflow-hidden rounded-md ${
                  currentImage === index ? "ring-2 ring-green-500" : ""
                }`}
              >
                <img
                  src={image || NoPP}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-20 object-cover hover:scale-105 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
