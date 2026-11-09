import { WeddingData } from "@/types";
import { ROYAL_GOLD_MAJESTY_HTML } from "@/lib/templates/royalGoldMajesty";
import { CELESTIAL_TEMPLATE_HTML } from "@/lib/templates/celestialTemplate";

export interface PlaceholderInfo {
  tag: string;
  label: string;
  category: "Mempelai" | "Acara & Lokasi" | "Kutipan" | "Komponen Dinamis" | "Tamu & Hadiah";
  description: string;
  example: string;
}

export const AVAILABLE_PLACEHOLDERS: PlaceholderInfo[] = [
  // Mempelai
  {
    tag: "{{couple_names}}",
    label: "Nama Panggilan Pasangan",
    category: "Mempelai",
    description: "Nama panggilan mempelai pria & wanita (cth: Dimas & Sarah)",
    example: "Dimas & Sarah",
  },
  {
    tag: "{{couple_full_names}}",
    label: "Nama Lengkap Pasangan",
    category: "Mempelai",
    description: "Nama lengkap dan gelar kedua mempelai",
    example: "Dimas Prasetyo, S.T. & Sarah Anindita, M.Ds.",
  },
  {
    tag: "{{groom_name}}",
    label: "Nama Lengkap Pria",
    category: "Mempelai",
    description: "Nama lengkap mempelai pria beserta gelar",
    example: "Dimas Prasetyo, S.T.",
  },
  {
    tag: "{{groom_nickname}}",
    label: "Nama Panggilan Pria",
    category: "Mempelai",
    description: "Nama panggilan mempelai pria",
    example: "Dimas",
  },
  {
    tag: "{{groom_parents}}",
    label: "Orang Tua Pria",
    category: "Mempelai",
    description: "Keterangan orang tua mempelai pria",
    example: "Putra pertama dari Bpk. Bambang Wijaya & Ibu Sri Rahayu",
  },
  {
    tag: "{{groom_instagram}}",
    label: "Instagram Pria",
    category: "Mempelai",
    description: "Username Instagram mempelai pria",
    example: "@dimasprasetyo",
  },
  {
    tag: "{{groom_photo}}",
    label: "Foto Mempelai Pria",
    category: "Mempelai",
    description: "URL foto mempelai pria (Cloudinary)",
    example: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    tag: "{{bride_name}}",
    label: "Nama Lengkap Wanita",
    category: "Mempelai",
    description: "Nama lengkap mempelai wanita beserta gelar",
    example: "Sarah Anindita, M.Ds.",
  },
  {
    tag: "{{bride_nickname}}",
    label: "Nama Panggilan Wanita",
    category: "Mempelai",
    description: "Nama panggilan mempelai wanita",
    example: "Sarah",
  },
  {
    tag: "{{bride_parents}}",
    label: "Orang Tua Wanita",
    category: "Mempelai",
    description: "Keterangan orang tua mempelai wanita",
    example: "Putri kedua dari Bpk. Ir. Hendra Kusuma & Ibu Ratna Dewi",
  },
  {
    tag: "{{bride_instagram}}",
    label: "Instagram Wanita",
    category: "Mempelai",
    description: "Username Instagram mempelai wanita",
    example: "@sarahanindita",
  },
  {
    tag: "{{bride_photo}}",
    label: "Foto Mempelai Wanita",
    category: "Mempelai",
    description: "URL foto mempelai wanita (Cloudinary)",
    example: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    tag: "{{cover_photo}}",
    label: "Foto Sampul Pembuka (Cover Gate)",
    category: "Mempelai",
    description: "URL foto sampul depan kartu pembuka undangan sebelum tombol Buka Undangan diklik",
    example: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    tag: "{{banner_photo}}",
    label: "Foto Banner Hero Pasangan",
    category: "Mempelai",
    description: "URL foto banner lanskap / header utama kedua mempelai",
    example: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80",
  },

  // Acara & Lokasi
  {
    tag: "{{akad_date}}",
    label: "Tanggal Akad",
    category: "Acara & Lokasi",
    description: "Hari dan tanggal pelaksanaan akad nikah",
    example: "Sabtu, 24 Agustus 2026",
  },
  {
    tag: "{{akad_time}}",
    label: "Waktu Akad",
    category: "Acara & Lokasi",
    description: "Waktu pelaksanaan akad nikah",
    example: "08.00 - 10.00 WIB",
  },
  {
    tag: "{{akad_venue}}",
    label: "Tempat Akad",
    category: "Acara & Lokasi",
    description: "Nama gedung atau masjid tempat akad",
    example: "Masjid Agung Sunda Kelapa",
  },
  {
    tag: "{{akad_address}}",
    label: "Alamat Akad",
    category: "Acara & Lokasi",
    description: "Alamat lengkap pelaksanaan akad",
    example: "Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat",
  },
  {
    tag: "{{akad_maps_url}}",
    label: "Link Google Maps Akad",
    category: "Acara & Lokasi",
    description: "URL tautan Google Maps untuk navigasi",
    example: "https://maps.google.com/?q=Masjid+Agung+Sunda+Kelapa",
  },
  {
    tag: "{{resepsi_date}}",
    label: "Tanggal Resepsi",
    category: "Acara & Lokasi",
    description: "Hari dan tanggal resepsi pernikahan",
    example: "Sabtu, 24 Agustus 2026",
  },
  {
    tag: "{{resepsi_time}}",
    label: "Waktu Resepsi",
    category: "Acara & Lokasi",
    description: "Waktu pelaksanaan resepsi",
    example: "18.30 - 21.30 WIB",
  },
  {
    tag: "{{resepsi_venue}}",
    label: "Tempat Resepsi",
    category: "Acara & Lokasi",
    description: "Nama hotel atau ballroom resepsi",
    example: "The Dharmawangsa Grand Ballroom",
  },
  {
    tag: "{{resepsi_address}}",
    label: "Alamat Resepsi",
    category: "Acara & Lokasi",
    description: "Alamat lengkap pelaksanaan resepsi",
    example: "Kebayoran Baru, Jakarta Selatan",
  },
  {
    tag: "{{resepsi_maps_url}}",
    label: "Link Google Maps Resepsi",
    category: "Acara & Lokasi",
    description: "URL tautan Google Maps untuk resepsi",
    example: "https://maps.google.com/?q=The+Dharmawangsa+Jakarta",
  },

  // Kutipan
  {
    tag: "{{quote_text}}",
    label: "Teks Ayat / Kutipan",
    category: "Kutipan",
    description: "Isi teks kutipan ayat suci atau kata mutiara",
    example: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu...",
  },
  {
    tag: "{{quote_source}}",
    label: "Sumber Kutipan",
    category: "Kutipan",
    description: "Sumber surat ayat atau nama tokoh",
    example: "QS. Ar-Rum: 21",
  },

  // Tamu & Hadiah
  {
    tag: "{{guest_name}}",
    label: "Nama Tamu Undangan",
    category: "Tamu & Hadiah",
    description: "Nama tamu yang diundang (otomatis dari parameter ?to= atau ?guest=)",
    example: "Bapak & Ibu Tamu Terhormat",
  },
  {
    tag: "{{gift_bca}}",
    label: "Rekening BCA Lengkap (Fallback)",
    category: "Tamu & Hadiah",
    description: "Nomor rekening dan nama pemilik bank BCA atau rekening pertama",
    example: "8830-1928-11 a.n Sarah Anindita",
  },
  {
    tag: "{{bca_number}}",
    label: "Nomor Rekening Akun 1 / BCA",
    category: "Tamu & Hadiah",
    description: "Nomor rekening bank BCA saja tanpa nama pemilik",
    example: "8830-1928-11",
  },
  {
    tag: "{{bca_name}}",
    label: "Nama Pemilik Rekening Akun 1 / BCA",
    category: "Tamu & Hadiah",
    description: "Nama pemilik rekening bank BCA",
    example: "Sarah Anindita",
  },
  {
    tag: "{{gift_mandiri}}",
    label: "Rekening Mandiri Lengkap (Fallback)",
    category: "Tamu & Hadiah",
    description: "Nomor rekening dan nama pemilik bank Mandiri atau rekening kedua",
    example: "1370-0012-9901 a.n Dimas Prasetyo",
  },
  {
    tag: "{{mandiri_number}}",
    label: "Nomor Rekening Akun 2 / Mandiri",
    category: "Tamu & Hadiah",
    description: "Nomor rekening bank Mandiri saja tanpa nama pemilik",
    example: "1370-0012-9901",
  },
  {
    tag: "{{mandiri_name}}",
    label: "Nama Pemilik Rekening Akun 2 / Mandiri",
    category: "Tamu & Hadiah",
    description: "Nama pemilik rekening bank Mandiri",
    example: "Dimas Prasetyo",
  },
  {
    tag: "{{bank_1_name}}",
    label: "Nama Bank Rekening 1",
    category: "Tamu & Hadiah",
    description: "Nama bank / e-wallet akun pertama (cth: BCA, BRI, BNI, Mandiri)",
    example: "BCA",
  },
  {
    tag: "{{bank_1_number}}",
    label: "Nomor Rekening 1",
    category: "Tamu & Hadiah",
    description: "Nomor rekening akun pertama",
    example: "8830-1928-11",
  },
  {
    tag: "{{bank_1_holder}}",
    label: "Atas Nama Rekening 1",
    category: "Tamu & Hadiah",
    description: "Nama pemilik rekening akun pertama",
    example: "Sarah Anindita",
  },
  {
    tag: "{{bank_2_name}}",
    label: "Nama Bank Rekening 2",
    category: "Tamu & Hadiah",
    description: "Nama bank / e-wallet akun kedua (cth: Mandiri, BSI, GoPay)",
    example: "Mandiri",
  },
  {
    tag: "{{bank_2_number}}",
    label: "Nomor Rekening 2",
    category: "Tamu & Hadiah",
    description: "Nomor rekening akun kedua",
    example: "1370-0012-9901",
  },
  {
    tag: "{{bank_2_holder}}",
    label: "Atas Nama Rekening 2",
    category: "Tamu & Hadiah",
    description: "Nama pemilik rekening akun kedua",
    example: "Dimas Prasetyo",
  },
  {
    tag: "{{rsvp_deadline}}",
    label: "Batas Konfirmasi RSVP",
    category: "Tamu & Hadiah",
    description: "Batas akhir tanggal konfirmasi kehadiran tamu",
    example: "20 Agustus 2026",
  },

  // Komponen Dinamis & Galeri
  {
    tag: "{{gallery_grid}}",
    label: "Komponen Galeri Foto Lengkap",
    category: "Komponen Dinamis",
    description: "HTML otomatis berisikan grid foto galeri prewedding yang diunggah client",
    example: "<div class='gallery-grid'>...</div>",
  },
  {
    tag: "{{gallery_photo_1}}",
    label: "Foto Galeri 1",
    category: "Komponen Dinamis",
    description: "URL langsung foto prewedding pertama client",
    example: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
  },
  {
    tag: "{{gallery_photo_2}}",
    label: "Foto Galeri 2",
    category: "Komponen Dinamis",
    description: "URL langsung foto prewedding kedua client",
    example: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
  },
  {
    tag: "{{gallery_photo_3}}",
    label: "Foto Galeri 3",
    category: "Komponen Dinamis",
    description: "URL langsung foto prewedding ketiga client",
    example: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
  },
  {
    tag: "{{gallery_photo_4}}",
    label: "Foto Galeri 4",
    category: "Komponen Dinamis",
    description: "URL langsung foto prewedding keempat client",
    example: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
  },
  {
    tag: "{{gallery_json}}",
    label: "Galeri Foto JSON (Untuk Script Lightbox)",
    category: "Komponen Dinamis",
    description: "Array JSON berisi daftar URL foto galeri prewedding untuk script JavaScript",
    example: '["https://...1", "https://...2"]',
  },
  {
    tag: "{{stories_timeline}}",
    label: "Komponen Kisah Cinta",
    category: "Komponen Dinamis",
    description: "HTML otomatis berisikan timeline perjalanan cinta",
    example: "<div class='stories-timeline'>...</div>",
  },
  {
    tag: "{{countdown_widget}}",
    label: "Komponen Hitung Mundur",
    category: "Komponen Dinamis",
    description: "Komponen timer hitung mundur interaktif",
    example: "<div class='countdown'>...</div>",
  },
  {
    tag: "{{countdown_target_iso}}",
    label: "Target Hitung Mundur (ISO Timestamp)",
    category: "Komponen Dinamis",
    description: "Timestamp ISO target waktu akad/resepsi untuk script JS (cth: 2026-08-24T09:00:00.000Z)",
    example: "2026-08-24T09:00:00.000Z",
  },
  {
    tag: "{{wedding_slug}}",
    label: "Slug URL Undangan",
    category: "Komponen Dinamis",
    description: "Slug identitas undangan pernikahan untuk link & parameter (cth: dimas&sarah)",
    example: "dimas&sarah",
  },
  {
    tag: "{{api_base_url}}",
    label: "URL Endpoint REST API",
    category: "Komponen Dinamis",
    description: "Alamat base REST API backend untuk submit RSVP/Ucapan (cth: http://localhost:5000/api)",
    example: "http://localhost:5000/api",
  },
  {
    tag: "{{bank_accounts_widget}}",
    label: "Komponen Amplop Digital",
    category: "Komponen Dinamis",
    description: "Kartu rekening bank dengan tombol salin",
    example: "<div class='gift-cards'>...</div>",
  },
];

