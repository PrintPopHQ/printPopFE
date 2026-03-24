"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ApiService } from "@/services/ApiService";

const DEFAULT_IMAGES = [
  "/images/printpop-popular-group1.png",
  "/images/printpop-popular-group2.png",
  "/images/printpop-popular-group3.png",
  "/images/printpop-design-case.jpg",
  "/images/printpop-application-scenario.jpg"
];

export function DynamicBanner() {
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const api = ApiService.getInstance();
        const res = await api.getBannerImages();
        if (res.data.data && res.data.data.length > 0) {
          setImages(res.data.data.map((img: any) => img.image_url));
        }
      } catch (error) {
        console.error("Failed to fetch banner images", error);
      }
    };
    fetchBanners();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // 5 sec auto scroll

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full overflow-hidden py-12 lg:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl shadow-xl group">
          {/* Main Image Slider */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <div key={index} className="min-w-full aspect-video md:aspect-21/9 relative shrink-0 bg-linear-to-br from-zinc-100 to-zinc-200">
                <Image
                  src={src}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-contain p-4 md:object-cover md:p-0"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Left Arrow Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full text-secondary shadow-lg opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:scale-110 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow Controls */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full text-secondary shadow-lg opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:scale-110 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Bottom Indicators */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-3 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full shadow-sm transition-all duration-300 ${currentIndex === index
                  ? "w-6 bg-linear-to-r from-secondary to-primary shadow-[0_0_10px_rgba(255,49,49,0.3)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
