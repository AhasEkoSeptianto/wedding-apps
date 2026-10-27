export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceBorder: string;
  border: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  text: string;
  textHeading: string;
  textBody: string;
  muted: string;
}

export interface ThemeOrnament {
  symbol: string;
  style: string;
}

export interface WeddingTheme {
  id: string;
  name: string;
  category: "Luxury" | "Floral" | "Adat & Budaya" | "Modern & Minimalis" | "Rustic";
  description: string;
  badge: string;
  previewImage: string;
  colors: ThemeColors;
  ornament: ThemeOrnament;
  fonts: {
    heading: string;
    body: string;
  };
  isDark: boolean;
}

export const THEME_CATEGORIES = [
  "Semua",
  "Luxury",
  "Floral",
  "Adat & Budaya",
  "Modern & Minimalis",
  "Rustic",
] as const;

export type ThemeCategory = (typeof THEME_CATEGORIES)[number];

export const WEDDING_THEMES: WeddingTheme[] = [
  {
    id: "royal-bloom",
    name: "Royal Champagne Gold",
    category: "Luxury",
    description: "Kombinasi klasik champagne gold, ivory mewah, dan ornamen anggun bergaya aristokrat modern.",
    badge: "Terpopuler",
    previewImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#FAF7F2",
      surface: "#FFFFFF",
      surfaceBorder: "#EDE8E0",
      border: "#EDE8E0",
      primary: "#C5A059",
      primaryDark: "#997328",
      primaryLight: "#F5EAD4",
      accent: "#D4AF37",
      text: "#1C1917",
      textHeading: "#2A2521",
      textBody: "#57534E",
      muted: "#78716C",
    },
    ornament: {
      symbol: "❖",
      style: "classic",
    },
    fonts: {
      heading: "font-heading",
      body: "font-sans",
    },
    isDark: false,
  },
  {
    id: "serene-botanical",
    name: "Serene Botanical Sage",
    category: "Floral",
    description: "Sentuhan dedaunan eucalyptus dan sage green yang menyejukkan hati, melambangkan awal kehidupan baru yang asri.",
    badge: "Favorit",
    previewImage:
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#F4F7F4",
      surface: "#FFFFFF",
      surfaceBorder: "#DCE5DC",
      border: "#DCE5DC",
      primary: "#3D6B52",
      primaryDark: "#2B4C3A",
      primaryLight: "#DDECE3",
      accent: "#8FA382",
      text: "#1E2A22",
      textHeading: "#1A2E22",
      textBody: "#4A5F52",
      muted: "#607267",
    },
    ornament: {
      symbol: "❀",
      style: "floral",
    },
    fonts: {
      heading: "font-heading",
      body: "font-sans",
    },
    isDark: false,
  },
  {
    id: "heritage-kasunanan",
    name: "Kasunanan Karaton Solo",
    category: "Adat & Budaya",
    description: "Kemegahan adat keraton Jawa dengan dominasi cokelat sogan, ukiran prada emas, dan siluet gunungan sakral.",
    badge: "Adat Jawa",
    previewImage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#FBF7F0",
      surface: "#FFFFFF",
      surfaceBorder: "#E8DCCF",
      border: "#E8DCCF",
      primary: "#7A4927",
      primaryDark: "#543017",
      primaryLight: "#F2E5D5",
      accent: "#C59B27",
      text: "#2B1810",
      textHeading: "#29160E",
      textBody: "#5C463C",
      muted: "#6E5B50",
    },
    ornament: {
      symbol: "⚜",
      style: "javanese",
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
    },
    isDark: false,
  },
  {
    id: "golden-amore",
    name: "Golden Amore Noir",
    category: "Luxury",
    description: "Kesan eksklusif malam penuh kemewahan, kombinasi deep midnight navy dan line-art emas berkilau bergaya Art Deco.",
    badge: "Eksklusif VIP",
    previewImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#0F141C",
      surface: "#18202C",
      surfaceBorder: "#2A3648",
      border: "#2A3648",
      primary: "#E5C07B",
      primaryDark: "#C49E52",
      primaryLight: "#332B1E",
      accent: "#F3D382",
      text: "#F3F4F6",
      textHeading: "#FFFFFF",
      textBody: "#CBD5E1",
      muted: "#9CA3AF",
    },
    ornament: {
      symbol: "✦",
      style: "geometric",
    },
    fonts: {
      heading: "font-heading",
      body: "font-sans",
    },
    isDark: true,
  },
  {
    id: "terracotta-romance",
    name: "Terracotta Sunset Boho",
    category: "Rustic",
    description: "Kehangatan rona tembikar terracotta berpadu pampas grass kering bergaya Bohemian modern yang santai nan puitis.",
    badge: "Trending",
    previewImage:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#FAF4EF",
      surface: "#FFFFFF",
      surfaceBorder: "#EEDCD2",
      border: "#EEDCD2",
      primary: "#C86446",
      primaryDark: "#9E442B",
      primaryLight: "#F8E5DC",
      accent: "#E29377",
      text: "#2E1B15",
      textHeading: "#2B1711",
      textBody: "#5C463F",
      muted: "#7D6258",
    },
    ornament: {
      symbol: "❁",
      style: "boho",
    },
    fonts: {
      heading: "font-heading",
      body: "font-sans",
    },
    isDark: false,
  },
  {
    id: "minimalist-elegance",
    name: "Editorial Vogue Monochrome",
    category: "Modern & Minimalis",
    description: "Desain monokrom ultra-bersih dengan tipografi serif tajam bergaya majalah editorial fesyen kontemporer dunia.",
    badge: "Minimalis",
    previewImage:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#FBFBFA",
      surface: "#FFFFFF",
      surfaceBorder: "#E4E4E7",
      border: "#E4E4E7",
      primary: "#18181B",
      primaryDark: "#09090B",
      primaryLight: "#F4F4F5",
      accent: "#52525B",
      text: "#09090B",
      textHeading: "#18181B",
      textBody: "#52525B",
      muted: "#71717A",
    },
    ornament: {
      symbol: "—",
      style: "minimal",
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
    },
    isDark: false,
  },
  {
    id: "sunda-siger",
    name: "Sunda Siger Rumpun Melati",
    category: "Adat & Budaya",
    description: "Keanggunan adat Sunda dengan sentuhan hijau zamrud parahyangan, ronce melati suci, dan mahkota siger kencana.",
    badge: "Adat Sunda",
    previewImage:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#F6FAF8",
      surface: "#FFFFFF",
      surfaceBorder: "#D8EAE1",
      border: "#D8EAE1",
      primary: "#1D6348",
      primaryDark: "#144633",
      primaryLight: "#DDF2E8",
      accent: "#C2A649",
      text: "#11261C",
      textHeading: "#0E2118",
      textBody: "#3E574B",
      muted: "#516C60",
    },
    ornament: {
      symbol: "✤",
      style: "sundanese",
    },
    fonts: {
      heading: "font-heading",
      body: "font-sans",
    },
    isDark: false,
  },
  {
    id: "minang-songket",
    name: "Minang Songket Balai Gadang",
    category: "Adat & Budaya",
    description: "Kebanggaan tradisi Minangkabau dengan warna marun beludru agung, sulaman benang ameh songket, dan suntiang kencana.",
    badge: "Adat Minang",
    previewImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    colors: {
      bg: "#FAF3F3",
      surface: "#FFFFFF",
      surfaceBorder: "#EED8DC",
      border: "#EED8DC",
      primary: "#8B1E2F",
      primaryDark: "#641320",
      primaryLight: "#FCE5E8",
      accent: "#D4A338",
      text: "#290A10",
      textHeading: "#26080E",
      textBody: "#59373D",
      muted: "#6B494F",
    },
    ornament: {
      symbol: "❦",
      style: "minang",
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
    },
    isDark: false,
  },
];

export function getAllThemes(): WeddingTheme[] {
  return WEDDING_THEMES;
}

export function getTheme(id?: string): WeddingTheme {
  if (!id) return WEDDING_THEMES[0];
  const found = WEDDING_THEMES.find((t) => t.id === id);
  return found || WEDDING_THEMES[0];
}