// Helper to escape HTML characters
function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generate automatic HTML grid from gallery array
export function generateGalleryHtml(gallery?: string[]): string {
  const photos = (gallery || []).filter((u) => Boolean(u && u.trim()));
  if (photos.length === 0) {
    return `
      <div style="text-align:center; padding: 40px 20px; background: rgba(255,255,255,0.6); border-radius: 16px; border: 1px dashed #d1c7b7;">
        <p style="margin:0; font-size:14px; color:#8c827a;">Galeri foto prewedding belum diunggah. Unggah melalui menu Galeri di Editor Studio.</p>
      </div>
    `.trim();
  }

  const createItem = (url: string, i: number, height: string = "260px") => `
    <div class="gallery-item cursor-pointer" onclick="if(typeof openLightbox==='function')openLightbox(this)" style="overflow:hidden; border-radius: 16px; box-shadow: 0 4px 18px rgba(0,0,0,0.06); height: ${height}; background: #eee; position:relative;">
      <img src="${escapeHtml(url)}" alt="Foto Galeri ${i + 1}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" loading="lazy" />
    </div>
  `.trim();

  // 1 Foto: Posisikan di tengah (Centered Single Showcase)
  if (photos.length === 1) {
    return `
      <div style="display:flex; justify-content:center; align-items:center; width:100%; max-width:440px; margin:0 auto;">
        <div style="width:100%;">
          ${createItem(photos[0], 0, "340px")}
        </div>
      </div>
    `.trim();
  }

  // 2 Foto: Posisikan di tengah berjejer seimbang (Centered Pair Layout - Tidak deret 2 di kiri saja)
  if (photos.length === 2) {
    return `
      <div style="display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:20px; width:100%; max-width:760px; margin:0 auto;">
        <div style="flex:1 1 280px; max-width:360px; width:100%;">
          ${createItem(photos[0], 0, "290px")}
        </div>
        <div style="flex:1 1 280px; max-width:360px; width:100%;">
          ${createItem(photos[1], 1, "290px")}
        </div>
      </div>
    `.trim();
  }

  // 3 Foto atau lebih: Responsive Grid
  const items = photos
    .map((url, i) => createItem(url, i, "260px"))
    .join("\n");

  return `
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; justify-content:center;">
      ${items}
    </div>
  `.trim();
}

