"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Send } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (footerRef.current) observer.unobserve(footerRef.current);
        }
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.1,
      },
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hiddenClass = "invisible opacity-0 pointer-events-none";
  const navLinks = [
    { href: "#beranda", label: "Beranda" },
    { href: "#tema-undangan", label: "Tema Undangan" },
    { href: "#testimoni", label: "Testimoni" },
    { href: "#faq", label: "FAQ" },
    { href: "/tema", label: "Katalog Tema" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-border/40 bg-background text-foreground pt-16 pb-8"
    >
      {/* Soft Glow Background */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Navigation & Info Content */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 ${
            isVisible ? "animate-slide-in-bottom" : hiddenClass
          }`}
          style={{ animationDelay: "200ms" }}
        >
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-caveat text-3xl font-bold tracking-wide text-foreground">
              Saji Janji
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-sm leading-relaxed">
              Platform layanan pembuatan undangan digital eksklusif, aesthetic,
              dan responsif untuk momen berharga dalam hidupmu.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Hubungi Kami
            </h4>
            <div className="flex items-center gap-3">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://wa.me/6281234567890"
                target="_blank"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link
                href="https://t.me"
                target="_blank"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Teks Besar "Saji Janji" */}
        <div
          className={`border-t border-border/30 pt-8 pb-4 text-center select-none overflow-hidden ${
            isVisible ? "animate-zoom-in" : hiddenClass
          }`}
          style={{ animationDelay: "350ms" }}
        >
          <h1 className="font-caveat text-[13vw] sm:text-[14vw] leading-none font-bold tracking-tight text-muted-foreground/15 dark:text-muted-foreground/10 transition-colors">
            Saji Janji
          </h1>
        </div>

        {/* Bottom Copyright */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-[11px] text-muted-foreground/80 ${
            isVisible ? "animate-slide-in-bottom" : hiddenClass
          }`}
          style={{ animationDelay: "450ms" }}
        >
          <p>© {new Date().getFullYear()} Saji Janji. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />{" "}
            for your special day
          </p>
        </div>
      </div>
    </footer>
  );
}
