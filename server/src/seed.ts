import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Wish } from "./models/Wish.js";
import { Guest } from "./models/Guest.js";
import { Gift } from "./models/Gift.js";
import { User } from "./models/User.js";
import { Template } from "./models/Template.js";
import { LUXURY_TEMPLATE_HTML } from "./templates/luxuryTemplate.js";

// Fix Windows / local ISP DNS truncation on mongodb+srv SRV lookups
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if restricted
}

dotenv.config();

const INITIAL_GUESTS = [
  {
    name: "Bpk. Rahmat Hidayat & Istri",
    phone: "081234567890",
    category: "VIP",
    status: "Hadir",
    pax: 2,
    table: "Meja VIP A-1",
    qrCode: "JS-VIP-001",
    checkedIn: true,
    checkedInAt: new Date(),
  },
  {
    name: "Dr. Siti Nurhaliza, Sp.A",
    phone: "081398765432",
    category: "VIP",
    status: "Hadir",
    pax: 1,
    table: "Meja VIP A-2",
    qrCode: "JS-VIP-002",
    checkedIn: false,
  },
  {
    name: "Keluarga Besar Bpk. Suryo",
    phone: "081511223344",
    category: "Keluarga",
    status: "Hadir",
    pax: 4,
    table: "Meja Keluarga B-1",
    qrCode: "JS-FAM-001",
    checkedIn: false,
  },
  {
    name: "Andi Wijaya & Partner",
    phone: "085810203040",
    category: "Sahabat",
    status: "Hadir",
    pax: 2,
    table: "Meja C-3",
    qrCode: "JS-FRD-001",
    checkedIn: true,
    checkedInAt: new Date(),
  },
  {
    name: "Maya Anggraini",
    phone: "087799887766",
    category: "Sahabat",
    status: "Ragu",
    pax: 1,
    table: "Meja C-4",
    qrCode: "JS-FRD-002",
    checkedIn: false,
  },
  {
    name: "Doni Pratama",
    phone: "089655443322",
    category: "Reguler",
    status: "Belum Respon",
    pax: 1,
    table: "Meja D-1",
    qrCode: "JS-REG-001",
    checkedIn: false,
  },
];

const INITIAL_WISHES = [
  {
    slug: "dimas&sarah",
    name: "Clara & Jonathan",
    attendance: "attending",
    guests: 2,
    message: "Barakallahu lakum Dimas & Sarah! Semoga rumah tangganya senantiasa dipenuhi sakinah, mawaddah, dan warahmah sampai ke anak cucu!",
    isLiked: true,
    likesCount: 1,
    amount: 500000,
    bank: "BCA",
  },
  {
    slug: "dimas&sarah",
    name: "Hendra Gunawan",
    attendance: "attending",
    guests: 1,
    message: "Selamat menempuh hidup baru sahabatku Dimas! Semoga dilancarkan acaranya nanti. Sampai jumpa di pelaminan ya bro!",
    isLiked: true,
    likesCount: 1,
    amount: 350000,
    bank: "QRIS",
  },
  {
    slug: "dimas&sarah",
    name: "Bpk. Rahmat Hidayat",
    attendance: "attending",
    guests: 2,
    message: "Selamat untuk kedua mempelai dan keluarga besar. Semoga menjadi keluarga teladan yang diberkahi oleh Tuhan Yang Maha Esa.",
    isLiked: false,
    likesCount: 0,
    amount: 1500000,
    bank: "BCA",
  },
  {
    slug: "dimas&sarah",
    name: "Maya Anggraini",
    attendance: "not-attending",
    guests: 1,
    message: "Mohon maaf Dimas & Sarah belum bisa hadir secara langsung karena sedang bertugas di luar kota. Doa terbaik untuk kalian berdua!",
    isLiked: false,
    likesCount: 0,
    amount: 250000,
    bank: "Mandiri",
  },
];

