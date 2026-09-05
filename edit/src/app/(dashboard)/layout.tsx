import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import Navbar from "../../components/shared/navbar";
import "@/app/globals.css";

// Load Font Geist (Body Text)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load Font Caveat (Heading / Decorative Text)
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saji Janji — Dashboard Studio",
  description: "Platform pembuat dan pengelola undangan digital eksklusif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${caveat.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground flex">
        {/* Navbar Global (Sidebar Left) */}
        <Navbar />

        {/* Main Content Area (Offset untuk Navbar 64/256px) */}
        <main className="flex-1 pl-64 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
