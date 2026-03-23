'use client'

import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { AIChatbot } from '@/components/ai-chatbot'

export function Footer() {
  return (
    <>
      <AIChatbot />
      <footer className="bg-gradient-to-r from-[#142A52] via-[#1a3a6e] to-[#142A52] text-white mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/images/bluesky_New_logo.jpg" 
                alt="Blue Sky Disposal Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
              Professional dumpster rental services in Michigan. Woman-owned company with 15+ years of experience serving residential and commercial customers.
            </p>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-white/80 hover:text-[#C89B2B] transition">
                <Phone size={16} />
                <a href="tel:586-412-3762" className="font-bold">586-412-3762</a>
              </div>
              <div className="flex items-center gap-2 text-white/80 hover:text-[#C89B2B] transition">
                <Mail size={16} />
                <a href="mailto:BlueSkyDisposal@gmail.com" className="font-bold">BlueSkyDisposal@gmail.com</a>
              </div>
              <div className="flex items-start gap-2 text-white/80">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>42815 Garfield Rd Suite 202, Clinton Twp MI</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4 sm:mb-5 text-white text-xs sm:text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/#dumpster-services" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  Dumpster Rental
                </Link>
              </li>
              <li>
                <Link href="/cities" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  Cities We Service
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/#faq-section" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold mb-4 sm:mb-5 text-white text-xs sm:text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#C89B2B] transition duration-200 font-medium">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-bold mb-4 sm:mb-5 text-white text-xs sm:text-sm uppercase tracking-wider">Payment Methods</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="text-white/70">💳 Credit Card</li>
              <li className="text-white/70">🅿️ PayPal</li>
              <li className="text-white/70">🔵 Google Pay</li>
              <li className="text-white/70">📱 Digital Wallets</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-white/60">
          <p>© 2025 Blue Sky Disposal. All rights reserved. Professional Dumpster Rental Services in Michigan.</p>
        </div>
      </div>
    </footer>
    </>
  )
}
