"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageSquareHeart, Quote, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    id: "testi-1",
    name: "Rian & Amanda",
    role: "Menikah Juli 2026",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Undangan digitalnya sangat elegan! Semua tamu memuji betapa praktis dan aesthetic-nya tampilan saat dibuka dari WhatsApp.",
  },
  {
    id: "testi-2",
    name: "Dika & Feby",
    role: "Menikah Agustus 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Proses pembuatan cepat sekali dan admin sangat responsif. Fitur kustom teks dan musiknya bikin undangan kami terasa makin spesial.",
  },
  {
    id: "testi-3",
    name: "Bagas & Sarah",
    role: "Menikah September 2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Fitur RSVP dan ucapan bekerja dengan sempurna. Sangat membantu kami merekap jumlah tamu yang akan hadir. Worth it banget!",
  },
];

export default function TestimonialSection() {
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
      id="testimoni"
      className="py-16 md:py-24 bg-background/50 text-foreground"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* ================= SECTION TITLE & HEADLINE ================= */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-16">

          {/* Page Title */}
          <h2
            className={`text-3xl md:text-5xl font-bold tracking-tight ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "200ms" }}
          >
            Apa Kata{" "}
            <span className="font-caveat font-normal text-4xl md:text-6xl text-neutral-800 dark:text-neutral-200">
              Pasangan Bahagia
            </span>
          </h2>

          {/* Page Description */}
          <p
            className={`max-w-2xl text-sm md:text-base text-muted-foreground ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "300ms" }}
          >
            Dengarkan pengalaman langsung dari pasangan yang telah mempercayakan momen spesial mereka menggunakan undangan digital kami.
          </p>
        </div>

        {/* ================= RESPONSIVE GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((testi, index) => (
            <Card
              key={testi.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 md:p-7 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-border ${
                isVisible ? "animate-zoom-in" : hiddenClass
              }`}
              style={{ animationDelay: `${(index + 2) * 150}ms` }}
            >
              {/* Watermark Quote Icon Background */}
              <Quote className="absolute right-4 top-4 h-16 w-16 text-muted-foreground/10 transition-transform duration-500 group-hover:scale-110" />

              <div className="relative z-10 space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: testi.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Comment Text */}
                <p
                  className={`text-xs md:text-sm text-muted-foreground leading-relaxed italic ${
                    isVisible ? "animate-slide-in-bottom" : hiddenClass
                  }`}
                >
                  &ldquo;{testi.comment}&rdquo;
                </p>
              </div>

              {/* Author Detail */}
              <div className="relative z-10 flex items-center gap-3 pt-6 mt-6 border-t border-border/40">
                <Avatar className="h-10 w-10 border border-border/60">
                  <AvatarImage src={testi.avatar} alt={testi.name} />
                  <AvatarFallback>{testi.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-foreground tracking-wide font-caveat text-lg">
                    {testi.name}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {testi.role}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}