// Generate automatic timeline from stories array
export function generateStoriesHtml(stories?: Array<{ year: string; title: string; description: string }>): string {
  const list = stories || [];
  if (list.length === 0) {
    return "";
  }

  const items = list
    .map(
      (story, i) => `
      <div class="story-card" style="margin-bottom: 24px; padding: 20px 24px; background: rgba(255,255,255,0.9); border-radius: 16px; border-left: 4px solid #c5a059; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
          <h4 style="margin:0; font-size:17px; font-weight:700; color:#222;">${escapeHtml(story.title)}</h4>
          <span style="font-size:12px; font-weight:700; color:#c5a059; background:rgba(197,160,89,0.15); padding: 3px 10px; border-radius: 20px;">${escapeHtml(story.year)}</span>
        </div>
        <p style="margin:0; font-size:13px; line-height:1.6; color:#666;">${escapeHtml(story.description)}</p>
      </div>
    `.trim()
    )
    .join("\n");

  return `<div class="stories-timeline">${items}</div>`;
}

// Generate copyable bank accounts widget
export function generateBankAccountsHtml(gift?: WeddingData["gift"]): string {
  const accounts: Array<{ bank: string; accountNumber: string; holderName: string }> = [];

  if (gift?.accounts && Array.isArray(gift.accounts) && gift.accounts.length > 0) {
    gift.accounts.forEach((acc) => {
      if (acc.accountNumber || acc.bank) {
        accounts.push({
          bank: acc.bank || "Rekening Bank",
          accountNumber: acc.accountNumber || "-",
          holderName: acc.holderName || acc.accountName || "Penerima Hadiah",
        });
      }
    });
  }

  // Fallback to bca / mandiri if accounts is empty
  if (accounts.length === 0) {
    const bca = gift?.bca || "8830-1928-11 a.n Sarah Anindita";
    const mandiri = gift?.mandiri || "1370-0012-9901 a.n Dimas Prasetyo";
    const bcaNum = gift?.bcaNumber || bca.split("a.n")[0].trim();
    const bcaHolder = gift?.bcaName || (bca.includes("a.n") ? bca.split("a.n")[1].trim() : "Sarah Anindita");
    const mandiriNum = gift?.mandiriNumber || mandiri.split("a.n")[0].trim();
    const mandiriHolder = gift?.mandiriName || (mandiri.includes("a.n") ? mandiri.split("a.n")[1].trim() : "Dimas Prasetyo");

    accounts.push({ bank: "Bank BCA", accountNumber: bcaNum, holderName: bcaHolder });
    accounts.push({ bank: "Bank Mandiri", accountNumber: mandiriNum, holderName: mandiriHolder });
  }

  return `
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:16px;">
      ${accounts
        .map(
          (acc) => `
      <div style="flex:1; min-width:260px; max-width:340px; background:#fff; padding:22px; border-radius:18px; border:1px solid #ebdcc5; text-align:center; box-shadow:0 6px 20px rgba(0,0,0,0.04);">
        <div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#b8860b; text-transform:uppercase; margin-bottom:6px;">${escapeHtml(acc.bank)}</div>
        <div style="font-family:monospace; font-size:19px; font-weight:700; color:#222; margin-bottom:6px;">${escapeHtml(acc.accountNumber)}</div>
        <div style="font-size:12px; color:#666; margin-bottom:14px;">a.n. ${escapeHtml(acc.holderName)}</div>
        <button onclick="navigator.clipboard.writeText('${escapeHtml(acc.accountNumber)}'); alert('Nomor rekening ${escapeHtml(acc.bank)} berhasil disalin!');" style="background:#f7edd9; color:#9c7118; border:1px solid #dfc79b; padding:7px 18px; border-radius:30px; font-size:12px; font-weight:600; cursor:pointer;">Salin Rekening</button>
      </div>`
        )
        .join("")}
    </div>
  `.trim();
}

