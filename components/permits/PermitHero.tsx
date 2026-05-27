import Link from "next/link";

export default function PermitHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0A1628] via-[#1B3A6B] to-[#0A1628] text-white">

            <div className="max-w-7xl mx-auto px-6 py-24">

                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    <div>

                        <span className="px-4 py-2 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-sm">

                            Dumpster Permit Guide

                        </span>

                        <h1 className="text-5xl font-bold leading-tight mt-6">

                            Dumpster Permits

                            <span className="block text-[#FFD700]">

                                Know When You Need One

                            </span>

                        </h1>

                        <p className="text-white/80 mt-6 text-lg leading-8">

                            Permit requirements vary by city and placement location. Learn when permits may be required and how to avoid delivery delays.

                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">

                            <Link
                                href="/contact"
                                className="bg-[#FFD700] text-black px-6 py-4 rounded-xl font-semibold"
                            >
                                Order Online
                            </Link>

                            <a
                                href="tel:5864123762"
                                className="border border-white/20 px-6 py-4 rounded-xl"
                            >
                                Call Now
                            </a>

                        </div>

                    </div>

                    <div>

                        <img
                            src="/images/permit-hero.png"
                            className="rounded-3xl"
                            alt=""
                        />

                    </div>

                </div>

            </div>

        </section>
    );
}