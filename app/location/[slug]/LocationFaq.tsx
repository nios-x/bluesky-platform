"use client";

import { useState } from "react";
import {
    HelpCircle,
    ChevronDown
} from "lucide-react";

interface LocationFaqProps {
    county: string;
    city: string;
}

export default function LocationFaq({ county, city }: LocationFaqProps) {

    const faqs = [
        {
            q: `How much does dumpster rental cost in ${city}?`,
            a: `Dumpster rental prices in ${city} vary based on dumpster size, rental period, and disposal type. Our transparent pricing model ensures no hidden fees. Contact us or use our online pricing tool to get an instant quote for your specific needs.`
        },
        {
            q: "What dumpster size do I need?",
            a: "The right dumpster size depends on your project type and debris volume. Small dumpsters work well for garage cleanouts and spring cleaning, while larger sizes are ideal for renovations and construction projects. Use our AI recommendation tool for personalized guidance based on your project details."
        },
        {
            q: "How long can I keep the dumpster?",
            a: "Most of our dumpster rentals include a standard rental period of 7 days. Extended rental periods are available with additional charges. We offer flexible rental terms to accommodate your project timeline. Contact us for specific rental period options."
        },
        {
            q: "What items are prohibited?",
            a: "Prohibited items typically include hazardous chemicals, paint, tires, batteries, propane tanks, and oils. Electronics, appliances, and certain metals may also be restricted. Check with our team for a complete list of prohibited items, as restrictions may vary by location and disposal facility."
        },
        {
            q: "Do you offer same-day delivery?",
            a: `Yes, we offer same-day dumpster delivery in ${city} when you book early in the day. Delivery depends on availability and location. For guaranteed same-day service, we recommend calling our team at 586-412-3762 to confirm availability.`
        },
        {
            q: `Do I need a permit in ${city}?`,
            a: `Permits are typically not required when placing a dumpster on private property. However, if your dumpster will be placed on a street or public area in ${city}, local regulations may require a permit. We recommend checking with your local municipality or contacting our team for specific permit requirements in your area.`
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (

        <section className="py-20 bg-[#F8FAFC]">

            <div className="max-w-4xl mx-auto px-5">

                <h2 className="text-center text-3xl md:text-4xl font-black text-[#0A1628] mb-10">

                    Frequently Asked Questions

                </h2>

                <div className="space-y-5">

                    {faqs.map((item, index) => {

                        const open = openIndex === index;

                        return (

                            <div
                                key={index}
                                className="
                                bg-white
                                rounded-[28px]
                                border
                                border-slate-200
                                overflow-hidden
                                shadow-sm
                                hover:shadow-lg
                                transition
                                "
                            >

                                <button
                                    onClick={() =>
                                        setOpenIndex(
                                            open
                                                ? null
                                                : index
                                        )
                                    }
                                    className="
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    gap-5
                                    p-6
                                    text-left
                                    "
                                >

                                    <div className="flex gap-4">

                                        <HelpCircle
                                            className="
                                            w-6
                                            h-6
                                            text-[#DAA520]
                                            flex-shrink-0
                                            mt-1
                                            "
                                        />

                                        <h3
                                            className="
                                            font-bold
                                            text-[#0A1628]
                                            text-base
                                            md:text-lg
                                            "
                                        >
                                            {item.q}
                                        </h3>

                                    </div>

                                    <ChevronDown
                                        className={`
                                            h-5
                                            w-5
                                            text-[#1B3A6B]
                                            flex-shrink-0
                                            transition-transform
                                            duration-300
                                            ${open
                                                ? "rotate-180"
                                                : ""
                                            }
                                            `}
                                    />

                                </button>

                                <div
                                    className={`
                                    transition-all
                                    duration-300
                                    overflow-hidden
                                    ${open
                                            ? "max-h-40 opacity-100"
                                            : "max-h-0 opacity-0"
                                        }
                                    `}
                                >

                                    <div className="px-16 pb-6 text-slate-600 leading-7 text-sm md:text-base">

                                        {item.a}

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

        </section>

    );

}