// Helper to parse Indonesian or standard date string into an ISO date string
export function parseDateToIso(rawDate?: string): string {
  if (!rawDate || !rawDate.trim()) {
    // Default fallback to 120 days in future
    return new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString();
  }

  // 1. Direct parse attempt
  const direct = new Date(rawDate);
  if (!isNaN(direct.getTime()) && direct.getFullYear() > 2020) {
    return direct.toISOString();
  }

  // 2. Indonesian Month Regex parser (e.g. "Sabtu, 24 Agustus 2026", "24 Agustus 2026")
  const months: Record<string, string> = {
    januari: "01", jan: "01",
    februari: "02", feb: "02",
    maret: "03", mar: "03",
    april: "04", apr: "04",
    mei: "05",
    juni: "06", jun: "06",
    juli: "07", jul: "07",
    agustus: "08", agu: "08", ags: "08",
    september: "09", sep: "09",
    oktober: "10", okt: "10",
    november: "11", nov: "11",
    desember: "12", des: "12",
  };

  const match = rawDate.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (match) {
    const day = match[1].padStart(2, "0");
    const monthName = match[2].toLowerCase();
    const year = match[3];
    const monthNum = months[monthName];
    if (monthNum) {
      const parsed = new Date(`${year}-${monthNum}-${day}T09:00:00+07:00`);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
  }

  // Fallback to future date
  return new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString();
}

// Generate interactive countdown script & HTML widget
export function generateCountdownHtml(targetDate: string): string {
  const safeIso = parseDateToIso(targetDate);

  return `
    <div id="countdown-timer" style="display:flex; justify-content:center; gap:10px; margin: 24px 0;">
      <div style="background:rgba(255,255,255,0.85); backdrop-filter:blur(6px); border:1px solid rgba(197,160,89,0.3); border-radius:12px; padding:10px 14px; text-align:center; min-width:60px;">
        <span id="cd-days" style="display:block; font-size:22px; font-weight:700; color:#222;">00</span>
        <span style="font-size:10px; text-transform:uppercase; color:#888; letter-spacing:1px;">Hari</span>
      </div>
      <div style="background:rgba(255,255,255,0.85); backdrop-filter:blur(6px); border:1px solid rgba(197,160,89,0.3); border-radius:12px; padding:10px 14px; text-align:center; min-width:60px;">
        <span id="cd-hours" style="display:block; font-size:22px; font-weight:700; color:#222;">00</span>
        <span style="font-size:10px; text-transform:uppercase; color:#888; letter-spacing:1px;">Jam</span>
      </div>
      <div style="background:rgba(255,255,255,0.85); backdrop-filter:blur(6px); border:1px solid rgba(197,160,89,0.3); border-radius:12px; padding:10px 14px; text-align:center; min-width:60px;">
        <span id="cd-mins" style="display:block; font-size:22px; font-weight:700; color:#222;">00</span>
        <span style="font-size:10px; text-transform:uppercase; color:#888; letter-spacing:1px;">Menit</span>
      </div>
      <div style="background:rgba(255,255,255,0.85); backdrop-filter:blur(6px); border:1px solid rgba(197,160,89,0.3); border-radius:12px; padding:10px 14px; text-align:center; min-width:60px;">
        <span id="cd-secs" style="display:block; font-size:22px; font-weight:700; color:#222;">00</span>
        <span style="font-size:10px; text-transform:uppercase; color:#888; letter-spacing:1px;">Detik</span>
      </div>
    </div>
    <script>
      (function() {
        var target = new Date("${safeIso}").getTime();
        if (isNaN(target)) target = new Date(Date.now() + 90 * 86400000).getTime();
        function updateCd() {
          var now = new Date().getTime();
          var diff = target - now;
          if (diff <= 0) diff = 0;
          var d = Math.floor(diff / (1000 * 60 * 60 * 24));
          var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var m = Math.floor((diff % (1000 * 60)) / (1000 * 60));
          var s = Math.floor((diff % (1000 * 60)) / 1000);
          var elD = document.getElementById("cd-days");
          var elH = document.getElementById("cd-hours");
          var elM = document.getElementById("cd-mins");
          var elS = document.getElementById("cd-secs");
          if (elD) elD.textContent = d < 10 ? "0" + d : d;
          if (elH) elH.textContent = h < 10 ? "0" + h : h;
          if (elM) elM.textContent = m < 10 ? "0" + m : m;
          if (elS) elS.textContent = s < 10 ? "0" + s : s;
        }
        updateCd();
        setInterval(updateCd, 1000);
      })();
    </script>
  `.trim();
}

/**
 * Main Template Interpolator
 * Replaces all placeholders in templateHtml with data from weddingData and options.
 */
export function renderHtmlTemplate(
  templateHtml: string,
  data: WeddingData,
  options?: { guestName?: string }
): string {
  if (!templateHtml || !templateHtml.trim()) {
    return `<div style="font-family:sans-serif; text-align:center; padding:50px 20px;">Template HTML kosong. Silakan pilih atau masukkan kode template HTML di Editor Studio.</div>`;
  }

  const groomNick = data.groom.nickName || data.groom.fullName.split(",")[0].split(" ")[0] || "Dimas";
  const brideNick = data.bride.nickName || data.bride.fullName.split(",")[0].split(" ")[0] || "Sarah";
  const coupleNames = `${groomNick} & ${brideNick}`;
  const coupleFullNames = `${data.groom.fullName || groomNick} & ${data.bride.fullName || brideNick}`;

  const guest = options?.guestName || "Bapak / Ibu / Sahabat Terhormat";

  const akadMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (data.events.akad.venue || "") + " " + (data.events.akad.address || "")
  )}`;
  const resepsiMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (data.events.resepsi.venue || "") + " " + (data.events.resepsi.address || "")
  )}`;

  const defaultGalleryFallbacks = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  ];

  const rawGallery = (data.gallery || []).filter((u) => Boolean(u && u.trim()));
  const galleryList = rawGallery.length > 0 ? rawGallery : defaultGalleryFallbacks;

  const defaultCover =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuANVhaGqV68XA5DcEWcz6y9fnNioN4v5VCHS40ZDHeG8gQFJ23cZ8OjYjZVw5sX5JlDaUMqOd_y4aoLCxdGpbXbDuVPMrsfMnY4PHFRU2aiECcgvC_khC_P46fyh3_Nqhm2jb5I0MrEUCoGUdJVGhBpTBXuRWhDXvlJkO-a6lx-AVtpoLqOyI5b78K2eMFA23y5qqZPsrNZDk2ZZZR3LBppdxAJ0zLpQbm1EwMOOmE";
  const defaultBanner =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA9QvSaAxwsl9VZ_oVb2J6e2SAuKf2-hp6byA1Qw_k3_7sIYAW6lS50b69aUH_LBBD8KsFNjlcQ0xIthfCBBAmkCzfr4yma6kAqvUfQLFv99vXmB-Vpd-n5nGYsK8wUi7UTgrT-fMwMrvTHWhJ16J2eL06gtgxJsfz_REi8BgVUpEqOLSgnbmkPD7gGK696n3J3BXziepGRCzNQb7nsGQLxsf69n4xQ9dJTwhr8afU";

  const coverPhoto = data.coverPhotoUrl || defaultCover;
  const bannerPhoto = data.bannerPhotoUrl || defaultBanner;

  // Dynamic user bank & e-wallet accounts
  const rawAccounts: Array<{ bank: string; accountNumber: string; holderName: string }> =
    data.gift?.accounts && Array.isArray(data.gift.accounts) && data.gift.accounts.length > 0
      ? data.gift.accounts.map((acc, idx) => ({
          bank: acc.bank || `Bank ${idx + 1}`,
          accountNumber: acc.accountNumber || "",
          holderName: acc.holderName || acc.accountName || "Sarah Anindita",
        }))
      : [
          {
            bank: "BCA",
            accountNumber: data.gift?.bcaNumber || (data.gift?.bca ? data.gift.bca.split("a.n")[0].trim() : "8830-1928-11"),
            holderName: data.gift?.bcaName || (data.gift?.bca && data.gift.bca.includes("a.n") ? data.gift.bca.split("a.n")[1].trim() : "Sarah Anindita"),
          },
          {
            bank: "Mandiri",
            accountNumber: data.gift?.mandiriNumber || (data.gift?.mandiri ? data.gift.mandiri.split("a.n")[0].trim() : "1370-0012-9901"),
            holderName: data.gift?.mandiriName || (data.gift?.mandiri && data.gift.mandiri.includes("a.n") ? data.gift.mandiri.split("a.n")[1].trim() : "Dimas Prasetyo"),
          },
        ];

  const bcaAcc = rawAccounts.find((a) => a.bank.toUpperCase().includes("BCA")) || rawAccounts[0];
  const mandiriAcc =
    rawAccounts.find((a) => a.bank.toUpperCase().includes("MANDIRI")) ||
    (rawAccounts.length > 1 ? rawAccounts[1] : undefined);

  const replacements: Record<string, string> = {
    "{{couple_names}}": coupleNames,
    "{{couple_full_names}}": coupleFullNames,
    "{{groom_name}}": data.groom.fullName || "Dimas Prasetyo, S.T.",
    "{{groom_nickname}}": groomNick,
    "{{groom_parents}}": data.groom.parents || "Putra dari Bpk. Bambang & Ibu Sri",
    "{{groom_instagram}}": data.groom.instagram || "@dimasprasetyo",
    "{{groom_photo}}":
      data.groom.photoUrl ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    "{{bride_name}}": data.bride.fullName || "Sarah Anindita, M.Ds.",
    "{{bride_nickname}}": brideNick,
    "{{bride_parents}}": data.bride.parents || "Putri dari Bpk. Hendra & Ibu Ratna",
    "{{bride_instagram}}": data.bride.instagram || "@sarahanindita",
    "{{bride_photo}}":
      data.bride.photoUrl ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    "{{cover_photo}}": coverPhoto,
    "{{sampul_photo}}": coverPhoto,
    "{{welcome_photo}}": coverPhoto,
    "{{banner_photo}}": bannerPhoto,
    "{{cover_banner}}": bannerPhoto,
    "{{hero_image}}": bannerPhoto,
    "{{couple_banner}}": bannerPhoto,
    "{{quote_text}}":
      data.quote.text ||
      "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...",
    "{{quote_source}}": data.quote.source || "QS. Ar-Rum: 21",
    "{{akad_date}}": data.events.akad.date || "Sabtu, 24 Agustus 2026",
    "{{akad_time}}": data.events.akad.time || "08.00 - 10.00 WIB",
    "{{akad_venue}}": data.events.akad.venue || "Masjid Agung Sunda Kelapa",
    "{{akad_address}}": data.events.akad.address || "Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat",
    "{{akad_maps_url}}": akadMaps,
    "{{resepsi_date}}": data.events.resepsi.date || "Sabtu, 24 Agustus 2026",
    "{{resepsi_time}}": data.events.resepsi.time || "18.30 - 21.30 WIB",
    "{{resepsi_venue}}": data.events.resepsi.venue || "The Dharmawangsa Grand Ballroom",
    "{{resepsi_address}}": data.events.resepsi.address || "Kebayoran Baru, Jakarta Selatan",
    "{{resepsi_maps_url}}": resepsiMaps,
    "{{guest_name}}": guest,
    "{{gift_bca}}": bcaAcc ? `${bcaAcc.accountNumber} a.n ${bcaAcc.holderName}` : "8830-1928-11 a.n Sarah Anindita",
    "{{gift_mandiri}}": mandiriAcc ? `${mandiriAcc.accountNumber} a.n ${mandiriAcc.holderName}` : "1370-0012-9901 a.n Dimas Prasetyo",
    "{{bca_number}}": bcaAcc?.accountNumber || "8830-1928-11",
    "{{bca_name}}": bcaAcc?.holderName || "Sarah Anindita",
    "{{mandiri_number}}": mandiriAcc?.accountNumber || "1370-0012-9901",
    "{{mandiri_name}}": mandiriAcc?.holderName || "Dimas Prasetyo",
    // Generic Dynamic Accounts Tags (Account 1, 2, 3...)
    "{{bank_1_name}}": rawAccounts[0]?.bank || "Bank BCA",
    "{{bank_1_number}}": rawAccounts[0]?.accountNumber || "8830-1928-11",
    "{{bank_1_holder}}": rawAccounts[0]?.holderName || "Sarah Anindita",
    "{{bank_2_name}}": rawAccounts[1]?.bank || "Bank Mandiri",
    "{{bank_2_number}}": rawAccounts[1]?.accountNumber || "1370-0012-9901",
    "{{bank_2_holder}}": rawAccounts[1]?.holderName || "Dimas Prasetyo",
    "{{bank_3_name}}": rawAccounts[2]?.bank || "",
    "{{bank_3_number}}": rawAccounts[2]?.accountNumber || "",
    "{{bank_3_holder}}": rawAccounts[2]?.holderName || "",
    "{{gift_accounts_json}}": JSON.stringify(rawAccounts),
    "{{rsvp_deadline}}": data.rsvp.deadline || "20 Agustus 2026",
    "{{wedding_slug}}": data.slug || "dimas&sarah",
    "{{api_base_url}}": process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    "{{countdown_target_iso}}": parseDateToIso(data.events.akad.date),
    "{{music_title}}": data.music.title || "Romantic Wedding Melody",
    // Dynamic generated components
    "{{gallery_grid}}": generateGalleryHtml(galleryList),
    "{{gallery_photo_1}}": galleryList[0] || "",
    "{{gallery_photo_2}}": galleryList[1] || galleryList[0] || "",
    "{{gallery_photo_3}}": galleryList[2] || galleryList[0] || "",
    "{{gallery_photo_4}}": galleryList[3] || galleryList[1] || "",
    "{{gallery_photo_5}}": galleryList[4] || galleryList[2] || "",
    "{{gallery_photo_6}}": galleryList[5] || galleryList[3] || "",
    "{{gallery_photo_7}}": galleryList[6] || galleryList[0] || "",
    "{{gallery_photo_8}}": galleryList[7] || galleryList[1] || "",
    "{{gallery_json}}": JSON.stringify(galleryList),
    "{{stories_timeline}}": generateStoriesHtml(data.stories),
    "{{countdown_widget}}": generateCountdownHtml(data.events.akad.date),
    "{{bank_accounts_widget}}": generateBankAccountsHtml(data.gift),
    "{{bank_accounts_grid}}": generateBankAccountsHtml(data.gift),
  };

  let output = templateHtml;
  for (const [tag, val] of Object.entries(replacements)) {
    // Case-insensitive global replacement (so {{AKAD_DATE}}, {{akad_date}}, {{BANNER_PHOTO}} etc. are all replaced!)
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // Safety guard: If val contains HTML tags or scripts, never replace inside <script> or <style> tags
    if (val.includes("<script") || val.includes("<div") || val.includes("</script>")) {
      output = output.replace(
        /(<script[\s\S]*?<\/script>)|(<style[\s\S]*?<\/style>)|(\{\{.*?\}\})/gi,
        (match, scriptTag, styleTag, templateTag) => {
          if (scriptTag) return scriptTag;
          if (styleTag) return styleTag;
          if (templateTag && templateTag.toLowerCase() === tag.toLowerCase()) {
            return val;
          }
          return match;
        }
      );
    } else {
      output = output.replace(new RegExp(escapedTag, "gi"), () => val);
    }
  }

  // Sanitize leftover literal example tags in comments/scripts (e.g. {{tag}}, {{key}}) to prevent false hasTags trigger
  output = output.replace(/<!--[\s\S]*?-->/g, (comment) => {
    return comment.replace(/\{\{[a-zA-Z0-9_]+\}\}/g, "[placeholder]");
  });
  output = output.replace(/(\/\/[^\n]*)\{\{[a-zA-Z0-9_]+\}\}/g, "$1[placeholder]");

  // Inject server-compiled flag so embedded hydrator script does not trigger offline fallback in iframe Live View
  const serverFlagScript = `<script>window.__JANJISUCI_SERVER_COMPILED__ = true; window.__JANJISUCI_PRE_RENDERED__ = true;</script>`;
  if (output.includes("<head>")) {
    output = output.replace("<head>", `<head>\n  ${serverFlagScript}`);
  } else if (output.includes("<html")) {
    output = output.replace(/<html[^>]*>/, `$&<head>${serverFlagScript}</head>`);
  } else {
    output = `${serverFlagScript}\n${output}`;
  }

  return output;
}

