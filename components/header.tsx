"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  Package,
  Gift,
  Bell,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { AuthModal } from "@/components/auth-modal";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showDumpsterMenu, setShowDumpsterMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const [mobileDumpsterOpen, setMobileDumpsterOpen] =
    useState(false);

  const [mobileLocationOpen, setMobileLocationOpen] =
    useState(false);

  const { user, isLoggedIn, logout } = useAuth();

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const dumpsterSubmenu = [
    {
      href:
        "/dumpsters/rubber-wheeled-dumpsters",
      label:
        "Rubber Wheeled Dumpsters",
    },
    {
      href:
        "/dumpsters/roll-off-dumpsters",
      label: "Roll Off Dumpsters",
    },
    {
      href:
        "/dumpsters/permanent-dumpsters",
      label:
        "Permanent Dumpsters",
    },
  ];

  const locationSubmenu = [
    {
      href: "/location/macomb",
      label: "Macomb County",
    },
    {
      href: "/location/oakland",
      label: "Oakland County",
    },
    {
      href: "/location/wayne",
      label: "Wayne County",
    },
    {
      href: "/location",
      label:
        "View All Locations",
    },
  ];

  const navLinks = [
    {
      href: "/",
      label: "Home",
    },

    {
      href: "/dumpsters",
      label: "Dumpsters",
      submenu:
        dumpsterSubmenu,
      type: "dumpster",
    },

    {
      href: "/location",
      label:
        "Service Areas",
      submenu:
        locationSubmenu,
      type: "location",
    },

    {
      href:
        "/#faq-section",
      label: "FAQ",
    },

    {
      href: "/about",
      label: "About",
    },

    {
      href: "/contact",
      label: "Contact",
    },
  ];

  const [activeHash, setActiveHash] =
    useState<string>(() => {
      if (
        typeof window !==
        "undefined"
      ) {
        return window.location
          .hash;
      }

      return "";
    });

  useEffect(() => {
    const onHashChange = () => {
      setActiveHash(
        window.location.hash
      );
    };

    window.addEventListener(
      "hashchange",
      onHashChange
    );

    return () =>
      window.removeEventListener(
        "hashchange",
        onHashChange
      );
  }, []);

  const isActive = (
    path: string
  ) => {
    if (path === "/")
      return (
        pathname === "/" &&
        (!activeHash ||
          activeHash === "#")
      );

    if (
      path.startsWith("/#")
    )
      return (
        pathname === "/" &&
        activeHash ===
        path.replace("/", "")
      );

    return pathname === path;
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-gradient-to-r from-[#0A1628] via-[#1B3A6B] to-[#0A1628] border-b border-[#1B3A6B]",
          isScrolled &&
          "shadow-lg"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/images/lg.png"
                alt="Blue Sky Disposal"
                width={200}
                height={100}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">

              {navLinks.map(
                (link: any) => {

                  if (
                    link.submenu
                  ) {

                    const isDumpster =
                      link.type ===
                      "dumpster";

                    const menuOpen =
                      isDumpster
                        ? showDumpsterMenu
                        : showLocationMenu;

                    const setMenuOpen =
                      isDumpster
                        ? setShowDumpsterMenu
                        : setShowLocationMenu;

                    return (
                      <div
                        key={
                          link.href
                        }
                        className="relative"
                        onMouseEnter={() =>
                          setMenuOpen(
                            true
                          )
                        }
                        onMouseLeave={() =>
                          setMenuOpen(
                            false
                          )
                        }
                      >

                        <Link
                          href={
                            link.href
                          }
                          className={cn(
                            "flex items-center gap-1 text-sm font-semibold py-5 border-b-2 transition-all",
                            pathname.startsWith(
                              link.href
                            )
                              ? "text-white border-[#FFD700]"
                              : "text-white/80 hover:text-white border-transparent"
                          )}
                        >

                          {
                            link.label
                          }

                          <ChevronDown
                            size={
                              15
                            }
                            className={cn(
                              "transition",
                              menuOpen &&
                              "rotate-180"
                            )}
                          />
                        </Link>

                        <div className="absolute top-full left-0 w-full h-4" />

                        {menuOpen && (

                          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">

                            <div className="w-[320px] rounded-2xl border border-white/10 bg-[#0B1730]/95 backdrop-blur-xl overflow-hidden">

                              <div className="px-5 pt-4 pb-2 border-b border-white/5">

                                <p className="text-xs font-semibold uppercase tracking-widest text-[#FFD700]">

                                  {isDumpster
                                    ? "Dumpster Services"
                                    : "Top Service Areas"}

                                </p>

                              </div>

                              <div className="p-2">

                                {link.submenu.map(
                                  (
                                    sub: any
                                  ) => (

                                    <Link
                                      key={
                                        sub.href
                                      }
                                      href={
                                        sub.href
                                      }
                                      className={cn(
                                        "group flex justify-between rounded-xl px-4 py-3 transition",

                                        pathname ===
                                          sub.href
                                          ? "bg-[#FFD700] text-slate-900"
                                          : "text-white hover:bg-white/5"
                                      )}
                                    >

                                      <div>

                                        <p className="text-sm font-semibold">

                                          {
                                            sub.label
                                          }

                                        </p>

                                        <p className="text-xs mt-1 text-white/50">
                                          {isDumpster
                                            ? "View sizes, details & pricing"
                                            : sub.label === "View All Locations"
                                              ? "Explore every county we serve"
                                              : "Local dumpster service coverage"}
                                        </p>

                                      </div>

                                      <div className="group-hover:translate-x-1 transition">

                                        →

                                      </div>

                                    </Link>

                                  )
                                )}

                              </div>

                            </div>

                          </div>

                        )}

                      </div>
                    );
                  }

                  return (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className={cn(
                        "text-sm font-semibold transition-all pb-1 border-b-2",

                        isActive(
                          link.href
                        )
                          ? "text-white border-[#FFD700]"
                          : "text-white/80 hover:text-white border-transparent"
                      )}
                    >
                      {
                        link.label
                      }
                    </Link>
                  );
                }
              )}

            </nav>

            <div className="flex items-center gap-3">

              <a
                href="tel:5864123762"
                className="hidden lg:flex items-center gap-2 text-white"
              >
                <span className="text-sm font-medium">
                  586-412-3762
                </span>
              </a>

              {isLoggedIn &&
                user ? (
                <div className="relative">

                  <button
                    onClick={() =>
                      setShowUserMenu(
                        !showUserMenu
                      )
                    }
                    className="flex items-center gap-2"
                  >

                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900">

                      {user.name
                        .charAt(
                          0
                        )
                        .toUpperCase()}

                    </div>

                  </button>

                </div>
              ) : (

                <Button
                  onClick={() =>
                    setShowAuthModal(
                      true
                    )
                  }
                  className="bg-[#FFD700] text-slate-900"
                >
                  Sign In
                </Button>

              )}

              <Link href="/cart">

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                >

                  <ShoppingCart />

                </Button>

              </Link>

              <button
                className="md:hidden text-white"
                onClick={() =>
                  setIsMobileMenuOpen(
                    !isMobileMenuOpen
                  )
                }
              >
                {isMobileMenuOpen ? (
                  <X />
                ) : (
                  <Menu />
                )}
              </button>

            </div>

          </div>

        </div>

      </header>

      <AuthModal
        isOpen={
          showAuthModal
        }
        onClose={() =>
          setShowAuthModal(
            false
          )
        }
      />
    </>
  );
}