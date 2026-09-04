"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { name: "Beranda", href: "#hero" },
  { name: "Fitur", href: "#features" },
  { name: "Harga", href: "#pricing" },
  { name: "Testimoni", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hanya picu animasi jika elemen masuk layar
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observe agar animasi tidak dipicu ulang saat scroll
          if (headerRef.current) observer.unobserve(headerRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all ${
        isVisible ? "animate-slide-in-top" : "opacity-0"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* ================= BRAND LOGO & NAME ================= */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`relative h-9 w-9 overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
              isVisible ? "animate-zoom-in" : "opacity-0"
            }`}
          >
            <Image
              src="/logo.avif"
              alt="Logo Saji Janji"
              fill
              priority
              className="object-cover"
            />
          </div>

          <span
            className={`font-caveat text-2xl font-bold tracking-wide text-foreground transition-colors group-hover:text-neutral-400 ${
              isVisible ? "animate-slide-in-left" : "opacity-0"
            }`}
          >
            Saji Janji
          </span>
        </Link>

        {/* ================= DESKTOP NAV LINKS & CTA ================= */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
                className={`text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${
                  isVisible ? "animate-slide-in-top" : "opacity-0"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div
            className={isVisible ? "animate-zoom-in" : "opacity-0"}
            style={{ animationDelay: "600ms" }}
          >
            <Button
              
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Link href="#templates">Lihat Tema</Link>
            </Button>
          </div>
        </div>

        {/* ================= MOBILE HAMBURGER MENU ================= */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={`focus-visible:ring-0 ${
                    isVisible ? "animate-zoom-in" : "opacity-0"
                  }`}
                  aria-label="Buka Menu Navigasi"
                />
              }
            >
              <Menu className="h-6 w-6 text-foreground" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px]">
              {/* Isi SheetContent */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}