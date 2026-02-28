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
    title: "Schedule a call/ visit",
    description: `Submit your information ont the "Contact Us" form, and our sales team will reach out to schedule a call/video call or a visit to our location in Guangzhhou, china, to answer any questions`
  },
  {
    step: "STEP 2",
    title: "Order Your Machine",
    description: "Using one of our recommended lenders or your own funding, you will pay for your machine, and it will be reserved for delivery"
  },
  {
    step: "STEP 3",
    title: "Set up your Business",
    description: "Launch your phone case vending empire: create your brand, plan your marketing strategy, recruit a team, and ensure you meet local requirements to dominate your local market"
  },
  {
    step: "STEP 4",
    title: "Receive Your Machine",
    description: "The most exciting day! You will receive your machine and schedule comprehensive training wit our support team"
  },
  {
    step: "STEP 5",
    title: "Learn Your Machine",
    description: "Our Support team ensures you are from day one. We provide everyt from machine setup to in depth t. With our help, you will start crec stunning, high quality phone case immediately"
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
    <section className="relative overflow-hidden py-16 bg-black">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-32 left-32 w-[180px] h-[180px] bg-secondary opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
        <div className="absolute top-[calc(80%-128px)] right-32 w-[180px] h-[180px] bg-primary opacity-15 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-6 tracking-tighter">
            <span className="text-neon-blue">HOW DO WE</span> WORK
          </h2>
          <div className="h-1.5 w-16 bg-linear-to-r from-pink-500 to-cyan-400 mx-auto rounded-full mt-5"></div>
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
