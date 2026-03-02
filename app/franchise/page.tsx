import { Hero } from "@/app/franchise/Hero";
import { HowWeWork } from "@/app/franchise/HowWeWork";
import { ROICalculator } from "./ROICalculator";
import ContactUs from "./ContactUs";
import { ApplicationScenario } from "./ApplicationScenario";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Hero />
      <HowWeWork />
      <ROICalculator />
      <div id="contact">
        <ContactUs />
      </div>
      <ApplicationScenario />
    </div>
  );
}
