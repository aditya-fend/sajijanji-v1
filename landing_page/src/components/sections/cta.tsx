"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.15,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hiddenClass = "invisible opacity-0 pointer-events-none";

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background via-secondary/20 to-background text-foreground"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-4xl">
        <div
          className={`flex flex-col items-center text-center space-y-6 rounded-3xl border border-border/50 bg-card-foreground p-8 md:p-14 backdrop-blur-md shadow-sm ${
            isVisible ? "animate-zoom-in" : hiddenClass
          }`}
        >
          {/* Heading Title */}
          <h2
            className={`text-3xl md:text-5xl font-bold tracking-tight text-neutral-300 ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "200ms" }}
          >
            Siap Bagikan Momen Bahagiamu Secara{" "}
            <span className="font-caveat font-normal text-4xl md:text-6xl text-neutral-100 dark:text-neutral-200">
              Eksklusif & Aesthetic?
            </span>
          </h2>

          {/* Description */}
          <p
            className={`max-w-xl text-sm md:text-base text-neutral-400 ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "300ms" }}
          >
            Buat undangan digital impianmu dalam hitungan menit. Pilih tema
            favorit, kustomisasi detailnya, dan sebar ke semua tamu tanpa
            batasan.
          </p>

          {/* 2 CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full sm:w-auto dark ${
              isVisible ? "animate-zoom-in" : hiddenClass
            }`}
            style={{ animationDelay: "400ms" }}
          >
            {/* Primary Button */}
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground px-8 font-medium shadow-xs transition-all duration-300 hover:scale-[1.03] hover:shadow-md active:scale-95"
            >
              <Link
                href="#tema-undangan"
                className="flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Buat Undangan Sekarang</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}