// -------------------------------------------------------------
// PRESET HTML TEMPLATES
// -------------------------------------------------------------

export interface PresetHtmlTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewColor: string;
  thumbnailUrl?: string;
  coverPhotoUrl?: string;
  bannerPhotoUrl?: string;
  html: string;
}

export const PRESET_HTML_TEMPLATES: PresetHtmlTemplate[] = [
  {
    id: "royal-gold-majesty",
    name: "The Royal Gold Majesty",
    category: "Luxury",
    description: "Template aristokrat klasik bernuansa emas mewah (Royal Gold Majesty) dengan ornamen kartu modern, tipografi anggun Playfair Display & Cinzel, galeri foto terpusat yang responsif, countdown timer interaktif, formulir RSVP & doa terhubung real-time, serta kartu amplop digital.",
    previewColor: "#c5a059",
    thumbnailUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405095/janjisuci/templates/frd4v8jt6cag6suew06e.png",
    coverPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405338/janjisuci/templatescovers/pzjqcjomaehz1f72ru4g.jpg",
    bannerPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793265674/janjisuci/templatesbanners/mi3wowpithia0uimndbe.jpg",
    html: ROYAL_GOLD_MAJESTY_HTML,
  },
  {
    id: "celestial-starlight",
    name: "Celestial Starlight Union",
    category: "Modern",
    description: "Karya adiluhung bertema malam keabadian bintang (Celestial Starlight) dengan kanvas rasi bintang interaktif, hujan meteor bercahaya, alunan musik orkestra, tipografi Playfair, ornamen cincin astrolabe mewah, dan amplop digital kustom.",
    previewColor: "#0d1322",
    thumbnailUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405095/janjisuci/templates/frd4v8jt6cag6suew06e.png",
    coverPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    bannerPhotoUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80",
    html: CELESTIAL_TEMPLATE_HTML,
  },
];
