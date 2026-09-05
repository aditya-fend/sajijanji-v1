import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Digital Wedding Invitation Workspace & Builder",
  description: "2-Tier Digital Wedding Invitation Platform & Template Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Dancing+Script:wght@400;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Sacramento&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-800 selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