const INITIAL_GIFTS = [
  {
    slug: "dimas&sarah",
    senderName: "Bpk. Rahmat Hidayat & Istri",
    bankTarget: "BCA",
    bankSender: "BCA",
    accountNumber: "8830192811",
    amount: 1500000,
    message: "Doa terbaik untuk kedua mempelai dari keluarga besar Bpk. Rahmat Hidayat.",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    status: "confirmed",
  },
  {
    slug: "dimas&sarah",
    senderName: "Clara & Jonathan",
    bankTarget: "BCA",
    bankSender: "BCA",
    amount: 500000,
    message: "Selamat berbahagia ya Dimas & Sarah!",
    status: "confirmed",
  },
  {
    slug: "dimas&sarah",
    senderName: "Alumni Teknik Informatika 2015",
    bankTarget: "Mandiri",
    bankSender: "BCA",
    amount: 2500000,
    message: "Sakinah mawaddah warahmah Dimas! Dari kawan-kawan kampus angkatan 2015.",
    status: "confirmed",
  },
  {
    slug: "dimas&sarah",
    senderName: "Dr. Siti Nurhaliza, Sp.A",
    bankTarget: "BCA",
    bankSender: "BNI",
    amount: 1000000,
    message: "Turut bersukacita dan mendoakan yang terbaik untuk keluarga baru Dimas & Sarah.",
    status: "confirmed",
  },
  {
    slug: "dimas&sarah",
    senderName: "Hendra Gunawan",
    bankTarget: "QRIS",
    bankSender: "GoPay",
    amount: 350000,
    message: "Mantap bro Dimas akhirnya sah! Sukses resepsinya!",
    status: "confirmed",
  },
  {
    slug: "dimas&sarah",
    senderName: "Rudi Hartono (Kolega Kantor)",
    bankTarget: "Mandiri",
    bankSender: "Bank Jago",
    amount: 300000,
    message: "Selamat ya Pak Dimas & Mbak Sarah, semoga lancar acaranya.",
    status: "pending",
  },
];

