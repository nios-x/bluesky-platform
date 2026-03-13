"use client";

import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ui/image-with-fallback";

const posts = [
  {
    title: "Eco-Friendly Waste Management Tips",
    excerpt: "Discover simple ways to reduce your environmental footprint during your next renovation project.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5afa?w=800&auto=format&fit=crop",
    date: "Jan 15, 2024"
  },
  {
    title: "Choosing the Right Dumpster Size",
    excerpt: "Don't overpay for space you don't need. Learn how to estimate the perfect size for your debris.",
    image: "https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?w=800&auto=format&fit=crop",
    date: "Dec 10, 2023"
  }
];

export default function BlogSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-40 w-full h-96">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?w=1600&auto=format&fit=crop"
              alt="Background"
              width={1600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 p-12 md:p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Signup For Our Latest<br />Blogs & News</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Stay updated with industry trends, recycling tips, and company announcements.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 border-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Simple Blog Cards Grid (Optional, if needed to match list below main CTA) */}
        {/* Removed for now to keep it clean and match the "Signup" banner focus of the screenshot */}
      </div>
    </section>
  );
}
