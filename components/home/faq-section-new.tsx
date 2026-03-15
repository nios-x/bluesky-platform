"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, HelpCircle, Shield, Zap, Truck, Clock } from "lucide-react";

const faqs = [
  {
    question: "How much is a dumpster rental?",
    answer: "Pricing depends on the dumpster size, rental period, and your address. We offer transparent pricing with no hidden fees. Use our calculator to get an instant estimate for your specific needs."
  },
  {
    question: "What size dumpster do I need?",
    answer: "For small cleanouts, a 10-yard dumpster works great. For medium projects like renovations, choose 15-20 yard. For large demolitions, go with 30-40 yard. Our smart calculator recommends the perfect size based on your project details."
  },
  {
    question: "How long can I keep the dumpster?",
    answer: "Standard rental is 7 days, but we offer flexible options from 3 days to 30+ days. No penalties for keeping it longer—just extend your rental as needed at any time."
  },
  {
    question: "What items are prohibited?",
    answer: "Hazardous materials, batteries, tires, electronics, paints, and asbestos are restricted. Please review our detailed prohibited items list before booking. Contact us if you're unsure about specific materials."
  }
];

export default function FAQSectionNew() {
  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator-section');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="faq-section" className="py-20 md:py-28 px-4 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Questions & Answers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to know about dumpster rentals in Michigan
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <AccordionItem 
                  value={`item-${i}`} 
                  className="border-2 border-gray-200 rounded-2xl px-6 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <AccordionTrigger className="text-lg font-bold text-gray-900 hover:text-blue-600 py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-base pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          {/* Still Have Questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Our team is ready to help! Contact us for personalized assistance with your dumpster rental.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={scrollToCalculator}
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 rounded-xl text-base transition-all w-full sm:w-auto"
              >
                Try Calculator
              </button>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 rounded-xl text-base">
                  Contact Us
                </Button>
              </Link>
              <Link href="tel:+15551234567" className="w-full sm:w-auto">
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl text-base border-2 border-white">
                  Call Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