const INITIAL_TEMPLATES = [
  {
    slug: "luxury",
    name: "Luxury",
    category: "Luxury",
    description: "Template aristokrat klasik bernuansa emas mewah (Royal Gold Majesty) dengan ornamen kartu modern, tipografi anggun Playfair Display & Cinzel, galeri foto terpusat yang responsif, countdown timer interaktif, formulir RSVP & doa terhubung real-time, serta kartu amplop digital.",
    previewColor: "#c5a059",
    thumbnailUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405095/janjisuci/templates/frd4v8jt6cag6suew06e.png",
    coverPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405338/janjisuci/templatescovers/pzjqcjomaehz1f72ru4g.jpg",
    bannerPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793265674/janjisuci/templatesbanners/mi3wowpithia0uimndbe.jpg",
    previewAlbum: [
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793404963/janjisuci/templates/xujfu3qdryvi527ug0vf.png",
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793404969/janjisuci/templates/awn2tlbifguobzqwdvpv.png",
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405073/janjisuci/templates/xsj2e7qsdacl5qbq7v3c.png",
    ],
    price: "Rp 149.000",
    designer: "Atelier JanjiSuci",
    tier: "gold",
    tierBadge: "Desain Pilihan",
    isPreset: true,
    isActive: true,
    html: LUXURY_TEMPLATE_HTML,
  },
  {
    slug: "royal-gold-majesty",
    name: "The Royal Gold Majesty",
    category: "Luxury",
    description: "Template aristokrat klasik bernuansa emas mewah dengan ornamen kartu modern, tipografi anggun, dan integrasi RSVP.",
    previewColor: "#c5a059",
    thumbnailUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405095/janjisuci/templates/frd4v8jt6cag6suew06e.png",
    coverPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405338/janjisuci/templatescovers/pzjqcjomaehz1f72ru4g.jpg",
    bannerPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793265674/janjisuci/templatesbanners/mi3wowpithia0uimndbe.jpg",
    previewAlbum: [
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793404963/janjisuci/templates/xujfu3qdryvi527ug0vf.png",
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793404969/janjisuci/templates/awn2tlbifguobzqwdvpv.png",
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405073/janjisuci/templates/xsj2e7qsdacl5qbq7v3c.png",
    ],
    price: "Rp 149.000",
    designer: "Atelier JanjiSuci",
    tier: "gold",
    tierBadge: "Desain Pilihan",
    isPreset: true,
    isActive: true,
    html: LUXURY_TEMPLATE_HTML,
  },
  {
    slug: "botanical-sage-romance",
    name: "Botanical Sage Romance",
    category: "Floral",
    description: "Template bernuansa dedaunan hijau sage yang segar, elegan, dan estetik dengan sentuhan watercolor.",
    previewColor: "#3d6b52",
    thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    previewAlbum: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=1200&q=80",
    ],
    price: "Rp 149.000",
    designer: "Narra Studio",
    tier: "gold",
    tierBadge: "Terlaris",
    isPreset: true,
    isActive: true,
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wedding of {{couple_names}}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f4f7f4; color: #1e2a22; line-height: 1.6; }
    .container { max-width: 650px; margin: 0 auto; padding: 20px; }
    .hero { text-align: center; padding: 70px 20px; background: #ffffff; border-radius: 30px; border: 1px solid #dce5dc; box-shadow: 0 10px 30px rgba(61,107,82,0.06); margin-bottom: 24px; }
    .hero-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #3d6b52; font-weight: 600; }
    .hero-h1 { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #1e2a22; margin: 12px 0; }
    .section-card { background: #ffffff; border-radius: 24px; padding: 30px 24px; border: 1px solid #dce5dc; margin-bottom: 24px; text-align: center; }
    .section-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1e2a22; margin-bottom: 12px; }
    .btn-green { display: inline-block; background: #3d6b52; color: #fff; padding: 10px 24px; border-radius: 30px; text-decoration: none; font-size: 13px; font-weight: 600; margin-top: 14px; }
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
      <blockquote style="font-family:'Playfair Display', serif; font-size:17px; font-style:italic; color:#3d6b52; margin-bottom:10px;">"{{quote_text}}"</blockquote>
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
    slug: "vogue-noir-editorial",
    name: "Vogue Noir Editorial",
    category: "Modern",
    description: "Template monokrom modern bergaya editorial majalah mode dunia dengan tipografi tegas dan elegan.",
    previewColor: "#18181b",
    thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    previewAlbum: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
    ],
    price: "Gratis",
    designer: "Studio Linimasa",
    tier: "free",
    tierBadge: "Gratis",
    isPreset: true,
    isActive: true,
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{couple_names}} | Editorial Wedding</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background-color: #0c0d0e; color: #ededed; line-height: 1.7; }
    .container { max-width: 660px; margin: 0 auto; padding: 24px 20px; }
    .font-title { font-family: 'Cinzel', serif; letter-spacing: 2px; }
    .hero { text-align: center; padding: 80px 20px; border: 1px solid #282a2d; border-radius: 20px; background: #131518; margin-bottom: 24px; }
    .hero-h1 { font-size: 38px; color: #fff; margin: 16px 0; font-weight: 700; }
    .card { background: #131518; border: 1px solid #282a2d; border-radius: 20px; padding: 34px 24px; margin-bottom: 24px; text-align: center; }
    .btn-noir { display: inline-block; background: #ffffff; color: #000000; padding: 10px 26px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 14px; }
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

async function seedData() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<db_password>")) {
    console.error("❌ MONGODB_URI belum dikonfigurasi dengan password asli di server/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Terhubung ke MongoDB Atlas...");

    // Clear existing
    await Wish.deleteMany({});
    await Guest.deleteMany({});
    await Gift.deleteMany({});
    await Template.deleteMany({});
    console.log("🧹 Data wishes, guests, gifts, dan templates lama berhasil dibersihkan.");

    // Seed wishes
    await Wish.insertMany(INITIAL_WISHES);
    console.log(`✨ ${INITIAL_WISHES.length} ucapan awal berhasil dimasukkan.`);

    // Seed guests
    await Guest.insertMany(INITIAL_GUESTS);
    console.log(`✨ ${INITIAL_GUESTS.length} daftar tamu awal berhasil dimasukkan.`);

    // Seed gifts (amplop digital)
    await Gift.insertMany(INITIAL_GIFTS);
    console.log(`✨ ${INITIAL_GIFTS.length} amplop digital awal berhasil dimasukkan.`);

    // Seed HTML templates
    await Template.insertMany(INITIAL_TEMPLATES);
    console.log(`🎨 ${INITIAL_TEMPLATES.length} template HTML awal berhasil dimasukkan ke katalog.`);

    // Seed or Ensure Admin User exists
    const existingAdmin = await User.findOne({ email: "admin@janjisuci.com" });
    if (!existingAdmin) {
      await User.create({
        name: "Admin JanjiSuci (Staf)",
        email: "admin@janjisuci.com",
        password: "admin123456",
        phone: "081299998888",
        role: "admin",
        weddingSlug: "admin",
      });
      console.log("👑 Akun Administrator 'admin@janjisuci.com' berhasil dibuat.");
    } else {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("👑 Akun Administrator 'admin@janjisuci.com' sudah ada dan terverifikasi sebagai admin.");
    }

    console.log("\n🎉 Database Seeding Selesai dengan Sukses!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal melakukan seeding:", error);
    process.exit(1);
  }
}

seedData();
