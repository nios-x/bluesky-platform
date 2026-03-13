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
  },
  {
    question: "Can I change dumpster sizes after booking?",
    answer: "Absolutely! You can upgrade or downgrade your dumpster size anytime during your rental without extra fees. Just let us know, and we'll handle the switch."
  },
  {
    question: "Do you deliver same-day?",
    answer: "Yes! We offer same-day delivery in most areas for urgent projects. Flexible scheduling available to fit your timeline."
  }
];

const helpCards = [
  {
    icon: Truck,
    title: "Overfill?",
    description: "We charge per excess weight (usually $0.10/lb). Not a deal-breaker!"
  },
  {
    icon: Clock,
    title: "Underfull?",
    description: "No penalty—keep the dumpster as long as you need at no extra charge"
  },
  {
    icon: Zap,
    title: "Upgrade?",
    description: "Switch sizes anytime during your rental without extra fees"
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
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Quick Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-cyan-100 px-4 py-2 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-semibold text-cyan-600">No-Worry Guarantee</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Worried About Your Choice?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We make it easy to adjust your order. No penalties, no extra fees, just flexibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {helpCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-cyan-300 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-200 p-8 md:p-12 mb-20"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "1000+", label: "Happy Customers" },
              { number: "6+", label: "Cities Served" },
              { number: "4.9★", label: "Average Rating" }
            ].map((badge, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">{badge.number}</div>
                <p className="text-gray-600 font-semibold">{badge.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
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
