import type { Metadata } from "next";
import { Geist, Caveat } from "next/font/google";
import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ScrollToTop from "@/components/shared/scroll-to-top";

// Font untuk Body (Geist Sans)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Font untuk Headline / aksen estetik (Caveat)
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Undangan Digital Elegan & Aesthetic",
  description:
    "Jasa pembuatan undangan digital eksklusif dengan desain elegan dan modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-neutral-800 selection:text-neutral-100">
        <TooltipProvider>
          <ScrollToTop />
          <Navbar />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
