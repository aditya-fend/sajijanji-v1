"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh overflow-hidden py-12 md:18 lg:24 bg-background text-foreground"
    >

      <div className="container h-full mx-auto px-4 md:px-8">
        <div className="flex h-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* ================= KOLOM KIRI: TEKS & CTA ================= */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">

            {/* Main Title / Headline */}
            <h1
              className={`md:max-w-[70%] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{ animationDelay: "200ms" }}
            >
              Abadikan Momen Suci Dalam{" "}
              <span className="font-caveat font-normal text-5xl md:text-7xl lg:text-8xl block text-neutral-800 dark:text-neutral-200 mt-1">
                Sentuhan Elegan
              </span>
            </h1>

            {/* Description */}
            <p
              className={`max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed ${
                isVisible ? "animate-slide-in-bottom" : "opacity-0"
              }`}
              style={{ animationDelay: "300ms" }}
            >
              Sebarkan kabar bahagia Anda melalui undangan digital yang interaktif, mewah, dan dipersonalisasi khusus untuk memperindah hari istimewa Anda.
            </p>

            {/* Call to Action (CTA) Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto ${
                isVisible ? "animate-zoom-in" : "opacity-0"
              }`}
              style={{ animationDelay: "400ms" }}
            >
              {/* Button Order Undangan */}
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full bg-primary px-8 py-6 text-base font-medium text-primary-foreground shadow-lg transition-transform duration-300 active:scale-95 group"
              >
                <Link href="/order" className="flex items-center justify-center gap-2">
                  Order Undangan
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Button Lihat Tema */}
              <Button
                
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full border-border/80 px-8 py-6 text-base font-medium transition-transform duration-300 hover:bg-secondary active:scale-95"
              >
                <Link href="/tema">
                  Lihat Tema
                </Link>
              </Button>
            </div>

          </div>

          {/* ================= KOLOM KANAN: UNIQUE FRAMED IMAGE ================= */}
          <div className="relative hidden sm:flex justify-center items-center lg:justify-end">
            
            {/* Frame 1: Arch Aesthetic Background */}
            <div
              className={`absolute w-[280px] h-[380px] sm:w-[340px] sm:h-[460px] rounded-t-[140px] rounded-b-[20px] border border-border/60 bg-secondary/30 backdrop-blur-3xl transform -rotate-6 transition-transform duration-500 hover:rotate-0 ${
                isVisible ? "animate-slide-in-right" : "opacity-0"
              }`}
              style={{ animationDelay: "200ms" }}
            />

            {/* Frame 2: Main Image Frame */}
            <div
              className={`relative w-[280px] h-[380px] sm:w-[340px] sm:h-[460px] rounded-t-[140px] rounded-b-[20px] overflow-hidden shadow-xl border-2 border-border/80 bg-card transform rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-[1.02] group ${
                isVisible ? "animate-zoom-in" : "opacity-0"
              }`}
              style={{ animationDelay: "400ms" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
                alt="Pratinjau Undangan Digital Saji Janji"
                fill
                priority
                sizes="(max-width: 768px) 280px, 340px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
            </div>

            {/* Floating Glassmorphic Badge */}
            <div
              className={`absolute -bottom-4 left-4 sm:left-10 bg-background/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-lg flex items-center gap-3 ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{ animationDelay: "600ms" }}
            >
              <div>
                <p className="font-caveat text-lg font-bold leading-none text-foreground">Desain Eksklusif</p>
                <p className="text-xs text-muted-foreground mt-0.5">Responsif & Bebas Custom</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}