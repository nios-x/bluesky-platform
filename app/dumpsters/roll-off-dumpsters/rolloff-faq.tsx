"use client";

import { useState } from "react";
import {
    HelpCircle,
    ChevronDown
} from "lucide-react";

const faqs = [
    {
        q: "What is a roll-off dumpster?",
        a: "A roll-off dumpster is a large open-top waste container delivered by a specialized truck and rolled into place. They are commonly used for construction projects, home renovations, roofing jobs and large cleanouts."
    },
    {
        q: "What projects are roll-off dumpsters best for?",
        a: "Roll-off dumpsters are ideal for construction debris, demolition waste, roofing materials, estate cleanouts, moving projects, remodeling jobs and large household junk removal."
    },
    {
        q: "How do I choose the right dumpster size?",
        a: "The right size depends on your project type and debris volume. Smaller dumpsters work well for garage cleanouts while larger sizes are often better for renovations and construction projects. You can also use our AI recommendation tool for guidance."
    },
    {
        q: "What items cannot be placed in a roll-off dumpster?",
        a: "Restricted items commonly include hazardous chemicals, paint, tires, batteries, propane tanks, fuels and certain regulated materials. Restrictions may vary by location."
    },
    {
        q: "How long can I keep my dumpster rental?",
        a: "Most rentals include a specific rental period with the booking. Additional charges may apply if the dumpster is kept beyond the included days."
    },
    {
        q: "Do I need a permit for a roll-off dumpster?",
        a: "Permits are typically not required when the dumpster is placed on private property. However, if the container will be placed on a street or public area, local regulations may require one."
    }
];

export default function RollOffFaq() {

    const [openIndex, setOpenIndex] =
        useState<number | null>(0);

    return (

        <section className="py-20 bg-[#F8FAFC]">

            <div className="max-w-4xl mx-auto px-5">

                <h2 className="text-center text-3xl md:text-4xl font-black text-[#0A1628] mb-10">

                    Frequently Asked Questions

                </h2>

                <div className="space-y-5">

                    {faqs.map((item, index) => {

                        const open =
                            openIndex === index;

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

                                    <div className="px-16 pb-6 text-gray-600 leading-7 text-sm md:text-base">

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