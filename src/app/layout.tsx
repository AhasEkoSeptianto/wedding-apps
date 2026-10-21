import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JanjiSuci — Platform Undangan Pernikahan Digital Mewah",
  description: "Eksplorasi undangan digital bertaraf couture yang memadukan kehangatan estetika kertas bertekstur, sentuhan foil emas, dan kecanggihan teknologi interaktif modern.",
  openGraph: {
    title: "JanjiSuci — Katalog Template Undangan Pernikahan Digital",
    description: "Temukan desain impian untuk hari bahagia Anda dengan 120+ pilihan template undangan eksklusif.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${plusJakarta.variable} scroll-smooth`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-[#F9F9FF] text-[#181C23] antialiased selection:bg-[#FFDDB0] selection:text-[#281800]">
        {children}
      </body>
    </html>
  );
}
