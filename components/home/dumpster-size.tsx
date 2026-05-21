"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

const dumpsterTypes = [
  {
    type: "roll-off",
    title: "Roll-off Dumpsters",
    color: "blue",
    image: "/Dumpster/Roll-off Dumpsters/30 yard roll off 1@1.5x.jpg",
    border: "border-blue-300",
    text: "text-blue-900",
    price: "$295",
    priceBg: "bg-blue-600",
    priceText: "text-white",
    sizes: [
      { label: "10 Yard", slug: "10-yard" },
      { label: "20 Yard", slug: "20-yard" },
      { label: "30 Yard", slug: "30-yard" },
      { label: "40 Yard", slug: "40-yard" },
    ],
    features: [
      "Heavy-duty construction",
      "Easy loading from ground level",
      "Ideal for construction debris",
    ],
    detailsUrl: "/dumpsters/roll-off-dumpsters",
    description:
      "Perfect for large construction projects, home renovations, and commercial waste disposal",
  },
  {
    type: "rubber-wheeled",
    title: "Rubber-wheeled Dumpsters",
    color: "cyan",
    image:
      "/Dumpster/Rubber-wheeled Dumpsters/20 Yard Rubber tire trailor (3)(1)@1.5x.jpg",
    border: "border-cyan-300",
    text: "text-cyan-900",
    price: "$350",
    priceBg: "bg-cyan-600",
    priceText: "text-white",
    sizes: [
      { label: "10 Yard", slug: "10-yard" },
      { label: "20 Yard", slug: "20-yard" },
      { label: "30 Yard", slug: "30-yard" },
    ],
    features: [
      "Surface-friendly rubber wheels",
      "Perfect for asphalt & concrete",
      "Residential-friendly design",
    ],
    detailsUrl: "/dumpsters/rubber-wheeled-dumpsters",
    description:
      "Ideal for residential driveways and areas where surface protection is essential",
  },
  {
    type: "permanent",
    title: "Permanent Dumpsters",
    color: "purple",
    image:
      "/Dumpster/Permanent Dumpsters/8 yard front load 1@1.5x.jpg",
    border: "border-purple-300",
    text: "text-purple-900",
    price: "$125/month",
    priceBg: "bg-purple-600",
    priceText: "text-white",
    sizes: [
      { label: "2 Yard", slug: "2-yard" },
      { label: "4 Yard", slug: "4-yard" },
      { label: "6 Yard", slug: "6-yard" },
      { label: "8 Yard", slug: "8-yard" },
    ],
    features: [
      "Commercial-grade durability",
      "Regular pickup schedules",
      "Lockable lids available",
    ],
    detailsUrl: "/dumpsters/permanent-dumpsters",
    description:
      "Long-term waste management solutions for businesses and multi-unit properties",
  },
];

export default function DumpsterTypeSelection() {
  return (
    <section
      id="dumpster-services"
      className="py-14 md:py-20 px-4 bg-gradient-to-b from-white via-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Dumpster Type
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
            Select the perfect dumpster for your project needs
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {dumpsterTypes.map((type) => (
            <div
              key={type.title}
              className={`
                rounded-3xl 
                border-2 
                ${type.border}
                bg-white 
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-300
                flex 
                flex-col
                overflow-hidden
                p-5 md:p-6
                h-full
                hover:-translate-y-2
              `}
            >
              {/* Image */}
              <div className="relative w-full h-48 sm:h-56 flex justify-center mb-5">
                <Image
                  src={type.image}
                  alt={type.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3
                className={`text-xl sm:text-2xl font-bold mb-3 ${type.text}`}
              >
                {type.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm sm:text-base mb-5">
                {type.description}
              </p>

              {/* Pricing */}
              <div className="mb-4">
                <span
                  className={`
                    px-4 py-2 rounded-full text-sm font-bold
                    ${type.priceBg}
                    ${type.priceText}
                  `}
                >
                  Starting from {type.price}
                </span>
              </div>

              {/* Sizes */}
              <div className="mb-5">
                <span className={`font-semibold ${type.text}`}>
                  Available Sizes:
                </span>

                <div className="flex flex-wrap gap-2 mt-3">
                  {type.sizes.map((size) => (
                    <Link
                      key={size.slug}
                      href={`${type.detailsUrl}/${size.slug}`}
                      className={`
                        px-4 py-2 rounded-full text-sm font-semibold
                        transition-all duration-300
                        hover:scale-105 border

                        ${
                          type.color === "blue"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : ""
                        }

                        ${
                          type.color === "cyan"
                            ? "bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
                            : ""
                        }

                        ${
                          type.color === "purple"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            : ""
                        }
                      `}
                    >
                      {size.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-grow">
                {type.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm sm:text-base"
                  >
                    <Star
                      className={`
                        w-5 h-5 mr-2 flex-shrink-0

                        ${
                          type.color === "blue"
                            ? "text-blue-500"
                            : type.color === "cyan"
                            ? "text-cyan-500"
                            : "text-purple-500"
                        }
                      `}
                      fill="currentColor"
                    />

                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Link
                href={type.detailsUrl}
                className={`
                  mt-auto
                  w-full
                  py-3
                  rounded-xl
                  text-center
                  font-semibold
                  transition-all
                  duration-300

                  ${
                    type.color === "blue"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : ""
                  }

                  ${
                    type.color === "cyan"
                      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                      : ""
                  }

                  ${
                    type.color === "purple"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : ""
                  }
                `}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}