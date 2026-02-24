"use client";

import { useEffect } from "react";
import { Quote, Star, User } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import React from "react";

const testimonials = [
  {
    name: "Jessica Morgan",
    role: "Happy Customer",
    accent: "secondary",
    accentClass: "border-secondary text-secondary shadow-[0_0_15px_rgba(92,225,230,0.5)]",
    hoverClass: "hover:border-secondary hover:shadow-[0_0_30px_rgba(92,225,230,0.2)]",
    roleClass: "text-secondary",
    quote:
      "I was genuinely impressed by the quality of my personalised phone case. The colours look vibrant, the finish feels premium, and it fits perfectly. I get compliments on it almost every day.",
  },
  {
    name: "Daniel Robertson",
    role: "Verified Buyer",
    accentClass: "border-primary text-primary shadow-[0_0_15px_rgba(255,49,49,0.5)]",
    hoverClass: "hover:border-primary hover:shadow-[0_0_30px_rgba(255,49,49,0.2)]",
    roleClass: "text-primary",
    quote:
      "The design process was simple and clear. What I saw in the preview is exactly what I received. If you're looking for reliable custom phone cases, this is a solid choice.",
  },
  {
    name: "Priya Sharma",
    role: "Photography Enthusiast",
    accentClass: "border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    hoverClass: "hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    roleClass: "text-purple-500",
    quote:
      "I uploaded a photo of my dog and didn't expect it to turn out this sharp. The print looks crisp and detailed, and it hasn't faded at all.",
  },
  {
    name: "Liam Thompson",
    role: "Tech Enthusiast",
    accentClass: "border-secondary text-secondary shadow-[0_0_15px_rgba(92,225,230,0.5)]",
    hoverClass: "hover:border-secondary hover:shadow-[0_0_30px_rgba(92,225,230,0.2)]",
    roleClass: "text-secondary",
    quote:
      "I've tried other custom phone cases before, but this one feels much more durable. It has great grip, strong protection, and the print quality really stands out.",
  },
  {
    name: "Chloe Bennett",
    role: "Travel Blogger",
    accentClass: "border-primary text-primary shadow-[0_0_15px_rgba(255,49,49,0.5)]",
    hoverClass: "hover:border-primary hover:shadow-[0_0_30px_rgba(255,49,49,0.2)]",
    roleClass: "text-primary",
    quote:
      "My personalised phone case turned out beautifully. I made a travel collage, and every detail printed clearly. It's now one of my favourite keepsakes.",
  },
  {
    name: "Ethan Walker",
    role: "Business Owner",
    accentClass: "border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    hoverClass: "hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    roleClass: "text-purple-500",
    quote:
      "We ordered branded cases for our team, and they look professional and clean. The colours match our logo perfectly, and the build quality feels strong.",
  },
  {
    name: "Sarah Khan",
    role: "Verified Buyer",
    accentClass: "border-secondary text-secondary shadow-[0_0_15px_rgba(92,225,230,0.5)]",
    hoverClass: "hover:border-secondary hover:shadow-[0_0_30px_rgba(92,225,230,0.2)]",
    roleClass: "text-secondary",
    quote:
      "The whole experience was smooth from start to finish. My personalised phone case arrived quickly and looked even better in person.",
  },
  {
    name: "Michael Paxton",
    role: "Everyday Carry Fan",
    accentClass: "border-primary text-primary shadow-[0_0_15px_rgba(255,49,49,0.5)]",
    hoverClass: "hover:border-primary hover:shadow-[0_0_30px_rgba(255,49,49,0.2)]",
    roleClass: "text-primary",
    quote:
      "I mainly wanted protection, but the design quality surprised me. It's easily one of the best custom phone cases I've used — durable, stylish, and well-made.",
  },
  {
    name: "Aisha Hussain",
    role: "Gift Shopper",
    accentClass: "border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    hoverClass: "hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    roleClass: "text-purple-500",
    quote:
      "I bought one as a gift and ended up ordering another for myself. The print clarity and finish make it feel premium without being overpriced.",
  },
  {
    name: "Ryan Douglas",
    role: "Daily User",
    accentClass: "border-secondary text-secondary shadow-[0_0_15px_rgba(92,225,230,0.5)]",
    hoverClass: "hover:border-secondary hover:shadow-[0_0_30px_rgba(92,225,230,0.2)]",
    roleClass: "text-secondary",
    quote:
      "Perfect fit, strong protection, and a flawless print. My personalised phone case still looks brand new after weeks of daily use.",
  },
];

export const Testimonials = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative overflow-hidden py-36">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-36 left-32 w-[180px] h-[180px] bg-secondary opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
        <div className="absolute top-[calc(80%-128px)] right-32 w-[180px] h-[180px] bg-primary opacity-15 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="text-shadow-[0_0_30px_#5CE1E6]">VOICE OF</span>{" "}
            <span className="text-neon-blue">PRINTPOP'S</span>{" "}
            <span className="text-shadow-[0_0_30px_#5CE1E6]">CUSTOMERS</span>
          </h2>
          <div className="h-1 w-24 bg-linear-to-r from-secondary to-primary mx-auto rounded-full shadow-[0_0_10px_rgba(255,49,49,0.3)]"></div>
          <p className="mt-6 text-gray-400 font-comic text-lg max-w-2xl mx-auto">
            Real experiences from real customers — printed with pride.
          </p>
        </div>

        {/* Carousel — pt-10 on CarouselContent gives the floating -top-6 quote badge room within the viewport */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 items-stretch pt-10">
            {testimonials.map((t, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div
                  className={`flex flex-col h-full pt-12 pb-8 px-8 rounded-2xl bg-[#112238] backdrop-blur-sm border border-white/5 relative group transition-all duration-300 ${t.hoverClass}`}
                >
                  {/* Quote Icon — floated above card, pt-10 on parent ensures it remains visible */}
                  <div className="absolute -top-6 left-8">
                    <div
                      className={`w-12 h-12 bg-black rounded-full border-2 flex items-center justify-center ${t.accentClass}`}
                    >
                      <Quote className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 text-primary mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  {/* Quote text — grows to fill space */}
                  <p className="text-gray-300 font-comic italic leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author — pinned to bottom */}
                  <div className="flex items-center border-t border-white/5 pt-6 mt-6">
                    <div className={`w-10 h-10 rounded-full bg-linear-to-br from-gray-700 to-black border-2 mr-4 flex items-center justify-center`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-neon text-sm tracking-wide">
                        {t.name}
                      </h4>
                      <span
                        className={`text-xs uppercase font-bold tracking-wider ${t.roleClass}`}
                      >
                        {t.role}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot Indicators */}
        <DotIndicators api={api} count={testimonials.length} />
      </div>
    </section>
  );
};

function DotIndicators({
  api,
  count,
}: {
  api: CarouselApi | undefined;
  count: number;
}) {
  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => api?.scrollTo(i)}
          className={`h-2 rounded-full transition-all duration-300 ${current === i
            ? "w-6 bg-linear-to-r from-secondary to-primary shadow-[0_0_10px_rgba(255,49,49,0.3)]"
            : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          aria-label={`Go to testimonial ${i + 1}`}
        />
      ))}
    </div>
  );
}
