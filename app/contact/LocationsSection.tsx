"use client";

import { useState } from "react";

const LOCATIONS = [
  {
    id: "green-hills",
    name: "Green Hills Shopping Center",
    address: "Stockland Green Hills, 1 Molly Morgan Dr, East Maitland NSW 2323",
    query: "Stockland+Green+Hills,+1+Molly+Morgan+Dr,+East+Maitland+NSW+2323",
    status: "OPEN",
    color: "secondary",
    mapUrl: "https://maps.google.com/maps?q=Stockland+Green+Hills,+1+Molly+Morgan+Dr,+East+Maitland+NSW+2323&t=&z=15&ie=UTF8&iwloc=&output=embed"
  },
  {
    id: "uon",
    name: "University of Newcastle – Callaghan Campus",
    address: "University Drive, Callaghan, NSW 2308, Australia",
    query: "University+of+Newcastle+Callaghan+Campus",
    status: "Opening Soon",
    color: "primary",
    mapUrl: "https://maps.google.com/maps?q=University+Drive,+Callaghan,+NSW+2308,+Australia&t=&z=15&ie=UTF8&iwloc=&output=embed"
  }
];

export const LocationsSection = () => {
  const [activeId, setActiveId] = useState(LOCATIONS[0].id);
  const activeLocation = LOCATIONS.find(loc => loc.id === activeId) || LOCATIONS[0];

  return (
    <section className="relative py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 lg:gap-32 items-center">
          <div className="animate-in fade-in slide-in-from-left-4 duration-1000">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
              Visit Us IRL
            </span>
            <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="text-shadow-[0_0_30px_#FF3131]">PRINTPOP</span> <span className="text-neon-red">LOCATIONS</span>
            </h2>
            <p className="text-gray-400 font-comic text-lg mb-8 leading-relaxed">
              Find Printpop locations near you for personalised phone cases. Visit a local Printpop store to design a custom phone case with expert help, fast service, and high-quality printing. Discover where Printpop operates and start creating your unique phone case today. 📍📱
            </p>
            <div className="space-y-4">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setActiveId(loc.id)}
                  className={`flex items-center p-4 rounded-xl bg-gray-900/50 border transition-all duration-300 cursor-pointer ${
                    activeId === loc.id 
                      ? loc.id === 'green-hills' ? 'border-secondary ring-1 ring-secondary/30 bg-secondary/5' : 'border-primary ring-1 ring-primary/30 bg-primary/5'
                      : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${
                    activeId === loc.id 
                      ? loc.id === 'green-hills' ? 'bg-secondary text-black' : 'bg-primary text-white'
                      : loc.id === 'green-hills' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">{loc.name}</h4>
                    <p className="text-gray-500 text-sm">{loc.address}</p>
                  </div>
                  <span className={`text-sm font-bold uppercase ${
                    loc.id === 'green-hills' ? 'text-secondary' : 'text-primary'
                  } ${activeId === loc.id ? 'opacity-100' : 'opacity-50'}`}>
                    {loc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map Section */}
          <div className="relative h-[500px] w-full bg-gray-950 rounded-3xl overflow-hidden border-2 border-gray-800 shadow-[0_0_30px_rgba(92,225,230,0.1)] group/map animate-in zoom-in-95 duration-1000">
            <iframe
              title="Printpop Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              src={activeLocation.mapUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Map Status Overlay */}
            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md border border-gray-800 p-4 rounded-2xl shadow-2xl pointer-events-none">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Live Map Status</p>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2.5 animate-pulse"></div>
                <span className="text-white text-xs font-black uppercase tracking-wider">Viewing: {activeLocation.name}</span>
              </div>
            </div>

            {/* View on Google Maps Link */}
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${activeLocation.query}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-6 right-6 bg-black/80 backdrop-blur-md border border-gray-800 px-4 py-2 rounded-xl shadow-2xl text-white text-xs font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              View Larger Map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
