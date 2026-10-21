"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface TemplateItem {
  id: string;
  title: string;
  designer: string;
  category: string[];
  themeTag: string;
  tier: "vip" | "gold" | "free";
  tierBadge: string;
  tierBadgeColor: string;
  rating: number;
  popularity: number;
  couplesCount: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "royal-bloom",
    title: "The Royal Bloom",
    designer: "Atelier Janji",
    category: ["royal", "botanical"],
    themeTag: "Royal Champagne",
    tier: "vip",
    tierBadge: "Paket VIP",
    tierBadgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    rating: 4.9,
    popularity: 1480,
    couplesCount: "1.4k+ pasangan",
    price: "Rp 249.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCe-lOr70z0BHX3WNohr5iBvzHYw9qpa94vnghmX9QU3W3qsVrAErCrJtB26a71OtHGFQbS3C-NGLhraGQSiarEda0zZHv5ppeDf4D6yCFHVWu9HO-yphf8yqoMYbHdwrK5WvdyOlnblOsYrZERRqPd2znz72p7fguhPHguQ327Qj21npXwNX-JPq-ZpeyjyVp2Kqr2MsyVp0GRkz-Tk6EkRp0s14DaA0tbXWWVo5x_UJ6QVCbPty9JA",
    imageAlt: "Luxurious golden wedding invitation card mockup on ivory heavy cotton paper with embossed delicate gold foil botanical foliage",
  },
  {
    id: "serene-botanical",
    title: "Serene Botanical",
    designer: "Narra Studio",
    category: ["botanical", "rustic"],
    themeTag: "Botanical Sage",
    tier: "gold",
    tierBadge: "Terlaris",
    tierBadgeColor: "bg-secondary-fixed text-on-secondary-fixed",
    rating: 5.0,
    popularity: 1820,
    couplesCount: "1.8k+ pasangan",
    price: "Rp 149.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCeNbGo2PcbSSnFS3DFeMHtdxjjWvZz3RFiu5RpPSc3R8Y-G8mv5PmutELXssCmQ4XmRTjg_qvQg4eAPbXo2SvCc53OdxhrzDj9Gv2Vf66Ho0weviPjVAajUk-YaD5bgiZl7yikv_UxzFEX6uvw3hQBSXX3rYnpDcqh4KjMjSpkVzKyBdpCrzQrVlS2jUIHw998ZgNF9noiflwFw0w-BZnXvS1aEgfxAjrDL_xnZQBDKdLF_6DjrE1Ziw",
    imageAlt: "Sage green and eucalyptus botanical digital wedding invitation sleeve preview, watercolor olive branches",
  },
  {
    id: "golden-amore",
    title: "Golden Amore",
    designer: "Maison L'Amour",
    category: ["royal", "artdeco"],
    themeTag: "Classic Royal",
    tier: "vip",
    tierBadge: "Paket VIP",
    tierBadgeColor: "bg-primary-fixed text-on-primary-fixed",
    rating: 4.8,
    popularity: 1120,
    couplesCount: "1.1k+ pasangan",
    price: "Rp 249.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7bqxp6lprocYuM0Y3PYd-WbkQcEVdc8V9CELVdCULuYThmdC4JlRM7WMbx2ED7xcb4v8j1uR3an3_ERONAUXo6GNhE9BYnVlMVqHm_MdNNb1Jng13X5ZY8QddbSl85HIWY9YHdHD9rHKIP3urfJA-gPhOLK45rZGWH7IBQcjMkhhlmgBgvZiC6etAnj6N5kYwdgrlais_UvxhGDuGBfEclNugKWRj9CLSraeaMjLr63N-vv0Mo0RrBA",
    imageAlt: "Smartphone mock-up displaying luxury gold foil wedding invitation with geometric art deco borders",
  },
  {
    id: "heritage-kasunanan",
    title: "Heritage Kasunanan",
    designer: "Pusaka Visual",
    category: ["traditional"],
    themeTag: "Adat Jawa Karaton",
    tier: "gold",
    tierBadge: "Adat Favorit",
    tierBadgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    rating: 4.9,
    popularity: 2100,
    couplesCount: "2.1k+ pasangan",
    price: "Rp 149.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBvxKNAJFQLI0PAKy1u6x5216TXqxhTDo50f4zYp-zUcaADho7TNnTpVf_GK9o-_kp_UlWidgZwpuYd71qNS8tmyFbS8TxDFPR2VW9oOBaE2sakUfbWgkxmmY8yMPpEZK3MUhiZruh_qYmOcyMJU-AXKd16i_s48mo4uF6Vam6zZugZyAUG0bEmFHAgaSzN-yvxM4lBW9amOZYT-gUrmwrGEylcA5730wPZO9FZb0u0_Xksn5cKpHtfg",
    imageAlt: "Traditional Indonesian Javanese royal wedding invitation design, golden batik kawung ornament",
  },
  {
    id: "minimalist-elegance",
    title: "Minimalist Elegance",
    designer: "Studio Linimasa",
    category: ["minimalist"],
    themeTag: "Modern Editorial",
    tier: "free",
    tierBadge: "Gratis",
    tierBadgeColor: "bg-secondary-fixed text-on-secondary-fixed",
    rating: 4.9,
    popularity: 2950,
    couplesCount: "2.9k+ pasangan",
    price: "Gratis",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCH12rI5-CVhQf0XDmK9qPdXhs5a4NklUpY3iHCtlMTTaTIVIY2mtbSHBFFKANevQSPD8NUa7XyS76Vm70TSxllpO3mmRAgMn_N34qOL57le7Cwl2MF4i7Vj71AXvu2iQIROUsvvmAA_Mty00jLf_TS6cKd6x6ksf-xil-t9GxtLXZMnA2n4I3OsGH6AYYAcpDq2O26G6sra89tqTc6ey7M70IPgMAsT40gI0C_JW8ahNFs6yH6vIRIpg",
    imageAlt: "Editorial minimalist clean digital wedding invitation mockup on textured off-white heavy linen paper",
  },
  {
    id: "emerald-romance",
    title: "Emerald Romance",
    designer: "Bespoke Atelier",
    category: ["botanical", "royal"],
    themeTag: "Emerald Forest",
    tier: "gold",
    tierBadge: "Paket Gold",
    tierBadgeColor: "bg-surface-container-highest text-on-surface",
    rating: 4.8,
    popularity: 980,
    couplesCount: "980+ pasangan",
    price: "Rp 149.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1pPWwuVqL0YfCOJRw9aDxnOxSXW2vwf5XIoPag_Pefqz99r5psN978paVKJx13rL2MhNdDwjxoPdUC-cwcHEhu_rxWYhApZgCRhca66lKPuBoTLpCWWn8VNtwDrQYD5Fy9qKRG7JXFgroeRjKs2kmzqydXvlKYoAnMLSDsJseEKgzguiBncOraK-aMFcy926OE2F-kQEyjm7H6OOBVHJhgc7KkoZBDguH24PYl9124zKx4pF-hhxalg",
    imageAlt: "Deep emerald green invitation card with intricate warm champagne gold filigree borders",
  },
  {
    id: "blushing-petals",
    title: "Blushing Petals",
    designer: "Floraison Paper",
    category: ["rustic", "botanical"],
    themeTag: "Rustic Floral",
    tier: "free",
    tierBadge: "Gratis",
    tierBadgeColor: "bg-secondary-fixed text-on-secondary-fixed",
    rating: 4.9,
    popularity: 1650,
    couplesCount: "1.6k+ pasangan",
    price: "Gratis",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCP_18ZCTmtQ_wQMUAfykjFiRGyzJns0ToVhWDXFrrs6D-lQ9dB4ulqkxr_WZsGJP8ahMCGz5rRwKJnaP9H-aHpR3IWil8ZKh3GlTeAPW_JP4rAk68ve_uFqzJQRJNuCA8_Fxn4-HNb3MeS-WPro-QpInDa05aF869BT3BFbMyrkiJ69dB0oH08xOtJNDLCtCaQjERGgFt2zJbELu7Ph2Ts4M_rGG7opKTAj3UbyvRXTm0yJsNGxYHbyQ",
    imageAlt: "Soft dusty rose blush wedding invitation card mockup with pressed dried floral petals",
  },
  {
    id: "noir-celestial",
    title: "Noir Celestial",
    designer: "Vogue Wedding Studio",
    category: ["artdeco", "minimalist"],
    themeTag: "Art Deco Noir",
    tier: "vip",
    tierBadge: "Eksklusif",
    tierBadgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    rating: 4.9,
    popularity: 870,
    couplesCount: "870+ pasangan",
    price: "Rp 299.000",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2XMyqL3mItmvJSaJaJcjcJPCHdnVstJeWBPOq9GESxO-u7lSMn4fwahDJBENRRRs4e85oY7Qnvp6yd3dJqO-sJzLOCke6hd1vz0wwZRuLi2W_kUf8hNiVwR4FDdbGqgAe7iBMTcHHR8EqiHqQ7suzO6ttyXOHfhTRN7NIFCkrxeWQkxvqh0NsznL_pqJZKpZVPTC7pnmFugS3aEnWAVoGj-q0eUbEjuJQu_qYyvLWtz3EvPOUaT9I8A",
    imageAlt: "Dramatic modern monochrome dark mode wedding invitation on matte black cotton cardstock with refined metallic gold foil",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua Tema" },
  { id: "rustic", label: "Rustic & Vintage" },
  { id: "botanical", label: "Botanical Floral" },
  { id: "royal", label: "Royal Gold & Luxury" },
  { id: "minimalist", label: "Minimalist Modern" },
  { id: "traditional", label: "Adat Tradisional (Jawa, Minang, Sunda, Batak, Bali)" },
  { id: "artdeco", label: "Monokrom & Art Deco" },
];

