import { BookingWidget } from "./BookingWidget";

export function Hero() {
  return (
    <section className="relative min-h-[700px] lg:min-h-[900px] flex items-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute justify-center inset-0 w-full h-full">
        <img
          src="/Dumpster/hero.png"
          alt="Blue Sky Disposal Services"
          className="w-full h-full object-cover brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#142A52]/70 via-[#142A52]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
          Book a Dumpster in Seconds - Anywhere in Michigan
        </h1>

        <p className="text-lg text-white/95 mb-12 drop-shadow-lg">
          Instantly compare dumpster types and sizes, get an estimate, and schedule delivery.
        </p>

        {/* Booking Box Component */}
        <BookingWidget />
      </div>
    </section>
  );
}