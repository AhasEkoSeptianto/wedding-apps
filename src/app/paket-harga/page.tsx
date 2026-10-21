"use client";

import Link from "next/link";
import { useState } from "react";
import HeaderNav from "@/components/catalog/HeaderNav";
import FooterCatalog from "@/components/catalog/FooterCatalog";

// WhatsApp Base URL for Official JanjiSuci Customer Service
const WA_PHONE = "6285810217197";

function waOrderLink(packageName: string, billingPeriodText: string, price: string) {
  const msg = `Halo Admin JanjiSuci, saya tertarik memesan Paket ${packageName} (${billingPeriodText} - ${price}). Mohon info panduan pembayaran dan aktivasi undangan saya.`;
  return `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(msg)}`;
}

function waConsultationLink() {
  const msg = `Halo Tim Kreatif JanjiSuci, saya ingin berkonsultasi mengenai pemilihan template dan paket undangan pernikahan saya.`;
  return `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(msg)}`;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Berapa lama undangan digital saya selesai dibuat?",
    answer:
      "Undangan Anda langsung aktif secara instan (real-time). Anda dapat memilih template, mengisi data pengantin, tanggal akad & resepsi, serta mengunggah galeri foto hanya dalam waktu 10 hingga 20 menit melalui editor interaktif kami.",
  },
  {
    question: "Bagaimana cara membagikan undangan via WhatsApp?",
    answer:
      "Di dalam dashboard pengantin JanjiSuci, tersedia fitur WhatsApp Share Generator. Anda cukup mengetikkan nama tamu, lalu klik tombol \"Kirim WhatsApp\". Sistem otomatis membuka aplikasi WhatsApp dengan pesan pembuka sopan beserta link personal yang tertulis nama tamu secara eksklusif.",
  },
  {
    question: "Apakah data amplop digital aman dan langsung masuk ke rekening pengantin?",
    answer:
      "100% aman dan langsung. JanjiSuci tidak memotong persentase sepeserpun dari kado Anda. Nomor rekening bank atau kode QRIS yang Anda masukkan langsung ditampilkan kepada tamu, sehingga transfer dana langsung masuk ke rekening Anda tanpa perantara.",
  },
  {
    question: "Bisakah mengubah data informasi setelah undangan disebar?",
    answer:
      "Tentu saja! Anda memiliki akses penuh ke Dashboard Pengantin kapan saja. Jika terdapat perubahan jadwal, lokasi, denah, atau foto galeri, Anda tinggal mengeditnya dan perubahan akan langsung terupdate pada link undangan yang telah disebar tanpa perlu membuat link baru.",
  },
  {
    question: "Apakah saya bisa upgrade paket sewaktu-waktu?",
    answer:
      "Ya, Anda dapat memulai dengan Paket Silver (Gratis) terlebih dahulu. Kapan pun Anda siap menyebarkan undangan dan menginginkan fitur audio atau custom link, Anda cukup klik upgrade ke Paket Gold atau Platinum hanya dengan membayar selisihnya.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"event" | "lifetime">("lifetime");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const periodLabel = billingPeriod === "event" ? "Per Acara" : "Akses Seumur Hidup";

  // Dynamic pricing values
  const goldPrice = billingPeriod === "event" ? "Rp 99.000" : "Rp 149.000";
  const goldStriked = billingPeriod === "event" ? "Rp 149.000" : "Rp 249.000";
  const goldDiscount = billingPeriod === "event" ? "Hemat 33%" : "Hemat 40%";
  const goldSubtext =
    billingPeriod === "event" ? "Per Satu Acara Pernikahan" : "Sekali Bayar • Akses Selamanya";

  const platPrice = billingPeriod === "event" ? "Rp 279.000" : "Rp 399.000";
  const platStriked = billingPeriod === "event" ? "Rp 399.000" : "Rp 599.000";
  const platDiscount = billingPeriod === "event" ? "Hemat 30%" : "Solusi Resepsi";
  const platSubtext =
    billingPeriod === "event"
      ? "Per Satu Acara & Akses Resepsi"
      : "Sekali Bayar • Termasuk Asistensi Penuh";

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Top Fixed Header */}
      <HeaderNav />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-grow">
        <div className="flex flex-col w-full">
          {/* Ambient Background Layer */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-gradient-to-b from-primary-fixed/30 via-secondary-container/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-96 right-10 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Editorial Header & Intro */}
            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 pt-10 sm:pt-14 pb-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-primary shadow-xs mb-4 border border-outline-variant/30">
                <span
                  className="material-symbols-outlined text-[16px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  workspace_premium
                </span>
                <span className="text-xs tracking-wider uppercase font-semibold">
                  Investasi Transparan &amp; Tanpa Biaya Tersembunyi
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-on-surface max-w-4xl mx-auto leading-tight mb-3">
                Pilih Paket Terbaik untuk Momen Terindah Seumur Hidup
              </h1>

              <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
                Hadirkan impresi anggun nan berkesan bagi para tamu undangan. Pilih paket pernikahan
                digital Anda dengan sistem aktivasi instan dan akses penuh tanpa komplikasi.
              </p>

              {/* Billing Period Switcher */}
              <div className="inline-flex items-center justify-center p-1.5 rounded-full bg-surface-container-high shadow-inner gap-1 mx-auto border border-outline-variant/20">
                <button
                  onClick={() => setBillingPeriod("event")}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    billingPeriod === "event"
                      ? "bg-primary text-on-primary shadow-md"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Per Acara
                </button>

                <button
                  onClick={() => setBillingPeriod("lifetime")}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    billingPeriod === "lifetime"
                      ? "bg-primary text-on-primary shadow-md"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  <span>Akses Seumur Hidup</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                    Hemat 30%
                  </span>
                </button>
              </div>
            </section>

            {/* Pricing Matrix Cards */}
            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {/* 1. Silver Tier (Free / Starter) */}
                <div className="flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30 relative">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Paket Silver
                      </span>
                      <span className="p-2 rounded-full bg-surface-container text-on-surface-variant">
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
                      Sempurna untuk acara lamaran, syukuran sederhana, atau mencoba fitur visual interaktif kami.
                    </p>

                    <div className="mb-6 p-4 bg-surface-container-low/60 rounded-xl">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-3xl sm:text-4xl text-on-surface font-semibold">
                          Rp 0
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant mt-1 block">
                        Gratis Tanpa Biaya Berlangganan
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Fitur yang Termasuk:
                      </p>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>1 Pilihan Desain Template Standar</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Maksimal 50 Kuota Nama Tamu</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Penghitung Mundur (Countdown Hari-H)</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Formulir Konfirmasi RSVP Dasar</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Masa Tayang Aktif 1 Bulan</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface-variant/70 text-xs sm:text-sm">
                        <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">
                          info
                        </span>
                        <span className="italic">Memuat watermark tanda air JanjiSuci</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/editor"
                    className="w-full text-center py-3 px-6 rounded-full text-xs sm:text-sm font-semibold text-primary bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Mulai Gratis Sekarang
                  </Link>
                </div>

                {/* 2. Gold Tier (Most Popular - Centerpiece) */}
                <div className="flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xl relative lg:-translate-y-4 bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest to-surface-container-low border-2 border-primary/30">
                  {/* Floating Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap tracking-wide uppercase">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      favorite
                    </span>
                    <span>PILIHAN FAVORIT PENGANTIN</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 pt-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Paket Gold
                      </span>
                      <span className="p-2 rounded-full bg-primary-fixed text-on-primary-fixed">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          stars
                        </span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
                      Solusi terlengkap dan berkelas untuk pernikahan elegan tanpa batasan kreasi.
                    </p>

                    <div className="mb-6 p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="line-through text-on-surface-variant text-xs">
                          {goldStriked}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                          {goldDiscount}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-3xl sm:text-4xl text-primary font-bold">
                          {goldPrice}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant mt-1 block">
                        {goldSubtext}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Semua Kemewahan JanjiSuci:
                      </p>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="font-medium">
                          Bebas Akses Semua Template Premium (Modern, Rustic, &amp; Adat)
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="font-medium">
                          Unlimited Nama Tamu &amp; Link Personalisasi WhatsApp
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Amplop Digital &amp; QRIS Otomatis (0% Potongan Komisi)</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Musik Latar Sepuasnya (Koleksi Eksklusif / Upload Audio Sendiri)</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Galeri Foto hingga 30 Slot + Integrasi Video Sinematik</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Buku Tamu Interaktif &amp; Doa Real-time</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Subdomain Custom (janjisuci.com/dimas-sarah)</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="font-medium">Tanpa Watermark JanjiSuci</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={waOrderLink("Gold", periodLabel, goldPrice)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 cursor-pointer block"
                  >
                    Pilih Paket Gold Sekarang
                  </a>
                </div>

                {/* 3. Platinum VIP Tier (Organizer & Full Suite) */}
                <div className="flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30 relative">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        Paket Platinum VIP
                      </span>
                      <span className="p-2 rounded-full bg-secondary-container text-on-secondary-container">
                        <span className="material-symbols-outlined text-[20px]">diamond</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
                      Fasilitas VIP kelas atas dan sistem manajemen resepsi lengkap terintegrasi langsung dengan panitia.
                    </p>

                    <div className="mb-6 p-4 bg-surface-container-low/60 rounded-xl border border-outline-variant/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="line-through text-on-surface-variant text-xs">
                          {platStriked}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                          {platDiscount}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-3xl sm:text-4xl text-on-surface font-semibold">
                          {platPrice}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant mt-1 block">
                        {platSubtext}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        Semua Fitur Gold, Ditambah:
                      </p>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="font-semibold">
                          Custom Top-Level Domain (contoh: dimasdansarah.com)
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="font-medium">
                          Sistem QR Code Check-in Resepsi (Buku Tamu Digital On-site via iPad/HP)
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>WhatsApp Auto-Blast Resmi Bebas Blokir</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Manajemen Nomor Meja &amp; Denah Tamu (Seating Plan)</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Bantuan Setup Desain Personal oleh Tim Kreatif JanjiSuci</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-on-surface text-xs sm:text-sm">
                        <span
                          className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span>Layanan Pelanggan VIP Khusus 24/7 Hari-H</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={waOrderLink("Platinum VIP", periodLabel, platPrice)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold text-on-secondary bg-secondary hover:bg-on-secondary-container transition-colors shadow-sm cursor-pointer block"
                  >
                    Pesan Paket Platinum VIP
                  </a>
                </div>
              </div>
            </section>

            {/* Visual Feature Highlights (Bento Grid) */}
            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Keunggulan Teknologi
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-on-surface mt-2 font-normal">
                  Mengapa Ribuan Pasangan Memilih JanjiSuci?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bento 1 */}
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-6">
                    <span className="material-symbols-outlined text-[26px]">qr_code_scanner</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-on-surface mb-2 font-semibold">
                      Check-in Meja Kilat
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Tamu cukup menunjukkan QR Code pribadi pada smartphone. Penerima tamu cukup
                      memindai dengan kamera HP tanpa antrean panjang.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center text-secondary text-xs font-semibold">
                    <span>Sinkronisasi otomatis dalam 0.3 detik</span>
                  </div>
                </div>

                {/* Bento 2 */}
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-on-surface mb-2 font-semibold">
                      Amplop Digital Tanpa Potongan
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Kado tanda kasih dikirimkan langsung ke nomor rekening atau dompet digital pribadi
                      mempelai tanpa perantara dan 100% aman.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center text-primary text-xs font-semibold">
                    <span>Dukungan BCA, Mandiri, BRI, QRIS &amp; GoPay</span>
                  </div>
                </div>

                {/* Bento 3 */}
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary mb-6">
                    <span className="material-symbols-outlined text-[26px]">forward_to_inbox</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-on-surface mb-2 font-semibold">
                      WhatsApp Generator 1-Klik
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Satu ketukan untuk membuat pesan WhatsApp personal kepada masing-masing kerabat
                      dengan nama tertera rapi pada salam pembuka.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center text-tertiary text-xs font-semibold">
                    <span>Kirim santun, cepat &amp; anti ribet</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Social Proof & Couple Stories */}
            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                    Kisah Bahagia
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl text-on-surface mt-2 font-normal">
                    Dicintai Oleh Lebih dari 12.000+ Mempelai
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  <span className="text-xs sm:text-sm font-semibold text-on-surface ml-2">
                    4.98 / 5.0 Rating Pasangan
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Testimonial 1 */}
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant italic mb-6 leading-relaxed">
                      &ldquo;Template Paket Gold sangat mewah dan clean. Tamu-tamu kami banyak yang
                      memuji lagunya yang syahdu dan kemudahan saat transfer kado via QRIS. Benar-benar
                      sebanding!&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                      alt="Aditya & Farah"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPm5BgUSGiW_Mo8V0gxWgynlwtPi9WPqgoYkw7a05WspnjPf4z4Kpjto3ift9lb_RM7YKXBefBU84K5V4zbVcMHRKrDn-KArTNRUMnSk_r9fLL-M9xzbOMcj7mmZIiCebIvcZK74pOq4pOa09k911f0Bn3EidXKTdkFeFv5nt3dlzZ06WnBncYvOozEqiWLlImk4lAE7buIrqVeRWO7Kx6xhRCs1SHlrw55fHQRPLIiY2YLYZHmGFLzg"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface">Aditya &amp; Farah</h4>
                      <p className="text-xs text-on-surface-variant">Menikah di Plataran Dharmawangsa, Jakarta</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant italic mb-6 leading-relaxed">
                      &ldquo;Fitur QR Check-in Paket Platinum VIP sangat membantu tim WO kami di pintu
                      masuk ballroom. Tidak ada lagi tumpukan buku tamu manual yang basah oleh tinta.&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                      alt="Bram & Clarissa"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGaR6JMoGO8GdR2bC1DK97ioF2c6D-AgapI3aGLOk8G5iWRaFKoyaG2Jubd4VluGp2Y1yisGcjIKYuskVtP6hH9_Q1qIx2_18FYUix34ES3Nioa7efCjqf6k6HC9JGQGQ0Yi_pLh1aialg8qChheMuyf3fiAfmX_0MUKOKxUW9HSPa-ds8RtpJ3Nk5DkXmpcuIfd_ZCcw8-wUcUWOteJWC7HYtlrtzRoC_HGIXnfbdivS-n_x0GFo99w"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface">Bram &amp; Clarissa</h4>
                      <p className="text-xs text-on-surface-variant">Menikah di Hyatt Regency, Yogyakarta</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant italic mb-6 leading-relaxed">
                      &ldquo;Kami hanya punya waktu 2 minggu persiapan. Berkat JanjiSuci, undangan selesai
                      dalam hitungan jam dan bisa langsung dibagikan ke seluruh keluarga besar via
                      WhatsApp.&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                      alt="Rizky & Annisa"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa5qSxVvX_8n4X6L76w0i8-gXU5mlaMmTGOEjF5fsZrI0GzFfJLpaWj_Ar2CRy1akJoSMultUpzGWzNa2s3rB-NLQUWlTsIq3F4xyc3w8alMlq5Iy3QigSPi3DNqWIF4QqWgd7hI03dNUnWoaBsBNLWxzZLa_mGWX2OTK8-TlprdZ9zHc8En2dQyrZ1OQNVdVaeP_Tv5NYo4qCC5JNXBUy69pdNBYA06V0bv0Oko0UkmvgCUj3-6_zJA"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface">Rizky &amp; Annisa</h4>
                      <p className="text-xs text-on-surface-variant">Menikah di Bandung Convention Center</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section (Accordion) */}
            <section className="max-w-[960px] mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
              <div className="text-center mb-10">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Pusat Informasi
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-on-surface mt-2 font-normal">
                  Pertanyaan yang Sering Diajukan
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-xl mx-auto leading-relaxed">
                  Semua hal yang perlu Anda ketahui mengenai aktivasi, privasi, dan kelengkapan teknis undangan Anda.
                </p>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between text-on-surface font-semibold text-sm sm:text-base hover:bg-surface-container-low/40 transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="pr-4">{faq.question}</span>
                        <span
                          className={`material-symbols-outlined text-on-surface-variant shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 text-on-surface-variant text-xs sm:text-sm leading-relaxed border-t border-outline-variant/20 animate-fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bottom Reassurance Banner */}
            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 pt-4 pb-16">
              <div className="bg-primary text-on-primary rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-container/40 to-transparent pointer-events-none" />

                <div className="max-w-xl z-10">
                  <h3 className="font-serif text-2xl sm:text-3xl text-on-primary font-normal mb-2">
                    Masih Ragu Memilih Desain yang Tepat?
                  </h3>
                  <p className="text-xs sm:text-sm text-on-primary/90 leading-relaxed">
                    Coba seluruh fitur dan lihat pratinjau langsung di smartphone Anda sekarang.
                    Tanpa perlu memasukkan nomor kartu kredit.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full sm:w-auto shrink-0">
                  <Link
                    href="/editor"
                    className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-surface-container-lowest text-primary font-semibold text-xs sm:text-sm hover:bg-surface transition-all shadow-md cursor-pointer"
                  >
                    Buka Live Editor Gratis
                  </Link>
                  <a
                    href={waConsultationLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-primary-container text-on-primary font-semibold text-xs sm:text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    <span>Konsultasi Desainer</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterCatalog />
    </div>
  );
}
