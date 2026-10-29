import { WeddingData } from "@/types";

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
    label: "Rekening BCA",
    category: "Tamu & Hadiah",
    description: "Nomor rekening bank BCA untuk amplop digital",
    example: "8830-1928-11 a.n Sarah Anindita",
  },
  {
    tag: "{{gift_mandiri}}",
    label: "Rekening Mandiri",
    category: "Tamu & Hadiah",
    description: "Nomor rekening bank Mandiri",
    example: "1370-0012-9901 a.n Dimas Prasetyo",
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

  const items = photos
    .map(
      (url, i) => `
      <div class="gallery-item" style="overflow:hidden; border-radius: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); height: 260px; background: #eee;">
        <img src="${escapeHtml(url)}" alt="Foto Galeri ${i + 1}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" loading="lazy" />
      </div>
    `.trim()
    )
    .join("\n");

  return `
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
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
export function generateBankAccountsHtml(gift?: { bca: string; mandiri: string }): string {
  const bca = gift?.bca || "8830-1928-11 a.n Sarah Anindita";
  const mandiri = gift?.mandiri || "1370-0012-9901 a.n Dimas Prasetyo";

  return `
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:16px;">
      <div style="flex:1; min-width:260px; max-width:340px; background:#fff; padding:22px; border-radius:18px; border:1px solid #ebdcc5; text-align:center; box-shadow:0 6px 20px rgba(0,0,0,0.04);">
        <div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#b8860b; text-transform:uppercase; margin-bottom:6px;">Bank BCA</div>
        <div style="font-family:monospace; font-size:19px; font-weight:700; color:#222; margin-bottom:6px;">${escapeHtml(bca.split("a.n")[0].trim())}</div>
        <div style="font-size:12px; color:#666; margin-bottom:14px;">${escapeHtml(bca.includes("a.n") ? "a.n " + bca.split("a.n")[1].trim() : "a.n Sarah Anindita")}</div>
        <button onclick="navigator.clipboard.writeText('${escapeHtml(bca.split("a.n")[0].trim())}'); alert('Nomor rekening BCA berhasil disalin!');" style="background:#f7edd9; color:#9c7118; border:1px solid #dfc79b; padding:7px 18px; border-radius:30px; font-size:12px; font-weight:600; cursor:pointer;">Salin Rekening</button>
      </div>
      <div style="flex:1; min-width:260px; max-width:340px; background:#fff; padding:22px; border-radius:18px; border:1px solid #ebdcc5; text-align:center; box-shadow:0 6px 20px rgba(0,0,0,0.04);">
        <div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#b8860b; text-transform:uppercase; margin-bottom:6px;">Bank Mandiri</div>
        <div style="font-family:monospace; font-size:19px; font-weight:700; color:#222; margin-bottom:6px;">${escapeHtml(mandiri.split("a.n")[0].trim())}</div>
        <div style="font-size:12px; color:#666; margin-bottom:14px;">${escapeHtml(mandiri.includes("a.n") ? "a.n " + mandiri.split("a.n")[1].trim() : "a.n Dimas Prasetyo")}</div>
        <button onclick="navigator.clipboard.writeText('${escapeHtml(mandiri.split("a.n")[0].trim())}'); alert('Nomor rekening Mandiri berhasil disalin!');" style="background:#f7edd9; color:#9c7118; border:1px solid #dfc79b; padding:7px 18px; border-radius:30px; font-size:12px; font-weight:600; cursor:pointer;">Salin Rekening</button>
      </div>
    </div>
  `.trim();
}

// Generate interactive countdown script & HTML widget
export function generateCountdownHtml(targetDate: string): string {
  const safeDate = targetDate || "2026-10-24";

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
        var target = new Date("${safeDate}").getTime();
        if (isNaN(target)) target = new Date("2026-10-24T09:00:00").getTime();
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
    "{{gift_bca}}": data.gift.bca || "8830-1928-11 a.n Sarah Anindita",
    "{{gift_mandiri}}": data.gift.mandiri || "1370-0012-9901 a.n Dimas Prasetyo",
    "{{rsvp_deadline}}": data.rsvp.deadline || "20 Agustus 2026",
    "{{wedding_slug}}": data.slug || "dimas-sarah",
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
  };

  let output = templateHtml;
  for (const [tag, val] of Object.entries(replacements)) {
    // Replace all occurrences of tag globally
    output = output.split(tag).join(val);
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
  html: string;
}

export const PRESET_HTML_TEMPLATES: PresetHtmlTemplate[] = [
  {
    id: "royal-gold-majesty",
    name: "The Royal Gold Majesty",
    category: "Luxury",
    description: "Template aristokrat klasik dengan garis emas mewah, tipografi anggun, dan ornamen kartu pernikahan modern.",
    previewColor: "#c5a059",
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Wedding of {{couple_names}}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Montserrat', sans-serif;
      background-color: #faf7f2;
      color: #2b2622;
      line-height: 1.6;
    }
    .font-serif { font-family: 'Cormorant Garamond', serif; }
    .gold-accent { color: #c5a059; }
    .gold-border { border-color: #ebdcc5; }
    
    .container {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px 20px;
    }
    
    /* Cover Screen */
    .hero-section {
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 20px;
      background: radial-gradient(circle at center, #ffffff 0%, #faf5ec 100%);
      border-radius: 28px;
      border: 1px solid #eadbca;
      box-shadow: 0 10px 40px rgba(197,160,89,0.08);
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
    }
    .hero-section::before {
      content: "";
      position: absolute;
      top: 15px; left: 15px; right: 15px; bottom: 15px;
      border: 1px solid rgba(197,160,89,0.3);
      border-radius: 20px;
      pointer-events: none;
    }
    .hero-tag {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 4px;
      color: #c5a059;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .hero-title {
      font-size: 46px;
      font-weight: 700;
      color: #1a1512;
      line-height: 1.1;
      margin-bottom: 14px;
    }
    .guest-pill {
      background: rgba(255,255,255,0.9);
      border: 1px solid #e8dac5;
      padding: 14px 24px;
      border-radius: 18px;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    /* Section Card */
    .card {
      background: #ffffff;
      border-radius: 22px;
      border: 1px solid #ebdcc5;
      padding: 36px 26px;
      margin-bottom: 26px;
      box-shadow: 0 6px 25px rgba(0,0,0,0.03);
      text-align: center;
    }
    .card-title {
      font-size: 28px;
      font-weight: 700;
      color: #1a1512;
      margin-bottom: 6px;
    }
    .card-divider {
      color: #c5a059;
      font-size: 20px;
      margin-bottom: 18px;
    }

    /* Couple Photos */
    .couple-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 20px;
    }
    @media(min-width: 520px) {
      .couple-grid { flex-direction: row; }
    }
    .person-card {
      flex: 1;
      background: #fdfbf7;
      border: 1px solid #ebdcc5;
      border-radius: 18px;
      padding: 22px;
      text-align: center;
    }
    .person-img {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 14px;
      border: 4px solid #fff;
      box-shadow: 0 6px 18px rgba(197,160,89,0.2);
    }

    /* Event Cards */
    .event-box {
      background: #faf6ef;
      border: 1px solid #ebdcc5;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;
      text-align: center;
    }
    .event-btn {
      display: inline-block;
      margin-top: 14px;
      background: #c5a059;
      color: #fff;
      text-decoration: none;
      padding: 9px 22px;
      border-radius: 24px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 3px 10px rgba(197,160,89,0.3);
      transition: opacity 0.2s;
    }
    .event-btn:hover { opacity: 0.9; }

    footer {
      text-align: center;
      padding: 40px 20px;
      color: #8c827a;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Hero / Cover -->
    <header class="hero-section">
      <span class="hero-tag">The Wedding Celebration</span>
      <h1 class="hero-title font-serif">{{couple_names}}</h1>
      <p class="font-serif" style="font-size: 19px; color: #7a6e65; font-style: italic;">
        Mengundang Anda untuk menjadi saksi ikatan suci kami
      </p>

      <div class="guest-pill">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8c827a; display: block; margin-bottom: 4px;">Kepada Yth.</span>
        <h3 class="font-serif" style="font-size: 22px; font-weight: 700; color: #1a1512;">{{guest_name}}</h3>
      </div>

      <!-- Countdown Timer Widget -->
      {{countdown_widget}}
    </header>

    <!-- Holy Quote -->
    <section class="card">
      <div class="card-divider">❖</div>
      <blockquote class="font-serif" style="font-size: 18px; font-style: italic; color: #40362f; max-width: 520px; margin: 0 auto 12px; line-height: 1.7;">
        "{{quote_text}}"
      </blockquote>
      <span style="font-size: 12px; font-weight: 600; color: #c5a059; letter-spacing: 1px;">{{quote_source}}</span>
    </section>

    <!-- Couple Presentation -->
    <section class="card">
      <span class="hero-tag">Mempelai yang Berbahagia</span>
      <h2 class="card-title font-serif">Bride &amp; Groom</h2>
      <div class="card-divider">❖</div>

      <div class="couple-grid">
        <div class="person-card">
          <img src="{{groom_photo}}" alt="{{groom_name}}" class="person-img" />
          <h3 class="font-serif" style="font-size: 20px; font-weight: 700; color:#1a1512;">{{groom_name}}</h3>
          <p style="font-size: 12px; color: #7a6e65; margin: 6px 0;">{{groom_parents}}</p>
          <a href="https://instagram.com/{{groom_instagram}}" target="_blank" style="font-size: 11px; color:#c5a059; font-weight:600; text-decoration:none;">{{groom_instagram}}</a>
        </div>
        <div class="person-card">
          <img src="{{bride_photo}}" alt="{{bride_name}}" class="person-img" />
          <h3 class="font-serif" style="font-size: 20px; font-weight: 700; color:#1a1512;">{{bride_name}}</h3>
          <p style="font-size: 12px; color: #7a6e65; margin: 6px 0;">{{bride_parents}}</p>
          <a href="https://instagram.com/{{bride_instagram}}" target="_blank" style="font-size: 11px; color:#c5a059; font-weight:600; text-decoration:none;">{{bride_instagram}}</a>
        </div>
      </div>
    </section>

    <!-- Love Story Timeline -->
    <section class="card">
      <span class="hero-tag">Our Journey</span>
      <h2 class="card-title font-serif">Kisah Cinta Kami</h2>
      <div class="card-divider">❖</div>
      {{stories_timeline}}
    </section>

    <!-- Event Schedule -->
    <section class="card">
      <span class="hero-tag">Save The Date</span>
      <h2 class="card-title font-serif">Waktu &amp; Tempat</h2>
      <div class="card-divider">❖</div>

      <!-- Akad -->
      <div class="event-box">
        <span style="font-size: 12px; font-weight: 700; color: #c5a059; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">Akad Nikah</span>
        <h4 class="font-serif" style="font-size: 22px; font-weight: 700;">{{akad_date}}</h4>
        <p style="font-size: 14px; color: #7a6e65; font-weight: 600; margin: 4px 0 8px;">Pukul: {{akad_time}}</p>
        <p style="font-size: 14px; font-weight: 700; color: #1a1512;">{{akad_venue}}</p>
        <p style="font-size: 12px; color: #7a6e65;">{{akad_address}}</p>
        <a href="{{akad_maps_url}}" target="_blank" class="event-btn">Buka Petunjuk Arah Google Maps</a>
      </div>

      <!-- Resepsi -->
      <div class="event-box">
        <span style="font-size: 12px; font-weight: 700; color: #c5a059; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">Resepsi Pernikahan</span>
        <h4 class="font-serif" style="font-size: 22px; font-weight: 700;">{{resepsi_date}}</h4>
        <p style="font-size: 14px; color: #7a6e65; font-weight: 600; margin: 4px 0 8px;">Pukul: {{resepsi_time}}</p>
        <p style="font-size: 14px; font-weight: 700; color: #1a1512;">{{resepsi_venue}}</p>
        <p style="font-size: 12px; color: #7a6e65;">{{resepsi_address}}</p>
        <a href="{{resepsi_maps_url}}" target="_blank" class="event-btn">Buka Petunjuk Arah Google Maps</a>
      </div>
    </section>

    <!-- Photo Gallery -->
    <section class="card">
      <span class="hero-tag">Moments in Lens</span>
      <h2 class="card-title font-serif">Galeri Prewedding</h2>
      <div class="card-divider">❖</div>
      {{gallery_grid}}
    </section>

    <!-- Digital Gift / Amplop Digital -->
    <section class="card">
      <span class="hero-tag">Tanda Kasih</span>
      <h2 class="card-title font-serif">Wedding Gift</h2>
      <div class="card-divider">❖</div>
      <p style="font-size: 13px; color: #7a6e65; max-width: 480px; margin: 0 auto 20px;">
        Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang ingin memberikan tanda kasih secara cashless:
      </p>
      {{bank_accounts_widget}}
    </section>

    <!-- Footer -->
    <footer>
      <h3 class="font-serif" style="font-size: 24px; color: #c5a059; margin-bottom: 6px;">{{couple_names}}</h3>
      <p>Terima kasih atas doa dan restu Anda pada hari bahagia kami.</p>
    </footer>
  </div>
</body>
</html>`,
  },

  {
    id: "botanical-sage-romance",
    name: "Botanical Sage Romance",
    category: "Floral",
    description: "Template bernuansa dedaunan hijau sage yang segar, elegan, dan estetik dengan sentuhan watercolor.",
    previewColor: "#3d6b52",
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wedding of {{couple_names}}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #f4f7f4;
      color: #1e2a22;
      line-height: 1.6;
    }
    .container { max-width: 650px; margin: 0 auto; padding: 20px; }
    .hero {
      text-align: center;
      padding: 70px 20px;
      background: #ffffff;
      border-radius: 30px;
      border: 1px solid #dce5dc;
      box-shadow: 0 10px 30px rgba(61,107,82,0.06);
      margin-bottom: 24px;
    }
    .hero-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #3d6b52; font-weight: 600; }
    .hero-h1 { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #1e2a22; margin: 12px 0; }
    .section-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 30px 24px;
      border: 1px solid #dce5dc;
      margin-bottom: 24px;
      text-align: center;
    }
    .section-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1e2a22; margin-bottom: 12px; }
    .btn-green {
      display: inline-block;
      background: #3d6b52;
      color: #fff;
      padding: 10px 24px;
      border-radius: 30px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      margin-top: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <span class="hero-tag">The Wedding Celebration</span>
      <h1 class="hero-h1">{{couple_names}}</h1>
      <p style="color: #607267; font-size: 15px;">Kami mengundang Anda pada hari istimewa kami</p>
      
      <div style="background:#f4f7f4; border:1px solid #dce5dc; border-radius:16px; padding:12px 20px; display:inline-block; margin:20px 0;">
        <span style="font-size:11px; text-transform:uppercase; color:#607267; letter-spacing:1px; display:block;">Untuk Tamu Kami:</span>
        <strong style="font-size:18px; color:#1e2a22;">{{guest_name}}</strong>
      </div>

      {{countdown_widget}}
    </div>

    <div class="section-card">
      <blockquote style="font-family:'Playfair Display', serif; font-size:17px; font-style:italic; color:#3d6b52; margin-bottom:10px;">
        "{{quote_text}}"
      </blockquote>
      <span style="font-size:12px; font-weight:600; color:#607267;">{{quote_source}}</span>
    </div>

    <div class="section-card">
      <h2 class="section-title">Kedua Mempelai</h2>
      <div style="display:flex; flex-wrap:wrap; gap:16px; justify-content:center; margin-top:20px;">
        <div style="flex:1; min-width:240px; background:#f9fbf9; padding:20px; border-radius:18px; border:1px solid #e1ebe1;">
          <img src="{{groom_photo}}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:10px; border:3px solid #3d6b52;" />
          <h3 style="font-family:'Playfair Display', serif; font-size:18px; font-weight:700;">{{groom_name}}</h3>
          <p style="font-size:12px; color:#607267; margin-top:4px;">{{groom_parents}}</p>
        </div>
        <div style="flex:1; min-width:240px; background:#f9fbf9; padding:20px; border-radius:18px; border:1px solid #e1ebe1;">
          <img src="{{bride_photo}}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:10px; border:3px solid #3d6b52;" />
          <h3 style="font-family:'Playfair Display', serif; font-size:18px; font-weight:700;">{{bride_name}}</h3>
          <p style="font-size:12px; color:#607267; margin-top:4px;">{{bride_parents}}</p>
        </div>
      </div>
    </div>

    <div class="section-card">
      <h2 class="section-title">Waktu &amp; Tempat</h2>
      <div style="background:#f4f7f4; padding:20px; border-radius:16px; margin-bottom:14px;">
        <h4 style="font-size:17px; font-weight:700; color:#3d6b52;">Akad Nikah: {{akad_date}}</h4>
        <p style="font-size:13px; color:#4a5f52; margin:4px 0;">Pukul: {{akad_time}}</p>
        <p style="font-size:14px; font-weight:600;">{{akad_venue}}</p>
        <p style="font-size:12px; color:#607267;">{{akad_address}}</p>
        <a href="{{akad_maps_url}}" target="_blank" class="btn-green">Google Maps</a>
      </div>
      <div style="background:#f4f7f4; padding:20px; border-radius:16px;">
        <h4 style="font-size:17px; font-weight:700; color:#3d6b52;">Resepsi: {{resepsi_date}}</h4>
        <p style="font-size:13px; color:#4a5f52; margin:4px 0;">Pukul: {{resepsi_time}}</p>
        <p style="font-size:14px; font-weight:600;">{{resepsi_venue}}</p>
        <p style="font-size:12px; color:#607267;">{{resepsi_address}}</p>
        <a href="{{resepsi_maps_url}}" target="_blank" class="btn-green">Google Maps</a>
      </div>
    </div>

    <div class="section-card">
      <h2 class="section-title">Galeri Kebahagiaan</h2>
      {{gallery_grid}}
    </div>

    <div class="section-card">
      <h2 class="section-title">Tanda Kasih (Wedding Gift)</h2>
      {{bank_accounts_widget}}
    </div>

    <footer style="text-align:center; padding:30px 10px; font-size:12px; color:#8fa382;">
      {{couple_names}} • Salam Hangat &amp; Terima Kasih
    </footer>
  </div>
</body>
</html>`,
  },

  {
    id: "vogue-noir-editorial",
    name: "Vogue Noir Editorial",
    category: "Modern & Minimalis",
    description: "Template monokrom modern bergaya editorial majalah mode dunia dengan tipografi tegas dan elegan.",
    previewColor: "#18181b",
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{couple_names}} | Editorial Wedding</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0c0d0e;
      color: #ededed;
      line-height: 1.7;
    }
    .container { max-width: 660px; margin: 0 auto; padding: 24px 20px; }
    .font-title { font-family: 'Cinzel', serif; letter-spacing: 2px; }
    .hero {
      text-align: center;
      padding: 80px 20px;
      border: 1px solid #282a2d;
      border-radius: 20px;
      background: #131518;
      margin-bottom: 24px;
    }
    .hero-h1 { font-size: 38px; color: #fff; margin: 16px 0; font-weight: 700; }
    .card {
      background: #131518;
      border: 1px solid #282a2d;
      border-radius: 20px;
      padding: 34px 24px;
      margin-bottom: 24px;
      text-align: center;
    }
    .btn-noir {
      display: inline-block;
      background: #ffffff;
      color: #000000;
      padding: 10px 26px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <span style="font-size:11px; text-transform:uppercase; letter-spacing:4px; color:#888;">The Union of</span>
      <h1 class="hero-h1 font-title">{{couple_names}}</h1>
      <p style="color:#aaa; font-size:13px; letter-spacing:2px; text-transform:uppercase;">Save The Date: {{akad_date}}</p>

      <div style="margin:24px 0; border:1px solid #333; padding:12px 20px; display:inline-block; border-radius:8px;">
        <span style="font-size:10px; color:#777; text-transform:uppercase; display:block; letter-spacing:2px;">Special Invitation For:</span>
        <strong style="font-size:16px; color:#fff;">{{guest_name}}</strong>
      </div>

      {{countdown_widget}}
    </div>

    <div class="card">
      <p style="font-style:italic; font-size:15px; color:#ccc; max-width:480px; margin:0 auto 12px;">"{{quote_text}}"</p>
      <span style="font-size:11px; color:#888; letter-spacing:1px; text-transform:uppercase;">{{quote_source}}</span>
    </div>

    <div class="card">
      <h2 class="font-title" style="font-size:22px; margin-bottom:20px;">The Couple</h2>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div style="border-bottom:1px solid #282a2d; padding-bottom:16px;">
          <h3 style="font-size:18px; color:#fff;">{{groom_name}}</h3>
          <p style="font-size:12px; color:#888;">{{groom_parents}}</p>
        </div>
        <div>
          <h3 style="font-size:18px; color:#fff;">{{bride_name}}</h3>
          <p style="font-size:12px; color:#888;">{{bride_parents}}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="font-title" style="font-size:22px; margin-bottom:16px;">Celebration Schedule</h2>
      <div style="margin-bottom:20px; padding:16px; background:#181a1f; border-radius:10px;">
        <h4 style="color:#fff; font-size:16px;">AKAD NIKAH</h4>
        <p style="color:#aaa; font-size:13px;">{{akad_date}} • {{akad_time}}</p>
        <p style="color:#fff; font-size:14px; font-weight:600; margin-top:6px;">{{akad_venue}}</p>
        <p style="color:#777; font-size:12px;">{{akad_address}}</p>
        <a href="{{akad_maps_url}}" target="_blank" class="btn-noir">View Map</a>
      </div>
      <div style="padding:16px; background:#181a1f; border-radius:10px;">
        <h4 style="color:#fff; font-size:16px;">RESEPSI</h4>
        <p style="color:#aaa; font-size:13px;">{{resepsi_date}} • {{resepsi_time}}</p>
        <p style="color:#fff; font-size:14px; font-weight:600; margin-top:6px;">{{resepsi_venue}}</p>
        <p style="color:#777; font-size:12px;">{{resepsi_address}}</p>
        <a href="{{resepsi_maps_url}}" target="_blank" class="btn-noir">View Map</a>
      </div>
    </div>

    <div class="card">
      <h2 class="font-title" style="font-size:22px; margin-bottom:16px;">Visual Gallery</h2>
      {{gallery_grid}}
    </div>

    <div class="card">
      <h2 class="font-title" style="font-size:22px; margin-bottom:12px;">Digital Registry</h2>
      {{bank_accounts_widget}}
    </div>

    <footer style="text-align:center; padding:30px 10px; font-size:11px; color:#555; letter-spacing:2px; text-transform:uppercase;">
      {{couple_names}} • Created with JanjiSuci
    </footer>
  </div>
</body>
</html>`,
  },
];

