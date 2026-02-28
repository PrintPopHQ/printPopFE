import { Hero } from "@/app/franchise/Hero";
import { HowWeWork } from "@/app/franchise/HowWeWork";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Hero />
      <HowWeWork />
    </div>
  );
}
