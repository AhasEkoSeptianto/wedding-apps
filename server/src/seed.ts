import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Wish } from "./models/Wish.js";
import { Guest } from "./models/Guest.js";

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
    name: "Budi & Sarah",
    attendance: "attending",
    guests: 2,
    message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Semoga menjadi keluarga sakinah mawaddah warahmah! Aamiin.",
  },
  {
    name: "Rian Prasetyo",
    attendance: "attending",
    guests: 1,
    message: "Selamat menempuh hidup baru sahabatku Dimas & Sarah! Langgeng sampai kakek nenek ya!",
  },
  {
    name: "Keluarga Besar Bpk. Gunawan",
    attendance: "attending",
    guests: 4,
    message: "Selamat atas pernikahan ananda berdua, doa terbaik dari keluarga kami di Surabaya.",
  },
  {
    name: "Lestari Dewi",
    attendance: "not-attending",
    guests: 0,
    message: "Mohon maaf belum bisa hadir langsung karena dinas luar kota. Doa tulus untuk kebahagiaan kalian berdua!",
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
    console.log("🧹 Data lama berhasil dibersihkan.");

    // Seed wishes
    await Wish.insertMany(INITIAL_WISHES);
    console.log(`✨ ${INITIAL_WISHES.length} ucapan awal berhasil dimasukkan.`);

    // Seed guests
    await Guest.insertMany(INITIAL_GUESTS);
    console.log(`✨ ${INITIAL_GUESTS.length} daftar tamu awal berhasil dimasukkan.`);

    console.log("\n🎉 Database Seeding Selesai dengan Sukses!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal melakukan seeding:", error);
    process.exit(1);
  }
}

seedData();

