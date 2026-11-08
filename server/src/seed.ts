import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Wish } from "./models/Wish.js";
import { Guest } from "./models/Guest.js";
import { Gift } from "./models/Gift.js";
import { User } from "./models/User.js";
import { Template } from "./models/Template.js";
import { Wedding } from "./models/Wedding.js";
import { LUXURY_TEMPLATE_HTML } from "./templates/luxuryTemplate.js";
import { CELESTIAL_TEMPLATE_HTML } from "./templates/celestialTemplate.js";

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
    slug: "royal-gold-majesty",
    name: "The Royal Gold Majesty",
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
    slug: "celestial-starlight",
    name: "Celestial Starlight Union",
    category: "Modern",
    description: "Karya adiluhung bertema malam keabadian bintang (Celestial Starlight) dengan kanvas rasi bintang interaktif, hujan meteor bercahaya, alunan musik orkestra, tipografi Playfair, ornamen cincin astrolabe mewah, dan amplop digital kustom.",
    previewColor: "#0d1322",
    thumbnailUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405095/janjisuci/templates/frd4v8jt6cag6suew06e.png",
    coverPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405338/janjisuci/templatescovers/pzjqcjomaehz1f72ru4g.jpg",
    bannerPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793265674/janjisuci/templatesbanners/mi3wowpithia0uimndbe.jpg",
    previewAlbum: [
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793404963/janjisuci/templates/xujfu3qdryvi527ug0vf.png",
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793404969/janjisuci/templates/awn2tlbifguobzqwdvpv.png",
      "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405073/janjisuci/templates/xsj2e7qsdacl5qbq7v3c.png",
    ],
    price: "Rp 169.000",
    designer: "Atelier JanjiSuci",
    tier: "gold",
    tierBadge: "Desain Pilihan",
    isPreset: true,
    isActive: true,
    html: CELESTIAL_TEMPLATE_HTML,
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
    // Seed or Ensure default Wedding dimas-sarah exists with rich stories & separated bank accounts
    await Wedding.findOneAndUpdate(
      { $or: [{ slug: "dimas&sarah" }, { slug: "dimas-sarah" }] },
      {
        slug: "dimas-sarah",
        title: "Pernikahan Dimas & Sarah",
        themeId: "celestial-starlight",
        designMode: "custom_html",
        customHtml: CELESTIAL_TEMPLATE_HTML,
        coverPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405338/janjisuci/templatescovers/pzjqcjomaehz1f72ru4g.jpg",
        bannerPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793265674/janjisuci/templatesbanners/mi3wowpithia0uimndbe.jpg",
        groom: {
          fullName: "Dimas Prasetyo, S.T.",
          nickName: "Dimas",
          parents: "Putra pertama dari Bpk. Bambang Wijaya & Ibu Sri Rahayu",
          instagram: "dimasprasetyo",
          photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzUNvfN4JLmIEQ8Rl3ucmVP0-vib8bkuQ3IrTgVw8Qr5sjfCuCXP250Cgz911BcC7k2OJebkbkFG2QdPC2uPmB9JgO20ArGDvpU0gAuSbhYSI7-kXcn2tgNddrrMRwpjYWGzsz64YzuTcetJcaEqJJ6OK2uZbQ6mVajqzRW3u95-6UPI5E7g3WEY75DGTcZ_y5UEu_eA0ZcLAS5JKHy7r9_Lyg0m4Oqoi--PgbPYl8YDo-L0m9KgRLNQ",
        },
        bride: {
          fullName: "Sarah Anindita, M.Ds.",
          nickName: "Sarah",
          parents: "Putri kedua dari Bpk. Ir. Hendra Kusuma & Ibu Ratna Dewi",
          instagram: "sarahanindita",
          photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBqrJptRouC3sJfNXLjsofBuvakru1TeBprYoHukqDAMi6numwD_tbCIUj8gAmdv2RmqFwBb_l5JMoEvVo44VGvNdl3sKNhmAfevpxliVOYaJJWD_eKIOO0CiuiYkvBWAHCLhcxazK406U-fFG7DULwuD1nG7PYvz4ukXGopUFGbgkuinU9wNO5xAusEewWYWkgBN7NjgntxgHQ2Bn3UJ17VOD7tjWOJ3NnqU0qcG7XHbVUgy4mfmLmQ",
        },
        events: {
          akad: {
            date: "Sabtu, 24 Agustus 2026",
            time: "08.00 - 10.00 WIB",
            venue: "Masjid Agung Sunda Kelapa",
            address: "Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat",
          },
          resepsi: {
            date: "Sabtu, 24 Agustus 2026",
            time: "18.30 - 21.30 WIB",
            venue: "The Dharmawangsa Grand Ballroom",
            address: "Kebayoran Baru, Jakarta Selatan",
          },
        },
        gift: {
          accounts: [
            {
              id: "acc_1",
              bank: "BCA",
              accountNumber: "8830-1928-11",
              holderName: "Sarah Anindita",
              accountName: "Sarah Anindita",
            },
            {
              id: "acc_2",
              bank: "Mandiri",
              accountNumber: "1370-0012-9901",
              holderName: "Dimas Prasetyo",
              accountName: "Dimas Prasetyo",
            },
          ],
          bca: "8830-1928-11 a.n Sarah Anindita",
          bcaNumber: "8830-1928-11",
          bcaName: "Sarah Anindita",
          mandiri: "1370-0012-9901 a.n Dimas Prasetyo",
          mandiriNumber: "1370-0012-9901",
          mandiriName: "Dimas Prasetyo",
        },
        stories: [
          {
            year: "2021",
            title: "Pandangan Pertama",
            description: "Pertemuan tidak disengaja di sebuah simfoni orkestra malam kota, di mana alunan melodi menyatukan pandangan pertama yang tak terlupakan.",
          },
          {
            year: "2023",
            title: "Menjalin Komitmen",
            description: "Setelah saling mengenal dan berbagi impian, kami sepakat melangkah bersama dalam ikatan cinta yang penuh kedewasaan dan saling mendukung.",
          },
          {
            year: "2024",
            title: "Lamaran di Bawah Bintang",
            description: "Di hadapan panorama alam Labuan Bajo saat senja merona, sebuah cincin tersemat sebagai ikrar suci untuk mengarungi bahtera kehidupan bersama.",
          },
        ],
        rsvp: {
          deadline: "2026-08-20",
          maxGuests: "2",
          waNotification: true,
        },
      },
      { upsert: true, new: true }
    );
    await Wedding.findOneAndUpdate(
      { slug: "dimas&sarah" },
      {
        slug: "dimas&sarah",
        title: "Pernikahan Dimas & Sarah",
        themeId: "celestial-starlight",
        designMode: "custom_html",
        customHtml: CELESTIAL_TEMPLATE_HTML,
        coverPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793405338/janjisuci/templatescovers/pzjqcjomaehz1f72ru4g.jpg",
        bannerPhotoUrl: "https://res.cloudinary.com/bc8tk53v/image/upload/v1793265674/janjisuci/templatesbanners/mi3wowpithia0uimndbe.jpg",
        groom: {
          fullName: "Dimas Prasetyo, S.T.",
          nickName: "Dimas",
          parents: "Putra pertama dari Bpk. Bambang Wijaya & Ibu Sri Rahayu",
          instagram: "dimasprasetyo",
          photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzUNvfN4JLmIEQ8Rl3ucmVP0-vib8bkuQ3IrTgVw8Qr5sjfCuCXP250Cgz911BcC7k2OJebkbkFG2QdPC2uPmB9JgO20ArGDvpU0gAuSbhYSI7-kXcn2tgNddrrMRwpjYWGzsz64YzuTcetJcaEqJJ6OK2uZbQ6mVajqzRW3u95-6UPI5E7g3WEY75DGTcZ_y5UEu_eA0ZcLAS5JKHy7r9_Lyg0m4Oqoi--PgbPYl8YDo-L0m9KgRLNQ",
        },
        bride: {
          fullName: "Sarah Anindita, M.Ds.",
          nickName: "Sarah",
          parents: "Putri kedua dari Bpk. Ir. Hendra Kusuma & Ibu Ratna Dewi",
          instagram: "sarahanindita",
          photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBqrJptRouC3sJfNXLjsofBuvakru1TeBprYoHukqDAMi6numwD_tbCIUj8gAmdv2RmqFwBb_l5JMoEvVo44VGvNdl3sKNhmAfevpxliVOYaJJWD_eKIOO0CiuiYkvBWAHCLhcxazK406U-fFG7DULwuD1nG7PYvz4ukXGopUFGbgkuinU9wNO5xAusEewWYWkgBN7NjgntxgHQ2Bn3UJ17VOD7tjWOJ3NnqU0qcG7XHbVUgy4mfmLmQ",
        },
        events: {
          akad: {
            date: "Sabtu, 24 Agustus 2026",
            time: "08.00 - 10.00 WIB",
            venue: "Masjid Agung Sunda Kelapa",
            address: "Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat",
          },
          resepsi: {
            date: "Sabtu, 24 Agustus 2026",
            time: "18.30 - 21.30 WIB",
            venue: "The Dharmawangsa Grand Ballroom",
            address: "Kebayoran Baru, Jakarta Selatan",
          },
        },
        gift: {
          accounts: [
            {
              id: "acc_1",
              bank: "BCA",
              accountNumber: "8830-1928-11",
              holderName: "Sarah Anindita",
              accountName: "Sarah Anindita",
            },
            {
              id: "acc_2",
              bank: "Mandiri",
              accountNumber: "1370-0012-9901",
              holderName: "Dimas Prasetyo",
              accountName: "Dimas Prasetyo",
            },
          ],
          bca: "8830-1928-11 a.n Sarah Anindita",
          bcaNumber: "8830-1928-11",
          bcaName: "Sarah Anindita",
          mandiri: "1370-0012-9901 a.n Dimas Prasetyo",
          mandiriNumber: "1370-0012-9901",
          mandiriName: "Dimas Prasetyo",
        },
        stories: [
          {
            year: "2021",
            title: "Pandangan Pertama",
            description: "Pertemuan tidak disengaja di sebuah simfoni orkestra malam kota, di mana alunan melodi menyatukan pandangan pertama yang tak terlupakan.",
          },
          {
            year: "2023",
            title: "Menjalin Komitmen",
            description: "Setelah saling mengenal dan berbagi impian, kami sepakat melangkah bersama dalam ikatan cinta yang penuh kedewasaan dan saling mendukung.",
          },
          {
            year: "2024",
            title: "Lamaran di Bawah Bintang",
            description: "Di hadapan panorama alam Labuan Bajo saat senja merona, sebuah cincin tersemat sebagai ikrar suci untuk mengarungi bahtera kehidupan bersama.",
          },
        ],
        rsvp: {
          deadline: "2026-08-20",
          maxGuests: "2",
          waNotification: true,
        },
      },
      { upsert: true, new: true }
    );
    console.log("💍 Data default wedding 'dimas-sarah' dan 'dimas&sarah' dengan 3 babak kisah cinta & rekening terpisah berhasil diperbarui.");

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
