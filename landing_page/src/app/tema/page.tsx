"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Interface Data Tema
interface ThemeItem {
  id: string;
  title: string;
  category: "adat" | "modern";
  price: number;
  description: string;
  image: string;
  slug?: string;
  badge?: string;
}

// 40 Dummy Data (20 Adat, 20 Modern)
const DUMMY_THEMES: ThemeItem[] = [
  // --- KATEGORI ADAT (20 Data) ---
  {
    id: "adat-1",
    title: "Jawa Solo Basahan",
    category: "adat",
    price: 149000,
    description:
      "Sentuhan ornamen ukiran kayu Jepara dengan warna cokelat hangat dan emas murni.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    slug: "jawa-solo-basahan",
    badge: "Terfavorit",
  },
  {
    id: "adat-2",
    title: "Minang Suntiang Emas",
    category: "adat",
    price: 179000,
    description:
      "Aksen merah megah bertabur motif ukiran Minang dan ornamen mahkota Suntiang.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    slug: "minang-suntiang-emas",
    badge: "Populer",
  },
  {
    id: "adat-3",
    title: "Sunda Siger Royal",
    category: "adat",
    price: 159000,
    description:
      "Nuansa putih bersih nan suci dengan pola bunga melati serta motif batik Parang.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    slug: "sunda-siger-royal",
  },
  {
    id: "adat-4",
    title: "Batak Gorga Klasik",
    category: "adat",
    price: 169000,
    description:
      "Pattern Gorga khas Batak bernuansa merah, hitam, dan putih yang tegas nan bermakna.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    slug: "batak-gorga-klasik",
    badge: "Eksklusif",
  },
  {
    id: "adat-5",
    title: "Bali Payas Agung",
    category: "adat",
    price: 189000,
    description:
      "Perpaduan ukiran pura Bali bersepuh emas dengan elemen janur melengkung indah.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    slug: "bali-payas-agung",
    badge: "Eksklusif",
  },
  {
    id: "adat-6",
    title: "Palembang Songket",
    category: "adat",
    price: 175000,
    description:
      "Kemewahan kain songket lepus emas khas Sumatra Selatan berlatar merah maroon.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    slug: "palembang-songket",
  },
  {
    id: "adat-7",
    title: "Bugis Makassar Baju Bodo",
    category: "adat",
    price: 149000,
    description:
      "Harmoni warna cerah beraksen serat sutera dan ornamen geometris khas Sulawesi.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    slug: "bugis-makassar-baju-bodo",
  },
  {
    id: "adat-8",
    title: "Jawa Yogyakarta Paes",
    category: "adat",
    price: 159000,
    description:
      "Anggunnya ornamen prada emas Jogja diselimuti nuansa hitam beludru klasik.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    slug: "jawa-yogyakarta-paes",
  },
  {
    id: "adat-9",
    title: "Aceh Pintu Aceh",
    category: "adat",
    price: 165000,
    description:
      "Motif khas Pintu Aceh bersentuhan emas dan hijau zamrud nan regal.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    slug: "aceh-pintu-aceh",
  },
  {
    id: "adat-10",
    title: "Lampung Tapis Gelung",
    category: "adat",
    price: 179000,
    description:
      "Keindahan tenun kain Tapis Lampung bertema emas dengan aksen Siger mahkota.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    slug: "lampung-tapis-gelung",
  },
  {
    id: "adat-11",
    title: "Dayak Kenyah Pattern",
    category: "adat",
    price: 155000,
    description:
      "Seni ukir ulur Dayak yang eksotik berpadu warna tanah dan perak alami.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    slug: "dayak-kenyah-pattern",
  },
  {
    id: "adat-12",
    title: "Toraja Tongkonan",
    category: "adat",
    price: 169000,
    description:
      "Detail ukiran kayu rumah adat Tongkonan dengan kombinasi warna etnik alami.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    slug: "toraja-tongkonan",
  },
  {
    id: "adat-13",
    title: "Betawi Rias Besar",
    category: "adat",
    price: 139000,
    description:
      "Semarak perpaduan budaya Tionghoa & Arab dalam aksen warna cerah Betawi.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    slug: "betawi-rias-besar",
  },
  {
    id: "adat-14",
    title: "Sasak Lombok Songket",
    category: "adat",
    price: 149000,
    description:
      "Corak kain tenun ikat Lombok dipadu dengan ornamen alam pantai tropis.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    slug: "sasak-lombok-songket",
  },
  {
    id: "adat-15",
    title: "Nias Omo Hada",
    category: "adat",
    price: 159000,
    description:
      "Gagahnya nuansa ornamen perisai Nias dalam warna kuning emas dan merah.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "adat-16",
    title: "Banjar Baamarrah",
    category: "adat",
    price: 165000,
    description:
      "Mahkota naga mahligai Banjar dalam paduan warna hijau zamrud dan emas.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "adat-17",
    title: "Melayu Riau Cekak Musang",
    category: "adat",
    price: 149000,
    description:
      "Kesan santun berbalut motif pucuk rebung Melayu bernuansa kuning royal.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "adat-18",
    title: "Mandar Lipa Saqbe",
    category: "adat",
    price: 159000,
    description:
      "Keindahan tenun sutera Mandar bergaris halus dengan gradasi warna hangat.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "adat-19",
    title: "Sumba Tenun Ikat",
    category: "adat",
    price: 175000,
    description:
      "Aksentuasi kuda dan pohon kehidupan khas tenun Sumba bernuansa bumi.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "adat-20",
    title: "Moluccas Cendrawasih Etnik",
    category: "adat",
    price: 169000,
    description:
      "Rangkaian Burung Cendrawasih dan kekayaan bahari Maluku Papua yang eksotik.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },

  // --- KATEGORI MODERN (20 Data) ---
  {
    id: "modern-1",
    title: "Monochrome Luxe",
    category: "modern",
    price: 129000,
    description:
      "Perpaduan warna hitam dan putih kontras tinggi yang menghadirkan nuansa mewah.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    slug: "monochrome-luxe",
    badge: "Terfavorit",
  },
  {
    id: "modern-2",
    title: "Ethereal Botanical",
    category: "modern",
    price: 139000,
    description:
      "Sentuhan elemen garis daun minimalis dengan warna monokrom lembut menenangkan.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    slug: "ethereal-botanical",
    badge: "Baru",
  },
  {
    id: "modern-3",
    title: "Serif & Cursive",
    category: "modern",
    price: 119000,
    description:
      "Fokus pada keindahan aksen huruf script bergaya tulisan tangan yang artistik.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    slug: "serif-cursive",
  },
  {
    id: "modern-4",
    title: "Glassmorphism Glow",
    category: "modern",
    price: 159000,
    description:
      "Efek kaca buram modern dengan gradasi neon pendar yang futuristik dan bersih.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    badge: "Tren",
  },
  {
    id: "modern-5",
    title: "Emerald Sage Minimalist",
    category: "modern",
    price: 129000,
    description:
      "Dominasi warna hijau sage yang earthy dipadu dengan garis tipis rose gold.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-6",
    title: "Terracotta Dusk",
    category: "modern",
    price: 135000,
    description:
      "Hangatnya nuansa senja terracotta dikombinasikan dengan typography bold.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-7",
    title: "Nordic Soft Line",
    category: "modern",
    price: 119000,
    description:
      "Gaya skandinavia serba simpel, bersih, dengan ruang kosong yang harmonis.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-8",
    title: "Celestial Constellation",
    category: "modern",
    price: 149000,
    description:
      "Ilustrasi rasi bintang dan bulan bernuansa biru malam beraksen emas cair.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-9",
    title: "Champagne Velvet",
    category: "modern",
    price: 169000,
    description:
      "Sentuhan krem champagne super halus dengan layout majalah fashion premium.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-10",
    title: "Abstract Watercolor",
    category: "modern",
    price: 125000,
    description:
      "Cipratan cat air pastel melayang indah sebagai latar belakang teks acara.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-11",
    title: "Cyber Cyberpunk Rose",
    category: "modern",
    price: 159000,
    description:
      "Gaya edgy modern dengan pendaran neon mawar merah dan latar gelap pekat.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-12",
    title: "Arch Window Aesthetic",
    category: "modern",
    price: 139000,
    description:
      "Bingkai lengkungan arsitektur modern berpadu bingkai foto lanskap megah.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-13",
    title: "Vintage Newspaper",
    category: "modern",
    price: 129000,
    description:
      "Konsep unik koran klasik dengan tata letak berita editorial yang estetik.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-14",
    title: "Dark Obsidian Luxury",
    category: "modern",
    price: 179000,
    description:
      "Latar hitam batu obsidian dengan tulisan emas foil perak yang elegan.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    badge: "Premium",
  },
  {
    id: "modern-15",
    title: "Pastel Lavender Dreams",
    category: "modern",
    price: 119000,
    description:
      "Warna ungu muda lembut yang manis dengan animasi efek kelopak bunga gugur.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-16",
    title: "Japanese Wabi-Sabi",
    category: "modern",
    price: 145000,
    description:
      "Kesederhanaan filosofi Jepang dengan tekstur kertas buatan tangan (washi).",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-17",
    title: "Industrial Concrete Urban",
    category: "modern",
    price: 135000,
    description:
      "Tekstur semen halus dipadu typography modern kontemporer yang chic.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-18",
    title: "Golden Foil Geometry",
    category: "modern",
    price: 149000,
    description:
      "Garis-garis geometris presisi bersepuh emas menyilaukan di atas latar putih.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-19",
    title: "Sunset Gradient Glow",
    category: "modern",
    price: 129000,
    description:
      "Gradasi warna hangat orange pink lembut bagikan suasana romantis pantai.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modern-20",
    title: "Retro Film Polaroid",
    category: "modern",
    price: 119000,
    description:
      "Frame foto polaroid berseri dengan efek nostalgia kamera analog film 90an.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
];

const ITEMS_PER_PAGE = 10;
const hiddenClass = "invisible opacity-0 pointer-events-none";

export default function TemaPage() {
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(200000);

  // Temporary State untuk Modal Dialog Filter
  const [tempCategory, setTempCategory] = useState<string>("all");
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(200000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // IntersectionObserver State
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (pageRef.current) observer.unobserve(pageRef.current);
        }
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.1 },
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filter Data Logic
  const filteredThemes = useMemo(() => {
    return DUMMY_THEMES.filter((theme) => {
      const matchesSearch = theme.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || theme.category === selectedCategory;
      const matchesPrice = theme.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, maxPrice]);

  // Reset pagination saat pencarian/filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, maxPrice]);

  // Calculations for Pagination
  const totalPages = Math.ceil(filteredThemes.length / ITEMS_PER_PAGE);
  const currentThemes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredThemes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredThemes, currentPage]);

  // Synchronize Temporary Filter State saat Dialog Dibuka
  const handleOpenFilter = () => {
    setTempCategory(selectedCategory);
    setTempMaxPrice(maxPrice);
    setIsFilterOpen(true);
  };

  const handleApplyFilter = () => {
    setSelectedCategory(tempCategory);
    setMaxPrice(tempMaxPrice);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setTempCategory("all");
    setTempMaxPrice(200000);
    setSelectedCategory("all");
    setMaxPrice(200000);
    setIsFilterOpen(false);
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-background text-foreground py-12 md:py-20"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* ================= HEADER PAGE ================= */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/40 ${
            isVisible ? "animate-slide-in-bottom" : hiddenClass
          }`}
          style={{ animationDelay: "150ms" }}
        >
          {/* Title Page (Kiri) */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Koleksi Tema
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Temukan {DUMMY_THEMES.length} pilihan desain undangan digital
              eksklusif & responsif.
            </p>
          </div>

          {/* Search & Filter Trigger (Kanan) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Input Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 rounded-full border-border/60 bg-card/60 focus-visible:ring-1"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Modal Trigger Dialog */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    onClick={handleOpenFilter}
                    className="relative rounded-full border-border/60 bg-card/60 px-2 sm:px-4 py-4 flex items-center gap-2 hover:bg-secondary shrink-0"
                  >
                    <SlidersHorizontal className="h-4 w-4 opacity-80" />
                    <span className="hidden sm:inline text-xs font-medium">
                      Filter
                    </span>

                    {(selectedCategory !== "all" || maxPrice < 200000) && (
                      <span className="h-2 w-2 rounded-full bg-primary absolute -top-0.5 -right-0.5" />
                    )}
                  </Button>
                }
              />

              <DialogContent className="sm:max-w-md rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center justify-between">
                    <span>Filter Tema</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Filter Kategori */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Kategori Tema
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "all", label: "Semua" },
                        { id: "adat", label: "Adat" },
                        { id: "modern", label: "Modern" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setTempCategory(cat.id)}
                          className={`py-2 px-3 rounded-2xl text-xs font-medium border transition-all ${
                            tempCategory === cat.id
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "border-border/60 bg-secondary/30 hover:bg-secondary text-foreground"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Range Harga */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                        Maksimal Harga
                      </span>

                      <span className="font-bold text-foreground">
                        Rp {tempMaxPrice.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={100000}
                      max={200000}
                      step={10000}
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />

                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Rp 100.000</span>
                      <span>Rp 200.000</span>
                    </div>
                  </div>
                </div>

                {/* Dialog Footer Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetFilter}
                    className="w-1/2 rounded-full border-border/60"
                  >
                    Reset
                  </Button>

                  <Button
                    type="button"
                    onClick={handleApplyFilter}
                    className="w-1/2 rounded-full bg-primary text-primary-foreground"
                  >
                    Terapkan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ================= ACTIVE FILTER BADGES ================= */}
        {(selectedCategory !== "all" || maxPrice < 200000 || searchQuery) && (
          <div
            className={`flex flex-wrap items-center gap-2 pt-6 ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "200ms" }}
          >
            <span className="text-xs text-muted-foreground">Filter aktif:</span>
            {searchQuery && (
              <Badge
                variant="secondary"
                className="rounded-full text-[11px] gap-1 px-3 py-1"
              >
                Kata: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge
                variant="secondary"
                className="rounded-full text-[11px] gap-1 px-3 py-1 capitalize"
              >
                Kategori: {selectedCategory}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                />
              </Badge>
            )}
            {maxPrice < 200000 && (
              <Badge
                variant="secondary"
                className="rounded-full text-[11px] gap-1 px-3 py-1"
              >
                &le; Rp {maxPrice.toLocaleString("id-ID")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setMaxPrice(200000)}
                />
              </Badge>
            )}
          </div>
        )}

        {/* ================= LIST TEMA GRID ================= */}
        {/* ================= LIST TEMA GRID ================= */}
        <div className="pt-8 pb-12">
          {currentThemes.length > 0 ? (
            /* Responsive Grid: Mobile 2 kolom, Tablet (md) 3 kolom, Desktop (lg) 4 kolom */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {currentThemes.map((theme, index) => (
                <Card
                  key={theme.id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/50 bg-card/60 p-2.5 sm:p-4 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-border ${
                    isVisible ? "animate-zoom-in" : hiddenClass
                  }`}
                  style={{ animationDelay: `${((index % 10) + 1) * 100}ms` }}
                >
                  <div>
                    {/* Frame Gambar */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-muted/50">
                      <Image
                        src={theme.image}
                        alt={theme.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Category Badge & Special Badge */}
                      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between gap-1 sm:gap-2">
                        <Badge
                          variant="secondary"
                          className="rounded-full border border-border/40 bg-background/80 text-foreground/90 backdrop-blur-md px-2 py-0.5 text-[9px] sm:text-[10px] font-medium capitalize shadow-xs"
                        >
                          {theme.category}
                        </Badge>
                        {theme.badge && (
                          <Badge className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[9px] sm:text-[10px] font-medium shadow-xs">
                            {theme.badge}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Detail */}
                    <div className="px-1 pt-3 sm:pt-4">
                      <h3 className="font-caveat text-xl sm:text-2xl font-bold tracking-wide text-foreground line-clamp-1">
                        {theme.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-semibold text-primary mt-0.5">
                        Rp {theme.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1.5 sm:mt-2">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-3 sm:pt-4 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full border-border/60 bg-transparent text-[11px] sm:text-xs h-8 sm:h-9 hover:bg-secondary/60"
                    >
                      <Link
                        href={`/demo/${theme.slug}`}
                        className="flex items-center justify-center gap-1 sm:gap-1.5"
                      >
                        <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70" />
                        Preview
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="w-full rounded-full bg-primary text-primary-foreground text-[11px] sm:text-xs h-8 sm:h-9"
                    >
                      <Link
                        href={`/order?theme=${theme.slug}`}
                        className="flex items-center justify-center gap-1 sm:gap-1.5"
                      >
                        <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        Order
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <p className="text-lg font-semibold text-foreground">
                Tema tidak ditemukan
              </p>
              <p className="text-xs md:text-sm text-muted-foreground max-w-sm">
                Coba sesuaikan kata kunci pencarian atau reset filter untuk
                melihat koleksi lainnya.
              </p>
              <Button
                onClick={handleResetFilter}
                variant="outline"
                className="rounded-full mt-2"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-center gap-2 pt-4 border-t border-border/30 ${
              isVisible ? "animate-slide-in-bottom" : hiddenClass
            }`}
            style={{ animationDelay: "300ms" }}
          >
            {/* Prev Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full h-9 w-9 border-border/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-9 w-9 rounded-full text-xs font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded-full h-9 w-9 border-border/60"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
