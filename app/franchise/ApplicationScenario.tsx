
import { SectionCard } from "@/components/landing/SectionCard";
import applicationScenario from "@/public/images/printpop-application-scenario.jpg"

const scenarios = [
  {
    id: 1,
    title1: "Shopping Malls &",
    title2: "Commercial Areas",
    description: "Printpop franchises bring personalised phone cases to high-traffic shopping malls and commercial areas, perfectly suited for trend-seeking young consumers. Our custom phone case concept leverages impulse buying and social sharing, using seasonal, celebrity, and IP-inspired templates. By placing Printpop in busy commercial zones, franchisees tap into vibrant foot traffic where personal expression drives purchases. The model combines fast, engaging in-store experiences with viral appeal, making personalised phone cases an ideal product for malls and shopping districts. Printpop franchises seamlessly integrate into commercial spaces, turning creativity and style into a profitable retail opportunity while enhancing the shopping experience. 📱🛍️",
    image: applicationScenario.src,
    alt: "Shopping Malls & Commercial Areas",
  },
  {
    id: 2,
    title1: "Exhibitions &",
    title2: "Pop-Up Events",
    description: "Printpop franchises thrive at exhibitions and pop-up events, ideal for brand activations, IP collaborations, and limited-edition campaigns. Our personalised phone cases engage consumers through on-site customization, creating memorable keepsakes. Leveraging co-branded designs and limited-time offers, franchisees turn events into low-cost, high-efficiency merchandising opportunities that boost brand visibility and drive immediate sales. 📱✨",
    image: applicationScenario.src, // Using the same image as a placeholder for now
    alt: "Exhibitions & Pop-Up Events",
  },
  {
    id: 3,
    title1: "Airports &",
    title2: "Transport Hubs",
    description: "Printpop franchises excel in airports and transport hubs, capturing busy foot traffic during idle wait times. Our personalised phone cases attract travelers seeking gifts or spontaneous customization, offering “take a piece of the journey” keepsakes. By providing city-themed templates and a multilingual interface, franchisees create a convenient, engaging, and memorable shopping experience. These locations turn waiting time into an opportunity for unique, high-visibility sales, making Printpop an ideal fit for transport hubs where travelers value personal expression, souvenirs, and quick, creative retail interactions. 📱✈️",
    image: applicationScenario.src, // Using the same image as a placeholder for now
    alt: "Airports & Transport Hubs",
  },
  {
    id: 4,
    title1: "Campuses &",
    title2: "Educational Spaces",
    description: "Printpop franchises are a perfect fit for campuses and educational spaces, vibrant youth-driven environments where personal identity and self-expression thrive. Our personalised phone cases appeal to students for graduation gifts, club branding, or campus-themed designs, fostering strong emotional connections. By offering DIY templates for school badges, class themes, anime, and more, franchisees encourage creativity, repeat engagement, and social sharing. These locations turn everyday items into meaningful keepsakes while tapping into a highly engaged audience. Printpop’s presence in educational spaces combines convenience, fun, and personalization, making campuses an ideal setting for a custom phone case business. 📱🎓",
    image: applicationScenario.src, // Using the same image as a placeholder for now
    alt: "Campuses & Educational Spaces",
  },
  {
    id: 5,
    title1: "Tourist Attractions &",
    title2: "Theme Parks",
    description: "Printpop franchises are ideal for tourist attractions and theme parks, where emotion-driven purchase moments and high photo engagement dominate. Our personalised phone cases appeal to visitors seeking commemorative souvenirs or instant gifts. By integrating park mascots, local IPs, and event-themed designs, franchisees create real-time, memorable, and shareable experiences. These locations allow customers to capture the excitement of their visit in a unique, personal keepsake. Printpop turns vibrant tourist environments into high-visibility retail opportunities, combining creativity, personalization, and immediate gifting to enhance the visitor experience while driving sales. 📱🎢✨",
    image: applicationScenario.src, // Using the same image as a placeholder for now
    alt: "Tourist Attractions & Theme Parks",
  },
  {
    id: 6,
    title1: "Office Buildings &",
    title2: "Corporate Spaces",
    description: "Printpop franchises fit perfectly in office buildings and corporate spaces, offering personalised phone cases for branded gifts, staff rewards, and company culture expression. Employees engage with custom phone cases featuring logos, holiday themes, or team designs, fostering internal connection and loyalty. By enabling group orders and corporate customization channels, franchisees provide convenient, high-value solutions for companies seeking unique, meaningful merchandise. These locations turn everyday items into tools for engagement, recognition, and brand visibility, making Printpop an ideal partner for businesses that want to combine personalization, practicality, and memorable gifting experiences in the workplace. 📱🏢✨",
    image: applicationScenario.src, // Using the same image as a placeholder for now
    alt: "Office Buildings & Corporate Spaces",
  },
];

export const ApplicationScenario = () => {
  return (
    <section className="relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div>
          {scenarios.map((scenario, index) => {
            // First item: image right (default flex-row or flex-row md:flex-row)
            // Second item: image left (flex-row-reverse md:flex-row-reverse)
            const isImageLeft = index % 2 !== 0;

            return (
              <div key={scenario.id} className="py-16">
                <SectionCard 
                  className={`flex flex-col md:flex-row items-center gap-16 ${
                    isImageLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div 
                    className={`md:w-1/2 space-y-8 animate-in fade-in duration-1000 ${
                      isImageLeft ? "slide-in-from-right-4" : "slide-in-from-left-4"
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
                        Application Scenario {scenario.id}
                      </span>
                      <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-6 uppercase leading-tight">
                        <span className="text-shadow-[0_0_30px_rgba(92,225,230,0.8)]">{scenario.title1}</span> <br />
                        <span className="text-shadow-[0_0_30px_rgba(92,225,230,0.8)] text-neon-blue">{scenario.title2}</span>
                      </h2>
                    </div>

                    <p className="text-gray-400 font-comic text-lg leading-relaxed max-w-xl">
                      {scenario.description}
                    </p>
                  </div>

                  <div 
                    className={`hidden md:block md:w-1/2 relative group animate-in fade-in duration-1000 ${
                      isImageLeft ? "slide-in-from-left-4" : "slide-in-from-right-4"
                    }`}
                  >
                    <div className="absolute inset-0 bg-linear-to-tr from-primary to-secondary blur-[80px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
                    <img
                      alt={scenario.alt}
                      className="relative z-10 w-full rounded-2xl border-2 border-gray-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                      src={scenario.image}
                    />
                  </div>
                </SectionCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
