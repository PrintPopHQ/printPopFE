export const Locations = () => {
  return (
    <section className="relative">
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
              {/* Green Hills Location */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Stockland+Green+Hills,+1+Molly+Morgan+Dr,+East+Maitland+NSW+2323"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-secondary group transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mr-4 group-hover:bg-secondary group-hover:text-black transition-colors duration-300">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">Green Hills Shopping Center</h4>
                  <p className="text-gray-500 text-sm">Stockland Green Hills, 1 Molly Morgan Dr, East Maitland NSW 2323</p>
                </div>
                <span className="text-secondary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">OPEN</span>
              </a>

              {/* UoN Location */}
              <div className="flex items-center p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-primary group transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">University of Newcastle – Callaghan Campus</h4>
                  <p className="text-gray-500 text-sm">University Drive, Callaghan, NSW 2308, Australia</p>
                </div>
                <span className="text-primary text-sm font-bold opacity-100 transition-opacity duration-300 uppercase">Opening Soon</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Section */}
          <div className="relative h-[500px] w-full bg-gray-950 rounded-3xl overflow-hidden border-2 border-gray-800 shadow-[0_0_30px_rgba(92,225,230,0.1)] group/map animate-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 bg-[#050505] opacity-80">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  opacity: 0.3
                }}
              ></div>
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-700/50 rounded-full opacity-10"></div>
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 border border-gray-700/50 rounded-full opacity-10"></div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line stroke="#333" strokeWidth="2" x1="20%" x2="80%" y1="40%" y2="70%"></line>
                <line stroke="#333" strokeWidth="2" x1="80%" x2="50%" y1="70%" y2="30%"></line>
                <line stroke="#333" strokeWidth="2" x1="50%" x2="20%" y1="30%" y2="40%"></line>
              </svg>
            </div>

            {/* Pins */}
            {/* Green Hills Pin */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Stockland+Green+Hills,+1+Molly+Morgan+Dr,+East+Maitland+NSW+2323"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-[30%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin cursor-pointer"
            >
              <div className="w-4 h-4 bg-secondary rounded-full shadow-[0_0_15px_#FF3131] animate-pulse"></div>
              <div className="h-16 w-1 bg-linear-to-b from-secondary to-transparent"></div>
            </a>

            {/* UoN Pin */}
            <div className="absolute top-[40%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin">
              <div
                className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#5CE1E6] animate-pulse"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div className="h-12 w-1 bg-linear-to-b from-primary to-transparent"></div>
            </div>

            <div className="absolute top-[70%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin">
              <div
                className="w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7] animate-pulse"
                style={{ animationDelay: '1s' }}
              ></div>
              <div className="h-20 w-1 bg-linear-to-b from-purple-500 to-transparent"></div>
            </div>

            {/* Map Status Overlay */}
            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md border border-gray-800 p-4 rounded-2xl shadow-2xl">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Live Map Status</p>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2.5 animate-pulse"></div>
                <span className="text-white text-xs font-black uppercase tracking-wider">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
