"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const THEMES = [
  {
    id: "classic-monochrome",
    title: "Monochrome Luxe",
    description:
      "Perpaduan warna hitam dan putih kontras tinggi yang menghadirkan nuansa mewah dan timeless.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    slug: "monochrome-luxe",
    badge: "Terfavorit",
  },
  {
    id: "botanical-aesthetic",
    title: "Ethereal Botanical",
    description:
      "Sentuhan elemen garis daun minimalis dengan warna monokrom lembut yang menenangkan.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    slug: "ethereal-botanical",
    badge: "Baru",
  },
  {
    id: "typography-bold",
    title: "Serif & Cursive",
    description:
      "Fokus pada keindahan aksen huruf script bergaya tulisan tangan yang artistik dan elegan.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    slug: "serif-cursive",
    badge: "Populer",
  },
];

export default function InvitationThemes() {
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
      id="tema-undangan"
      className="py-16 md:py-24 bg-background text-foreground"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* ================= SECTION TITLE & HEADLINE ================= */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-16">

          {/* Page Title */}
          <h2
            className={`text-3xl md:text-5xl font-bold tracking-tight ${
              isVisible ? "animate-slide-in-bottom" : "opacity-0"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            Pilihan Tema{" "}
            <span className="font-caveat font-normal text-4xl md:text-6xl text-neutral-800 dark:text-neutral-200">
              Eksklusif & Aesthetic
            </span>
          </h2>

          {/* Page Description */}
          <p
            className={`max-w-2xl text-sm md:text-base text-muted-foreground ${
              isVisible ? "animate-slide-in-bottom" : "opacity-0"
            }`}
            style={{ animationDelay: "300ms" }}
          >
            Temukan desain terbaik yang mencerminkan kisah cinta Anda. Setiap
            tema dikerjakan secara presisi dan responsif di semua perangkat.
          </p>
        </div>

        {/* ================= RESPONSIVE GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {THEMES.map((theme, index) => (
            <Card
              key={theme.id}
              className={`group flex flex-col overflow-hidden rounded-3xl bg-card/60 p-3 sm:p-4 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl ${
                isVisible ? "animate-zoom-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${(index + 2) * 150}ms` }}
            >
              {/* Frame Gambar Soft */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/50">
                <Image
                  src={theme.image}
                  alt={theme.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out"
                />

                {/* Subtle Inner Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              </div>

              {/* Detail Kartu */}
              <div className="flex flex-1 flex-col justify-between px-1.5 pt-4 pb-2">
                <div className="space-y-1.5">
                  {/* Title */}
                  <h3
                    className={`font-caveat text-2xl md:text-3xl font-bold tracking-wide text-foreground ${
                      isVisible ? "animate-slide-in-left" : "opacity-0"
                    }`}
                  >
                    {theme.title}
                  </h3>

                  {/* Deskripsi */}
                  <p
                    className={`text-xs md:text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed ${
                      isVisible ? "animate-slide-in-bottom" : "opacity-0"
                    }`}
                  >
                    {theme.description}
                  </p>
                </div>

                {/* Tombol Aksi Soft & Rounded */}
                <div className="grid grid-cols-2 gap-2.5 pt-5">
                  {/* Button Preview */}
                  <Button
                    
                    variant="outline"
                    className={`w-full rounded-full border-border/60 bg-transparent text-foreground hover:bg-secondary/60 transition-all duration-300 active:scale-95 ${
                      isVisible ? "animate-zoom-in" : "opacity-0"
                    }`}
                  >
                    <Link
                      href={`/demo/${theme.slug}`}
                      className="flex items-center justify-center gap-1.5 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5 opacity-70" />
                      Preview
                    </Link>
                  </Button>

                  {/* Button Order */}
                  <Button
                    
                    className={`w-full rounded-full bg-primary text-primary-foreground shadow-xs transition-all duration-300 hover:shadow-md active:scale-95 ${
                      isVisible ? "animate-zoom-in" : "opacity-0"
                    }`}
                  >
                    <Link
                      href={`/order?theme=${theme.slug}`}
                      className="flex items-center justify-center gap-1.5 text-xs font-medium"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Order
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}