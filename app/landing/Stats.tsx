export const Stats = () => {
  return (
    <section className="py-12 md:py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Cases Printed */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-neon text-neon-blue text-5xl md:text-6xl font-bold tracking-tighter">
              6K+
            </h2>
            <p className="text-gray-400 font-comic-sans text-lg tracking-wide">
              Cases printed
            </p>
          </div>

          {/* Happy Customers */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h2 className="font-neon text-neon-red text-5xl md:text-6xl font-bold tracking-tighter">
              2k+
            </h2>
            <p className="text-gray-400 font-comic-sans text-lg tracking-wide">
              Happy customers
            </p>
          </div>

          {/* Customer Reviews */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <h2 className="font-neon text-neon-blue text-5xl md:text-6xl font-bold tracking-tighter">
              4.7+
            </h2>
            <p className="text-gray-400 font-comic-sans text-lg tracking-wide">
              customer reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
