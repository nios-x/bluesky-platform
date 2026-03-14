"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ClipboardList,
  Calendar,
  Package,
  Truck,
  ArrowRight,
  Clock,
  CheckCircle,
  Phone,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ui/image-with-fallback";

const steps = [
  {
    number: 1,
    title: "Online Booking",
    description:
      "Call or book online to discuss your project needs and get a free quote",
    icon: ClipboardList,
    image: "/images/step1.jpg",
  },
  {
    number: 2,
    title: "Choose Your Dumpster",
    description:
      "Select the perfect size for your residential or commercial project",
    icon: Package,
    image: "/images/step2.jpg",
  },
  {
    number: 3,
    title: "Schedule Delivery",
    description:
      "Pick a date and time that works best for your project timeline",
    icon: Calendar,
    image: "/images/step3.jpg",
  },
  {
    number: 4,
    title: "We Deliver",
    description:
      "Our professional team delivers the dumpster to your specified address",
    icon: Truck,
    image: "/images/step4.jpg",
  },
  {
    number: 5,
    title: "Fill at Your Pace",
    description:
      "Take your time filling the dumpster according to your project schedule",
    icon: Clock,
    image: "/images/step5.jpg",
  },
  {
    number: 6,
    title: "We Pick Up",
    description:
      "Call us when you're ready and we'll haul away your waste responsibly",
    icon: CheckCircle,
    image: "/images/step6.jpg",
  },
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const itemsPerView = 3;
  const maxSlides = Math.ceil(steps.length / itemsPerView);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % maxSlides);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, maxSlides]);

  const nextSlide = () => {
    setIsAutoPlay(false); // Stop auto-play when user clicks
    setCurrentStep((prev) => (prev + 1) % maxSlides);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoPlay(false); // Stop auto-play when user clicks
    setCurrentStep((prev) => (prev - 1 + maxSlides) % maxSlides);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const handleIndicatorClick = (idx: number) => {
    setIsAutoPlay(false); // Stop auto-play when user clicks
    setCurrentStep(idx);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const visibleSteps = steps.slice(
    currentStep * itemsPerView,
    (currentStep + 1) * itemsPerView
  );
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl" />
      </div>

      {/* Section Heading */}
      <div className="text-center mb-12 md:mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-3">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span className="text-xs md:text-sm font-semibold text-blue-600">Simple Process</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3 text-gray-900 tracking-tight">
          6 Easy Steps to Your Dumpster
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-medium max-w-2xl mx-auto">
          From booking to pickup — we handle the rest
        </p>
      </div>

      {/* Steps Carousel */}
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Carousel Container */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleSteps.map((step, index) => {
              const Icon = step.icon;
              const actualIndex = currentStep * itemsPerView + index;

              return (
                <motion.div
                  key={actualIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="h-full bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300">
                    {/* Step Number Circle */}
                    <div className="relative mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="absolute -top-5 -left-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg z-10"
                      >
                        <span className="text-white font-bold text-lg">{step.number}</span>
                      </motion.div>
                      
                      {/* Icon */}
                      <div className="ml-10 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3">
                      {step.description}
                    </p>

                    {/* Image */}
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 mb-3 group-hover:scale-105 transition-transform duration-300">
                      <ImageWithFallback
                        src={step.image}
                        alt={step.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Navigation Buttons */}
          {steps.length > itemsPerView && (
            <div className="flex items-center justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {Array.from({ length: maxSlides }).map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleIndicatorClick(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentStep === idx
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Ready to get started?
            </h3>
            <p className="text-gray-600 text-sm md:text-base mb-6 max-w-2xl mx-auto">
              Begin your dumpster rental journey now. Click below to check availability and book your size.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/checkout">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold h-12 px-8 rounded-xl text-base">
                    Check Availability
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/contact">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold h-12 px-8 rounded-xl text-base">
                    Call Our Team
                    <Phone className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
