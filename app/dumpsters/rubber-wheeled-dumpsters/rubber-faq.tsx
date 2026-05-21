"use client";

import { useState } from "react";
import {
    HelpCircle,
    ChevronDown
} from "lucide-react";

const faqs = [
    {
        q: "What is a rubber-wheeled dumpster?",
        a: "Rubber-wheeled dumpsters use protective wheels designed to reduce surface impact and help protect driveways, concrete and paved areas from damage."
    },
    {
        q: "How long can I keep the dumpster?",
        a: "Rental periods vary by location and package. Most rentals include a set number of days. Additional charges may apply if the dumpster is kept beyond the included period."
    },
    {
        q: "Will the delivered dumpster look exactly like the pictures?",
        a: "Not always. Container appearance, color, branding and style may vary depending on local hauling partners and equipment availability."
    },
    {
        q: "Can I place a dumpster on my driveway?",
        a: "Yes. Rubber-wheeled dumpsters are specifically chosen for residential projects and are designed to be safer for driveways and surfaces."
    },
    {
        q: "How do I choose the right dumpster size?",
        a: "Use our AI Dumpster Recommendation tool to receive personalized size suggestions based on your project type and debris amount."
    }
];

export default function RubberFaq() {
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