"use client";

import { useState } from "react";
import {
    HelpCircle,
    ChevronDown
} from "lucide-react";

const faqs = [
    {
        q: "What is a permanent dumpster service?",
        a: "Permanent dumpster service provides an ongoing waste collection solution for businesses, apartment communities, offices, restaurants and commercial properties with regularly scheduled pickups."
    },
    {
        q: "Who typically uses permanent dumpsters?",
        a: "Permanent dumpsters are commonly used by retail stores, offices, restaurants, warehouses, apartment complexes, schools and other properties that generate recurring waste."
    },
    {
        q: "How often are permanent dumpsters emptied?",
        a: "Pickup schedules vary depending on waste volume and business needs. Service may be scheduled daily, weekly, multiple times per week or customized to fit your requirements."
    },
    {
        q: "How do I determine the right dumpster size?",
        a: "Dumpster size depends on your property type, number of users and estimated waste volume. Larger businesses with higher waste output generally require larger containers or more frequent pickups."
    },
    {
        q: "Can I change my service schedule later?",
        a: "Yes. Service frequency and container size can typically be adjusted if your waste needs increase or decrease over time."
    },
    {
        q: "What materials are not allowed in permanent dumpsters?",
        a: "Hazardous materials, chemicals, batteries, flammable liquids, tires and certain regulated waste products are commonly restricted. Rules may vary by location."
    }
];

export default function PermanentFaq() {

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