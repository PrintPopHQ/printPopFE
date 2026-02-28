import { Hero } from "@/app/franchise/Hero";
import { HowWeWork } from "@/app/franchise/HowWeWork";
import ContactUs from "./ContactUs";
import { ApplicationScenario } from "./ApplicationScenario";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Hero />
      <HowWeWork />
      <ContactUs />
      <ApplicationScenario />
    </div>
  );
}
