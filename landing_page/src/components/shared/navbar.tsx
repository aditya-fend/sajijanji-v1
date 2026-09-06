"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { name: "Beranda", href: "/#hero" },
  { name: "Tema Undangan", href: "/#tema-undangan" },
  { name: "Testimoni", href: "/#testimonials" },
  { name: "FAQ", href: "/#faq" },
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
      { threshold: 0.1 },
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-background transition-all dark"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* ================= BRAND LOGO & NAME ================= */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`relative h-9 w-9 overflow-hidden transition-transform duration-300 ${
              isVisible ? "animate-zoom-in" : "opacity-0"
            }`}
          >
            <Image
              src="/logo_dark.avif"
              alt="Logo Saji Janji"
              fill
              priority
              className="object-cover"
            />
          </div>

          <span
            className={`font-caveat text-2xl font-bold tracking-wide text-foreground ${
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
            <Button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-95">
              <Link href="/tema">Jelajahi Tema</Link>
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

            <SheetContent side="right" className="w-[280px] p-0 sm:w-[320px]">
              <div className="flex h-full flex-col pt-16">
                <nav
                  aria-label="Navigasi utama"
                  className="flex flex-col gap-1 border-t border-border/40 px-6 py-6"
                >
                  {NAV_LINKS.map((link) => (
                    <SheetClose
                      key={link.href}
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        />
                      }
                    >
                      {link.name}
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto border-t border-border/40 p-6">
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/tema"
                        className="flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
                      />
                    }
                  >
                    Jelajahi Tema
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
