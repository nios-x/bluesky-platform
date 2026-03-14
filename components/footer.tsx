'use client'

import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { AIChatbot } from '@/components/ai-chatbot'

export function Footer() {
  return (
    <>
      <AIChatbot />
      <footer className="bg-gradient-to-r from-[#08054C] via-[#0a0660] to-[#0d0780] text-slate-100 mt-16 sm:mt-20">
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
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Professional waste management and dumpster rental services for residential, commercial, and industrial needs across 50+ cities.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold mb-4 sm:mb-5 text-white text-xs sm:text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-cyan-400 transition duration-200 font-medium">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-cyan-400 transition duration-200 font-medium">
                  FAQs
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition duration-200 font-medium">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition duration-200 font-medium">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-bold mb-4 sm:mb-5 text-white text-xs sm:text-sm uppercase tracking-wider">Payment Methods</h3>
            <div className="flex gap-2 flex-wrap">
              <div className="bg-white/10 hover:bg-white/20 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition">
                💳
              </div>
              <div className="bg-white/10 hover:bg-white/20 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition">
                💰
              </div>
              <div className="bg-white/10 hover:bg-white/20 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition">
                🏦
              </div>
              <div className="bg-white/10 hover:bg-white/20 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition">
                📱
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4 sm:mb-5 text-white text-xs sm:text-sm uppercase tracking-wider">Follow Us</h3>
            <div className="flex gap-2">
              <a href="#" className="bg-white/10 hover:bg-cyan-500 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center transition duration-200">
                <Instagram className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-blue-500 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center transition duration-200">
                <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-blue-600 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center transition duration-200">
                <Facebook className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-cyan-500 w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center transition duration-200">
                <Twitter className="w-4 sm:w-5 h-4 sm:h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-500">
          <p>© 2025 Blue Sky Disposal. All rights reserved. Professional Waste Management & Dumpster Rental Services.</p>
        </div>
      </div>
    </footer>
    </>
  )
}