interface TemplateCatalogProps {
  searchQuery: string;
}

export default function TemplateCatalog({ searchQuery }: TemplateCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyFree, setOnlyFree] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [modeFilter, setModeFilter] = useState("all");
  const [featureFilter, setFeatureFilter] = useState("all");

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === "all" || item.category.includes(selectedCategory);

      // Free toggle match
      const matchesFree = !onlyFree || item.tier === "free";

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.themeTag.toLowerCase().includes(query) ||
        item.designer.toLowerCase().includes(query) ||
        item.category.some((c) => c.includes(query));

      return matchesCategory && matchesFree && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.popularity - a.popularity;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "affordable") {
        const aFree = a.tier === "free" ? 0 : 1;
        const bFree = b.tier === "free" ? 0 : 1;
        return aFree - bFree;
      }
      return 0;
    });
  }, [selectedCategory, onlyFree, searchQuery, sortBy]);

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 md:px-12 pb-16">
      {/* Category Pills (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-secondary text-on-secondary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Filter Bar & Sort By */}
      <div className="mt-4 p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border border-outline-variant/20">
        {/* Design Modes & Feature Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-xs text-on-surface-variant text-xs sm:text-sm">
            <span className="font-semibold text-on-surface">Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-transparent text-primary font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Tampilan</option>
              <option value="web-scroll">Web Scroll Interaktif</option>
              <option value="envelope">Amplop Buka Animasi</option>
              <option value="story">Instagram Story Style</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-xs text-on-surface-variant text-xs sm:text-sm">
            <span className="font-semibold text-on-surface">Fitur Utama:</span>
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className="bg-transparent text-primary font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Fitur</option>
              <option value="music">Ada Background Musik</option>
              <option value="gallery3d">Galeri Foto 3D Parallax</option>
              <option value="streaming">Live Video Streaming</option>
              <option value="countdown">Hitung Mundur Waktu</option>
              <option value="qr">Buku Tamu QR Code</option>
            </select>
          </div>

          {/* Quick toggle chip */}
          <button
            onClick={() => setOnlyFree(!onlyFree)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold cursor-pointer ${
              onlyFree
                ? "bg-secondary text-on-secondary"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              card_giftcard
            </span>
            <span>Hanya Gratis</span>
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <span className="text-xs sm:text-sm text-on-surface-variant">
            Menampilkan{" "}
            <strong className="text-on-surface">
              {filteredTemplates.length} Desain
            </strong>{" "}
            Masterpiece
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sortBySelect" className="text-xs sm:text-sm text-on-surface-variant hidden sm:inline">
              Urutkan:
            </label>
            <div className="relative">
              <select
                id="sortBySelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-surface-container-lowest shadow-xs text-on-surface text-xs sm:text-sm font-medium cursor-pointer focus:outline-none"
              >
                <option value="popular">Terpopuler</option>
                <option value="newest">Desain Terbaru</option>
                <option value="affordable">Harga Terjangkau</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Template Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group flex flex-col rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1.5 border border-outline-variant/20"
          >
            {/* Card Thumbnail */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.imageUrl}
                alt={template.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover Overlay with Live Demo and Choose */}
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="w-full flex items-center justify-between gap-2">
                  <Link
                    href="/demo"
                    className="flex-1 py-2 px-2 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs font-semibold hover:bg-surface-container-lowest transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Live Demo</span>
                  </Link>
                  <Link
                    href="/demo"
                    className="flex-1 py-2 px-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Pilih</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Tier Ribbon */}
              <span
                className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs ${template.tierBadgeColor}`}
              >
                {template.tierBadge}
              </span>

              {/* Theme Tag */}
              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-surface/90 backdrop-blur-sm text-primary text-[11px] font-semibold group-hover:opacity-0 transition-opacity">
                {template.themeTag}
              </span>
            </div>

            {/* Card Details */}
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-serif text-lg font-bold text-on-surface truncate">
                    {template.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0 text-primary">
                    <span className="material-symbols-outlined filled text-[16px]">
                      star
                    </span>
                    <span className="text-xs font-bold">{template.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Desainer: <span className="text-on-surface font-medium">{template.designer}</span>
                </p>
              </div>

              <div className="pt-4 mt-2 flex items-center justify-between border-t border-outline-variant/15">
                <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    favorite
                  </span>
                  <span>{template.couplesCount}</span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    template.price === "Gratis" ? "text-secondary" : "text-primary"
                  }`}
                >
                  {template.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous Page"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-primary text-on-primary text-sm font-bold shadow-sm cursor-pointer"
        >
          1
        </button>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface text-sm transition-colors cursor-pointer"
        >
          2
        </button>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface text-sm transition-colors cursor-pointer"
        >
          3
        </button>
        <span className="px-2 text-outline">...</span>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface text-sm transition-colors cursor-pointer"
        >
          15
        </button>
        <button
          type="button"
          aria-label="Next Page"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
