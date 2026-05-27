"use client";

import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Smartphone, Send, CheckCircle2, Star, Award, Users, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      name: "Tammy Daniels",
      content: "I don't often do reviews but highly thought this company deserved it! Blue Sky Disposal was so very helpful! I spoke to a gentlemen named Tony he was so helpful on deciding what we needed for our job size. He was also so kind to have offered to help because we may have been short handed and he lived in the area. When I asked him how much he charged he said whatever your mom can afford is fine! We ended up having enough help but what a kind gesture! The world sure needs more of this! Everything from this company was perfect! Highly recommend Thank you!",
      time: "a year ago",
      rating: 5,
    },
    {
      name: "Janet Bott",
      content: "Excellant service, would use again and recommend for anyone who needs this service.",
      time: "a year ago",
      rating: 5,
    },
    {
      name: "Enuff",
      content: "So grateful!! This was my 3rd time using Blue Sky, with a 4th time in the works very soon!!! I'm very grateful for the easy/stress-free process of scheduling/delivery, etc. But what I'm MOST grateful for, and why I will continue to use and highly recommend Blue Sky, is because I have Lupus and not always able to fully utilize each day of my rentals. Blue Sky has been beyond patient with me, and on several occasions they've graciously made changes and accommodations in order to help me!!! THAT RIGHT THERE, in and of itself is above and beyond what most companies would ever allow/do! I'm very grateful that the folks at Blue Sky are good people, with good hearts!!!!",
      time: "a year ago",
      rating: 5,
    },
    {
      name: "Mark Cooley",
      content: "Everything was great.",
      time: "a year ago",
      rating: 5,
    },
    {
      name: "Dominic Galia",
      content: "Appreciated how Tony handled our situation. He google mapped our location and suggested we use the rubber tire roll off to reduce potential damage to the newer driveway PLUS allowed a longer duration at reasonable cost for the services. You will be hearing from me soon on Phase 2. Thanks very much.",
      time: "a year ago",
      rating: 5,
    },
    {
      name: "Donika Pergega",
      content: "This is my 3rd time i have used Blue Sky Disposal. I booked 20 yard and a 30 yard dumpster on website under one minute on the website. The user experience, price and service was gratis. Will use them again. Highly recommend.",
      time: "a year ago",
      rating: 5,
    },
    {
      name: "V Vms",
      content: "Blue Sky girls exceed my expectations. Annie was very helpful and gave me a great price on the 30 yd dumpster. Highly recommend this company!! I am very happy with the services and will use them again.",
      time: "a year ago",
      rating: 5,
    },
    {
      name: "Stef",
      content: "Blue sky disposal is a great company to work with. They have a fast response and delivery. All members are friendly, they take time to listen to your needs. Seamless process; Highly recommended!!!",
      time: "a year ago",
      rating: 5,
    },
  ];

  const faqItems = [
    {
      question: "If I cancel my Dumpster Rental order do I get the full refund back?",
      answer: "If you have purchased your Dumpster via credit card through Stripe, PayPal, Authorized.net and would like to cancel your order, Blue Sky Disposal reserves the right to charge 10% of your total cost and will refund the difference on your credit card. There are no cancelation fees if you only use Authorized.net merchant and your Dumpster delivery is canceled on the same day of booking.",
    },
    {
      question: "What if I need to change the delivery date for my Dumpster Delivery order?",
      answer: "You may change the date of the Dumpster Drop off delivery at least 24 hours prior to the delivery. Please call customer service at 586-412-3762 to make changes to your order.",
    },
    {
      question: "Who do I call if I need an emergency delivery of a Dumpster?",
      answer: "You may call the number displayed on the website. Emergency services are available based upon location. Extra charges may occur.",
    },
    {
      question: "What can you put in a dumpster rental?",
      answer: "Household trash, Wooden furniture, Household appliances, Yard Waste, Dirt, Empty aerosol cans, Demolition debris. The kind of waste you can put in a dumpster rental depends on the size of the container. Dumpsters are available in 6-, 8-, 12- and 20-yard sizes.",
    },
  ];

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trusted by over 10,000 satisfied customers across Michigan. Read their experiences with Blue Sky Disposal.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-sm">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.time}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Blue Sky Disposal */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Blue Sky Disposal</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Blue Sky Disposal offers a variety of dumpsters in Michigan, including Roll Off Dumpsters, Driveway Friendly Dumpsters, Compactor Dumpster Services, and Permanent Front load Dumpsters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed mb-8">
                Our goal is to help our customers choose the right equipment to properly dispose of their waste in the most efficient and environmentally conscious manner. We work with transfer stations and recycling facilities to ensure that all waste is disposed of properly and no hazardous materials are put into our disposal systems.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-blue-600 mb-1">20+</p>
                  <p className="text-xs text-gray-600 font-semibold">Years of Experience</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-blue-600 mb-1">1000+</p>
                  <p className="text-xs text-gray-600 font-semibold">Servicing Cities</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-blue-600 mb-1">10,000+</p>
                  <p className="text-xs text-gray-600 font-semibold">Customers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-blue-600 mb-1">110K+</p>
                  <p className="text-xs text-gray-600 font-semibold">Dumpsters Provided</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Woman-Led Company</h3>
              <p className="text-gray-700 leading-relaxed">
                Blue Sky Disposal is proud to be a woman-led company serving Michigan. Our commitment to excellence, customer service, and environmental responsibility sets us apart in the waste management industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Blue Sky Disposal */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Blue Sky Disposal?</h2>
            <p className="text-gray-600">Industry-leading service with exceptional customer care</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Same Day Service",
                description: "Quick response and delivery when you need it most",
              },
              {
                icon: Award,
                title: "Best Customer Service",
                description: "Industry-leading customer service experience",
              },
              {
                icon: Phone,
                title: "24/7 Availability",
                description: "Customer Service available - Day & Night",
              },
              {
                icon: Users,
                title: "Woman-Owned Company",
                description: "Proud to be a woman-led business serving Michigan",
              },
              {
                icon: Smartphone,
                title: "Flexible Scheduling",
                description: "Easy online booking and flexible scheduling options",
              },
              {
                icon: MapPin,
                title: "Reliable & Safe",
                description: "Professional transportation with proven track record",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Get In Touch</h2>
            <p className="text-gray-600">Multiple ways to reach our team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Phone,
                title: "Call Us",
                value: "(586) 412-3762",
                detail: "Mon-Fri: 7AM-6PM, Sat: 8AM-4PM",
              },
              {
                icon: Mail,
                title: "Email",
                value: "info@blueskydisposal.com",
                detail: "We respond within 24 hours",
              },
              {
                icon: MapPin,
                title: "Service Area",
                value: "Michigan",
                detail: "Serving 1000+ cities",
              },
              {
                icon: Smartphone,
                title: "Text Us",
                value: "(586) 412-3762",
                detail: "Quick responses to SMS",
              },
            ].map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                  <p className="text-sm font-medium text-blue-600 mb-1">{method.value}</p>
                  <p className="text-xs text-gray-600">{method.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {submitted ? (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Message Sent</h3>
                    <p className="text-sm text-gray-600">
                      Thank you. We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white border-gray-300"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full bg-white border-gray-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(123) 456-7890"
                          className="w-full bg-white border-gray-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="w-full bg-white border-gray-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        placeholder="Tell us more..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </>
                )}
              </form>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Office Hours */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-3">
                  {[
                    { day: "Monday - Friday", time: "7:00 AM - 6:00 PM" },
                    { day: "Saturday", time: "8:00 AM - 4:00 PM" },
                    { day: "Sunday", time: "Closed" },
                  ].map((hour, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{hour.day}</span>
                      <span className="font-semibold text-gray-900">{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Service Areas</h3>
                <p className="text-sm text-gray-700 mb-4">We proudly serve Michigan with same-day service in many locations including:</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Detroit", "Flint", "Dearborn", "Livonia", "Sterling", "Warren"].map((city) => (
                    <span key={city} className="text-sm text-gray-700">• {city}</span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">20+</p>
                  <p className="text-xs text-gray-600 font-semibold mt-1">Years</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">10K+</p>
                  <p className="text-xs text-gray-600 font-semibold mt-1">Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">Michigan Dumpster Rentals - Common Questions</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200"
              >
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4">
                    <h4 className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</h4>
                    <div className="shrink-0 text-blue-600 group-open:text-blue-700">
                      <svg
                        className="w-5 h-5 transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </summary>
                  <p className="text-gray-700 text-sm px-4 pb-4 border-t border-gray-200">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-blue-100 mb-6 text-sm">
            Sign up for our newsletter to get exclusive discounts and the latest updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-gray-900 placeholder:text-gray-500 flex-1"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
