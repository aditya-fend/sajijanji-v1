"use client";

import { useState, useEffect, useRef } from "react";
import { HelpCircle, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    id: "faq-1",
    question: "Berapa lama proses pembuatan undangan digital?",
    answer:
      "Proses pengerjaan umumnya membutuhkan waktu 1–2 hari kerja setelah seluruh data (foto, lokasi, jadwal, dan musik) kami terima secara lengkap.",
  },
  {
    id: "faq-2",
    question: "Apakah data dan foto di undangan bisa diubah setelah jadi?",
    answer:
      "Bisa. Kamu mendapatkan kuota revisi gratis untuk mengubah detail seperti ucapan, jadwal, lokasi acara, maupun foto pendukung sebelum hari H.",
  },
  {
    id: "faq-3",
    question: "Bagaimana cara kerja fitur RSVP dan Ucapan?",
    answer:
      "Setiap kali tamu mengisi form RSVP atau memberikan ucapan di undanganmu, datanya akan langsung tersimpan dan dapat kamu pantau secara realtime melalui dashboard/rekapitulasi.",
  },
  {
    id: "faq-4",
    question: "Apakah ada batasan jumlah tamu yang bisa diundang?",
    answer:
      "Tidak ada batasan. Kamu bisa menyebarkan link undangan digital ke sebanyak mungkin tamu, keluarga, dan kerabat tanpa biaya tambahan.",
  },
  {
    id: "faq-5",
    question: "Apakah musik latar (backsound) bisa disesuaikan?",
    answer:
      "Tentu saja! Kamu bisa memilih lagu kesukaanmu sendiri dari Spotify/YouTube atau menggunakan daftar lagu pilihan yang sudah kami sediakan.",
  },
];

export default function FAQSection() {
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
      id="faq"
      className="relative overflow-hidden py-20 md:py-28 bg-background text-foreground"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* ================= SECTION TITLE & HEADLINE ================= */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-16">

          {/* Page Title */}
          <h2
            className={`text-3xl md:text-5xl font-bold tracking-tight ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "200ms" }}
          >
            Pertanyaan yang{" "}
            <span className="font-caveat font-normal text-4xl md:text-6xl text-neutral-800 dark:text-neutral-200">
              Sering Diajukan
            </span>
          </h2>

          {/* Page Description */}
          <p
            className={`max-w-xl text-sm md:text-base text-muted-foreground ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "300ms" }}
          >
            Temukan jawaban lengkap atas hal-hal yang sering ditanyakan mengenai layanan undangan digital kami.
          </p>
        </div>

        {/* ================= ACCORDION FAQ ================= */}
        <Accordion
          className={`w-full space-y-4 ${
            isVisible ? "animate-zoom-in" : hiddenClass
          }`}
          style={{ animationDelay: "400ms" }}
        >
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-2xl border border-border/50 bg-card/50 px-6 backdrop-blur-md transition-all duration-300 hover:border-border hover:bg-card shadow-xs"
            >
              <AccordionTrigger className="py-5 text-left text-sm md:text-base font-semibold hover:no-underline font-sans text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-xs md:text-sm text-muted-foreground/90 font-light leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}