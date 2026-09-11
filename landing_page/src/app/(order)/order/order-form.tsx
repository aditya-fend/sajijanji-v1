"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  MessageCircle,
  Palette,
  X,
} from "lucide-react";
import { THEME_OPTIONS } from "@/data/theme-options";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const countryCodes = [
  { code: "+62", name: "Indonesia" },
  { code: "+60", name: "Malaysia" },
  { code: "+65", name: "Singapura" },
  { code: "+61", name: "Australia" },
  { code: "+1", name: "Amerika Serikat" },
  { code: "+44", name: "Inggris" },
  { code: "+81", name: "Jepang" },
  { code: "+82", name: "Korea Selatan" },
];

const orderSchema = z.object({
  name: z.string().trim().min(2, "Nama wajib diisi minimal 2 karakter."),
  countryCode: z.string().min(1, "Pilih kode negara."),
  whatsapp: z
    .string()
    .trim()
    .min(6, "Nomor WhatsApp wajib diisi.")
    .regex(/^[0-9\s()-]+$/, "Nomor WhatsApp hanya boleh berisi angka."),
  theme: z.string().min(1, "Pilih tema undangan."),
  duration: z.number().int().min(1, "Durasi minimal 1 bulan."),
  galleryCount: z
    .number()
    .int()
    .min(0, "Jumlah foto tidak boleh kurang dari 0.")
    .max(100, "Jumlah foto maksimal 100."),
  rsvp: z.boolean(),
  dressCode: z.boolean(),
  details: z.string().trim().max(1000, "Detail maksimal 1000 karakter."),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const steps = [
  { number: 1, title: "Data diri" },
  { number: 2, title: "Paket" },
  { number: 3, title: "Fitur" },
  { number: 4, title: "Review" },
];

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function OrderForm() {
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [themeSearch, setThemeSearch] = useState("");
  const [submittedValues, setSubmittedValues] =
    useState<OrderFormValues | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      countryCode: "+62",
      whatsapp: "",
      theme: "",
      duration: 1,
      galleryCount: 0,
      rsvp: false,
      dressCode: false,
      details: "",
    },
    mode: "onTouched",
  });

  const selectedThemeSlug = form.watch("theme");

  const selectedTheme = THEME_OPTIONS.find(
    (theme) => theme.slug === selectedThemeSlug,
  );

  const duration = Number(form.watch("duration")) || 1;
  const galleryCount = Number(form.watch("galleryCount")) || 0;
  const rsvp = form.watch("rsvp");
  const dressCode = form.watch("dressCode");

  const filteredThemeOptions = THEME_OPTIONS.filter((theme) =>
    theme.title.toLowerCase().includes(themeSearch.toLowerCase()),
  );

  const basePrice = 129000;
  const durationPrice = Math.max(duration - 1, 0) * 20000;
  const galleryPrice = galleryCount * 1000;
  const totalPrice = basePrice + durationPrice + galleryPrice;

  useEffect(() => {
    const themeFromUrl = searchParams.get("theme");

    if (
      themeFromUrl &&
      THEME_OPTIONS.some((theme) => theme.slug === themeFromUrl)
    ) {
      form.setValue("theme", themeFromUrl, {
        shouldValidate: true,
      });
    }
  }, [form, searchParams]);

  const selectTheme = (slug: string) => {
    form.setValue("theme", slug, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setIsThemeModalOpen(false);
    setThemeSearch("");
  };

  const stepFields: Record<number, (keyof OrderFormValues)[]> = {
    1: ["name", "countryCode", "whatsapp", "theme"],
    2: ["duration", "galleryCount"],
    3: ["details"],
  };

  const nextStep = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    const isValid = await form.trigger(stepFields[currentStep]);

    if (isValid) {
      setCurrentStep((step) => Math.min(step + 1, 4));
    }
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const buildWhatsappUrl = (values: OrderFormValues) => {
    const theme = THEME_OPTIONS.find((option) => option.slug === values.theme);

    const features = [
      values.rsvp ? "RSVP" : "",
      values.dressCode ? "Dress code" : "",
    ].filter(Boolean);

    const message = [
      "Halo Saji Janji 👋",
      "Saya ingin memesan undangan digital dengan detail berikut:",
      "",
      `Nama: ${values.name}`,
      `WhatsApp: ${values.countryCode} ${values.whatsapp}`,
      `Tema: ${theme?.title ?? "Belum dipilih"}`,
      `Durasi: ${values.duration} bulan`,
      `Foto galeri: ${values.galleryCount} foto`,
      `Fitur tambahan: ${features.length ? features.join(", ") : "Tidak ada"}`,
      `Detail tambahan: ${values.details || "Tidak ada"}`,
      "",
      `Estimasi total: ${formatRupiah(totalPrice)}`,
      "",
      "Mohon bantu proses pesanan saya. Terima kasih 🙏",
    ].join("\n");

    return `https://wa.me/6288983483105?text=${encodeURIComponent(message)}`;
  };

  const handleFinalSubmit = (values: OrderFormValues) => {
    setSubmittedValues(values);

    window.open(buildWhatsappUrl(values), "_blank", "noopener,noreferrer");
  };

  const fieldError = (field: keyof OrderFormValues) =>
    form.formState.errors[field]?.message;

  const handleNumericInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
  };

  return (
    <main className="h-dvh bg-background flex items-center text-foreground">
      <div className="mx-auto space-y-4 max-w-5xl px-4 py-4 md:px-8">
        <div className="pl-4">
          <Link
            href="/"
            className="flex gap-2 items-center text-muted-foreground text-sm"
          >
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
        </div>
        {/* Stepper Header */}

        {/* Form */}
        <form onSubmit={form.handleSubmit(handleFinalSubmit)}>
          <Card className="overflow-hidden rounded-3xl border-border/60 bg-card/80 p-5 shadow-sm md:p-8">
            <div className="mb-8 overflow-hidden text-foreground">
              <div className="px-5 py-5 md:px-8 md:py-6">
                <h1 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
                  Buat <span className="font-caveat">Undanganmu</span>
                </h1>

                <div className="mx-auto mt-6 flex max-w-2xl items-start">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;
                    const isLast = index === steps.length - 1;

                    return (
                      <div
                        key={step.number}
                        className="relative flex flex-1 flex-col items-center"
                      >
                        {/* Connector */}
                        {!isLast && (
                          <div
                            className={`absolute left-1/2 top-3.5 h-px w-full transition-colors duration-300 ${
                              isCompleted
                                ? "bg-muted-foreground"
                                : "bg-muted-foreground/50"
                            }`}
                          />
                        )}

                        {/* Step Circle */}
                        <div
                          className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 ${
                            isActive || isCompleted
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/50 bg-white text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            step.number
                          )}
                        </div>

                        {/* Step Label */}
                        <span
                          className={`mt-2 text-center text-[11px] font-medium transition-colors sm:text-xs ${
                            isActive || isCompleted
                              ? "text-foreground"
                              : "text-foreground/60"
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Step 1 */}
            {currentStep === 1 && (
              <section className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium">
                    Nama lengkap <span className="text-primary">*</span>
                    <Input
                      {...form.register("name")}
                      placeholder="Contoh: Aulia Rahma"
                      className="placeholder:text-muted-foreground/40"
                    />
                    {fieldError("name") && (
                      <span className="text-xs text-destructive">
                        {fieldError("name")}
                      </span>
                    )}
                  </label>

                  <label className="space-y-2 text-sm font-medium">
                    Nomor WhatsApp <span className="text-primary">*</span>
                    <div className="flex gap-2">
                      <select
                        {...form.register("countryCode")}
                        className="h-8 w-32 rounded-lg border border-input bg-background px-2 text-sm"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code} {country.name}
                          </option>
                        ))}
                      </select>

                      <Input
                        {...form.register("whatsapp")}
                        inputMode="tel"
                        placeholder="81234567890"
                        onInput={handleNumericInput}
                        className="placeholder:text-muted-foreground/40"
                      />
                    </div>
                    {fieldError("whatsapp") && (
                      <span className="text-xs text-destructive">
                        {fieldError("whatsapp")}
                      </span>
                    )}
                  </label>
                </div>

                <div className="space-y-2 text-sm font-medium">
                  <span>
                    Tema undangan <span className="text-primary">*</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsThemeModalOpen(true)}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-left text-sm transition-colors hover:border-primary"
                  >
                    <span
                      className={
                        selectedTheme
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {selectedTheme?.title ?? "Pilih tema undangan"}
                    </span>

                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {fieldError("theme") && (
                    <span className="text-xs text-destructive">
                      {fieldError("theme")}
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <section className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium">
                    Durasi undangan (bulan){" "}
                    <span className="text-primary">*</span>
                    <Input
                      type="text"
                      min={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      {...form.register("duration", {
                        setValueAs: (value) =>
                          value === "" ? undefined : Number(value),
                      })}
                      onInput={handleNumericInput}
                      className="placeholder:text-muted-foreground/40"
                    />
                    <span className="block text-xs font-normal text-muted-foreground">
                      Setiap tambahan 1 bulan dikenakan biaya Rp 20.000.
                    </span>
                    {fieldError("duration") && (
                      <span className="text-xs text-destructive">
                        {fieldError("duration")}
                      </span>
                    )}
                  </label>

                  <label className="space-y-2 text-sm font-medium">
                    Jumlah foto galeri
                    <Input
                      type="text"
                      min={0}
                      max={100}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      {...form.register("galleryCount", {
                        setValueAs: (value) =>
                          value === "" ? undefined : Number(value),
                      })}
                      onInput={handleNumericInput}
                      className="placeholder:text-muted-foreground/40"
                    />
                    <span className="block text-xs font-normal text-muted-foreground">
                      Setiap foto tambahan dikenakan biaya Rp 1.000.
                    </span>
                    {fieldError("galleryCount") && (
                      <span className="text-xs text-destructive">
                        {fieldError("galleryCount")}
                      </span>
                    )}
                  </label>
                </div>

                <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Paket dasar</span>
                    <span>{formatRupiah(basePrice)}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span>Tambahan durasi</span>
                    <span>{formatRupiah(durationPrice)}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span>Foto galeri</span>
                    <span>{formatRupiah(galleryPrice)}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <section className="space-y-6">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    {
                      name: "rsvp" as const,
                      label: "RSVP",
                      description: "Tamu dapat mengonfirmasi kehadiran.",
                    },
                    {
                      name: "dressCode" as const,
                      label: "Dress code",
                      description: "Tampilkan panduan busana untuk tamu.",
                    },
                  ].map((feature) => (
                    <label
                      key={feature.name}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 p-4 transition-colors hover:border-primary"
                    >
                      <input
                        type="checkbox"
                        {...form.register(feature.name)}
                        className="mt-1 h-4 w-4 accent-primary"
                      />

                      <span>
                        <span className="block text-sm font-semibold">
                          {feature.label}
                        </span>

                        <span className="mt-1 block text-xs text-muted-foreground">
                          {feature.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <label className="block space-y-2 text-sm font-medium">
                  Detail tambahan
                  <Textarea
                    {...form.register("details")}
                    placeholder="Contoh: ingin warna sage green, acara pada bulan Juli, atau catatan lainnya..."
                    rows={6}
                    className="placeholder:text-muted-foreground/40"
                  />
                  <span className="block text-xs font-normal text-muted-foreground">
                    Opsional. Ceritakan kebutuhan khususmu agar kami bisa
                    menyiapkannya.
                  </span>
                  {fieldError("details") && (
                    <span className="text-xs text-destructive">
                      {fieldError("details")}
                    </span>
                  )}
                </label>
              </section>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <section className="space-y-6">
                <div>
                  <h2 className="mt-2 text-2xl font-bold">Review pesanan</h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Pastikan semua data sudah benar sebelum lanjut ke WhatsApp.
                  </p>
                </div>

                <div className="divide-y divide-border/60 rounded-2xl border border-border/60">
                  {[
                    ["Nama", form.getValues("name")],
                    [
                      "WhatsApp",
                      `${form.getValues(
                        "countryCode",
                      )} ${form.getValues("whatsapp")}`,
                    ],
                    ["Tema", selectedTheme?.title ?? "-"],
                    ["Durasi", `${duration} bulan`],
                    ["Foto galeri", `${galleryCount} foto`],
                    [
                      "Fitur tambahan",
                      [rsvp && "RSVP", dressCode && "Dress code"]
                        .filter(Boolean)
                        .join(", ") || "Tidak ada",
                    ],
                    ["Detail", form.getValues("details") || "Tidak ada"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[150px_1fr]"
                    >
                      <span className="text-muted-foreground">{label}</span>

                      <span className="break-words font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-primary/10 p-5">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Estimasi total</span>
                    <span>{formatRupiah(totalPrice)}</span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Harga dapat dikonfirmasi kembali oleh tim Saji Janji melalui
                    WhatsApp.
                  </p>
                </div>

                {submittedValues && (
                  <p className="flex items-center gap-2 text-sm text-green-700">
                    <Check className="h-4 w-4" />
                    WhatsApp sudah dibuka dengan detail pesananmu.
                  </p>
                )}
              </section>
            )}

            {/* Navigation */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 1}
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={(event) => void nextStep(event)}
                  className="rounded-full"
                >
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="rounded-full bg-green-600 text-white hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Pesan via WhatsApp
                </Button>
              )}
            </div>
          </Card>
        </form>
      </div>

      {/* Theme Modal */}
      {isThemeModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Pilih tema"
        >
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-border bg-card p-5 shadow-2xl md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <Palette className="h-4 w-4" />
                  Koleksi tema
                </p>

                <h2 className="mt-2 text-2xl font-bold">Pilih tema undangan</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Tutup modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Input
              value={themeSearch}
              onChange={(event) => setThemeSearch(event.target.value)}
              placeholder="Cari nama tema..."
              className="mt-5 placeholder:text-muted-foreground/40"
            />

            <div className="mt-4 grid overflow-y-auto pr-1 sm:grid-cols-2">
              {filteredThemeOptions.map((theme) => (
                <button
                  type="button"
                  key={theme.slug}
                  onClick={() => selectTheme(theme.slug)}
                  className={`border-b border-border/50 px-3 py-3 text-left transition-colors hover:bg-muted ${
                    selectedThemeSlug === theme.slug ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {theme.title}
                  </span>

                  <span className="mt-1 block text-xs text-muted-foreground">
                    {theme.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
