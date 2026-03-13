"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { AuthModal } from "@/components/auth-modal";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  // Detect scroll for subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Updated navigation menu (centered)
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dumpster-services", label: "Dumpster Services" },
    { href: "/faq", label: "FAQ" },
    { href: "/service-areas", label: "Service Areas" },
    { href: "/national-accounts", label: "National Accounts" },
    { href: "/contact", label: "Contact Us" },
    { href: "/dumpster-calculator", label: "Dumpster Calculator" },
    { href: "/partner-login", label: "Partner Login" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          // Vertical brand gradient
          "bg-gradient-to-b from-navy-primary via-navy-edge to-navy-shadow",
          "border-b border-whiteSoft/10",
          isScrolled && "shadow-lg"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* ================= LEFT: LOGO ================= */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/bluesky_New_logo.png"
                alt="Blue Sky Disposal"
                width={180}
                height={50}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* ================= CENTER: DESKTOP NAV ================= */}
            <nav className="hidden lg:flex items-center gap-6 whitespace-nowrap">

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    // Base styling
                    "relative text-[13px] font-semibold tracking-wide",
                    "text-whiteSoft/90 transition-colors duration-300",

                    // Animated underline (gold)
                    "after:absolute after:left-0 after:-bottom-1 after:h-[2px]",
                    "after:w-0 after:bg-gold-light",
                    "after:transition-all after:duration-300",

                    // Hover behavior
                    "hover:text-whiteSoft hover:after:w-full",

                    // Active state
                    isActive(link.href) && "text-whiteSoft after:w-full"
                  )}
                >
                  {link.label}
                </Link>
              ))}

            </nav>

            {/* ================= RIGHT SIDE ACTIONS ================= */}
            <div className="flex items-center gap-5">

              {/* Phone Number (icon allowed) */}
              <a
                href="tel:5884123362"
                className="hidden xl:flex items-center gap-2 text-whiteSoft text-sm font-medium hover:text-whiteSoft/80 transition-colors"
              >
                {/* Phone SVG */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                588-412-3362
              </a>

              {/* Cart (icon allowed) */}
              <Link href="/cart" className="relative text-whiteSoft hover:text-whiteSoft/80 transition-colors">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-gold-core text-navy-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Link>

              {/* Log In Button (Gold Gradient from global.css) */}
              {!isLoggedIn && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="button-gold px-5 py-2 rounded-md text-sm"
                >
                  Log In
                </button>
              )}

              {/* Mobile Toggle */}
              <button
                className="lg:hidden text-whiteSoft"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>

            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-navy-shadow border-t border-whiteSoft/10">
            <nav className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-whiteSoft/90 hover:text-whiteSoft"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}