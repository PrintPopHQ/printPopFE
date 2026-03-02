"use client";

import React, { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

const steps = [
  {
    step: "STEP 1",
    title: "Submit Your Application",
    description: "Begin by applying to operate a personalised phone case vending machine. Our team will review your application and explain how the turnkey custom phone cases system works."
  },
  {
    step: "STEP 2",
    title: "Discovery Call",
    description: "Next, join a call with the PrintPop team. Learn exactly how the vending machine works, how custom phone cases are produced on demand, and the full support you will receive."
  },
  {
    step: "STEP 3",
    title: "Secure Your Machine and Location",
    description: "Once approved, you’ll receive your vending machine, branding, and a ready-to-go retail location. PrintPop ensures the location is ideal for high foot traffic to maximise custom phone cases sales."
  },
  {
    step: "STEP 4",
    title: "Installation and Training",
    description: "PrintPop handles machine installation, system setup, and training. You’ll learn how to manage your personalised phone case vending machine efficiently and keep operations smooth."
  },
  {
    step: "STEP 5",
    title: "Launch and Operate",
    description: "Go live under the PrintPop brand. We continue supporting you with marketing guidance, technical support, and system updates. You can start earning from your custom phone cases vending machine immediately."
  }
];

export const HowWeWork = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative overflow-hidden py-24 bg-black">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-32 left-32 w-[180px] h-[180px] bg-secondary opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
        <div className="absolute top-[calc(80%-128px)] right-32 w-[180px] h-[180px] bg-primary opacity-15 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">
            <span className="text-neon-blue">Set Up Once.</span> Earn Daily
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300 font-comic px-4">
            Starting your personalised phone case vending machine business with PrintPop is simple. We guide you through a 5-step process to make it easy to get operational and profitable.
          </p>
          <div className="h-1.5 w-16 bg-linear-to-r from-primary to-secondary mx-auto rounded-full mt-6"></div>
        </div>

        <div className="relative w-full mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6 pb-6 pt-4">
              {steps.map((s, index) => (
                <CarouselItem
                  key={index}
                  className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-auto"
                >
                  <div className="flex flex-col h-full min-h-[320px] p-8 rounded-xl bg-[#162234] text-white border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-6 tracking-wider">{s.step}</h3>
                    <h4 className="text-lg font-semibold mb-4 text-gray-200">{s.title}</h4>
                    <p className="text-[15px] text-gray-300 leading-relaxed font-comic">
                      {s.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center items-center gap-6 mt-12">
              <CarouselPrevious className="static transform-none w-12 h-12 border-2 border-white/20 bg-transparent hover:bg-transparent hover:text-white hover:border-white/60 text-white rounded-full flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 transition-all" />
              <CarouselNext className="static transform-none w-12 h-12 border-2 border-white/20 bg-transparent hover:bg-transparent hover:text-white hover:border-white/60 text-white rounded-full flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 transition-all" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
