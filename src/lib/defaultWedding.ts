import { WeddingData } from "@/types";
import { PRESET_HTML_TEMPLATES } from "@/lib/templateEngine";

export const DEFAULT_WEDDING_DATA: WeddingData = {
  title: "Pernikahan Dimas & Sarah",
  slug: "dimas-sarah",
  themeId: "royal-gold-majesty",
  designMode: "custom_html",
  customHtml: PRESET_HTML_TEMPLATES[0].html,
  groom: {
    fullName: "Dimas Prasetyo, S.T.",
    nickName: "Dimas",
    instagram: "@dimasprasetyo",
    parents: "Putra pertama dari Bpk. Bambang Wijaya & Ibu Sri Rahayu",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzUNvfN4JLmIEQ8Rl3ucmVP0-vib8bkuQ3IrTgVw8Qr5sjfCuCXP250Cgz911BcC7k2OJebkbkFG2QdPC2uPmB9JgO20ArGDvpU0gAuSbhYSI7-kXcn2tgNddrrMRwpjYWGzsz64YzuTcetJcaEqJJ6OK2uZbQ6mVajqzRW3u95-6UPI5E7g3WEY75DGTcZ_y5UEu_eA0ZcLAS5JKHy7r9_Lyg0m4Oqoi--PgbPYl8YDo-L0m9KgRLNQ",
  },
  bride: {
    fullName: "Sarah Anindita, M.Ds.",
    nickName: "Sarah",
    instagram: "@sarahanindita",
    parents: "Putri kedua dari Bpk. Ir. Hendra Kusuma & Ibu Ratna Dewi",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBqrJptRouC3sJfNXLjsofBuvakru1TeBprYoHukqDAMi6numwD_tbCIUj8gAmdv2RmqFwBb_l5JMoEvVo44VGvNdl3sKNhmAfevpxliVOYaJJWD_eKIOO0CiuiYkvBWAHCLhcxazK406U-fFG7DULwuD1nG7PYvz4ukXGopUFGbgkuinU9wNO5xAusEewWYWkgBN7NjgntxgHQ2Bn3UJ17VOD7tjWOJ3NnqU0qcG7XHbVUgy4mfmLmQ",
  },
  quote: {
    source: "QS. Ar-Rum: 21",
    text: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
  },
  events: {
    akad: {
      date: "Sabtu, 24 Agustus 2026",
      time: "08.00 - 10.00 WIB",
      venue: "Masjid Agung Sunda Kelapa, Menteng",
      address:
        "Jl. Taman Sunda Kelapa No.16, Menteng, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta",
    },
    resepsi: {
      date: "Sabtu, 24 Agustus 2026",
      time: "18.30 - 21.30 WIB",
      venue: "The Dharmawangsa Grand Ballroom",
      address: "Kebayoran Baru, Jakarta Selatan",
    },
  },
  music: {
    title: "Kahitna - Soulmate (Instrumental Acoustic)",
    duration: "03:42",
    enabled: true,
  },
  gift: {
    bca: "8830-1928-11 a.n Sarah Anindita",
    mandiri: "1370-0012-9901 a.n Dimas Prasetyo",
  },
  gallery: [],
  stories: [
    {
      year: "2019",
      title: "Pertama Bertemu",
      description:
        "Bertemu tanpa sengaja di studio desain kreatif Jakarta saat mengerjakan proyek kolaborasi bersama.",
    },
    {
      year: "2024",
      title: "Lamaran Romantis",
      description:
        "Di bawah gemerlap senja Labuan Bajo, Dimas mengucap janji suci untuk melangkah ke jenjang pernikahan.",
    },
  ],
  rsvp: {
    deadline: "2026-08-15",
    maxGuests: "2",
    waNotification: true,
  },
};
