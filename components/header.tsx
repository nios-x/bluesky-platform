"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, ChevronDown, Package, Gift, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { AuthModal } from "@/components/auth-modal";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services/dumpster-rental", label: "Services" },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/partners", label: "Partners" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-gradient-to-r from-[#08054C] via-[#0a0660] to-[#0d0780] border-b border-[#1a4d9e]",
          isScrolled && "shadow-lg"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/bluesky_New_logo.jpg"
                  alt="Blue Sky Disposal"
                  width={160}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={cn("text-sm font-semibold transition-all pb-1 border-b-2", isActive(link.href) ? "text-white border-white" : "text-white/80 hover:text-white border-transparent hover:border-white/50")}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href="tel:(123) 456-7890" className="hidden lg:flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium">(123) 456-7890</span>
              </a>

              {isLoggedIn && user ? (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-white">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={16} className="text-white/80" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-xs text-amber-700 font-semibold">
                            <Gift size={12} />
                            {user.rewards} Coins
                          </div>
                        </div>
                      </div>
                      <Link href="/account" onClick={() => setShowUserMenu(false)}>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm">
                          <User size={16} />
                          My Account
                        </button>
                      </Link>
                      <Link href="/account?tab=orders" onClick={() => setShowUserMenu(false)}>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm">
                          <Package size={16} />
                          My Orders
                        </button>
                      </Link>
                      <Link href="/account?tab=notifications" onClick={() => setShowUserMenu(false)}>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm">
                          <Bell size={16} />
                          Notifications
                          <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">12</span>
                        </button>
                      </Link>
                      <div className="border-t border-slate-200 my-2"></div>
                      <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-sm">
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} className="bg-white text-slate-900 hover:bg-slate-100" size="sm">
                  Sign In
                </Button>
              )}

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-slate-700">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 bg-white text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
                </Button>
              </Link>

              <button className="md:hidden p-2 rounded-lg hover:bg-slate-700 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-900">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={cn("block px-4 py-2 rounded-lg text-sm font-semibold transition-colors", isActive(link.href) ? "bg-slate-700 text-white" : "text-white/80 hover:bg-slate-700 hover:text-white")} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}