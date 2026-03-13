"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  // deterministic positions (no Math.random)
  left: `${10 + ((i * 7) % 80)}%`,
  top: `${15 + ((i * 11) % 70)}%`,
  duration: 6 + (i % 4), // between 6–9 seconds
  delay: (i % 5) * 0.8, // 0, 0.8, 1.6, 2.4, 3.2
}));

export default function Hero() {
  return (
    <div className="w-full overflow-hidden">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
        {/* Animated Background Gradient */}
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

        {/* Floating subtle particles */}
        <div className="absolute inset-0 pointer-events-none">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: p.left,
                top: p.top,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        {/* ---------------- TEXT CONTENT ---------------- */}
        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-white"
          >
            {/* Badge */}
            <div className="inline-block px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs md:text-sm uppercase tracking-widest">
              Women-Owned • Michigan Proud
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold mt-6 leading-tight">
              About <span className="text-sky-400">Blue Sky Disposal</span>
            </h1>

            <div className="h-[3px] bg-sky-400 mx-auto mt-4 w-[180px]" />

            {/* Subtext */}
            <p className="mt-6 text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Empowering Michigan with affordable, reliable, and eco-friendly
              dumpster rentals.
            </p>

            {/* Bold line */}
            <p className="mt-4 text-3xl md:text-5xl font-semibold text-white">
              Women-Led Company
            </p>

            {/* Tagline */}
            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Book your dumpster with a business that values honesty, speed, and
              community impact.
            </p>
          </motion.div>
        </div>

        {/* Bottom Diagonal Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg
            className="relative block w-full h-[110px]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path d="M1200 0L0 0 892.25 114.72 1200 0z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ---------------- QUOTE SECTION ---------------- */}
      <section className="relative py-32 px-4 bg-white text-center">
        {/* big soft watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
          <img
            src="https://cdn-icons-png.flaticon.com/512/194/194915.png"
            alt="Watermark"
            className="w-96 h-96 object-contain"
          />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl italic leading-snug font-serif text-gray-800 mb-6">
            “The greatest threat to our planet is the belief
            <br />
            that someone else will save it.”
          </h2>

          <p className="text-xl text-gray-600">— Robert Swan</p>
        </div>
      </section>
    </div>
  );
}
