import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Wish } from "./models/Wish.js";
import { Guest } from "./models/Guest.js";
import { Gift } from "./models/Gift.js";

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
    slug: "dimas-sarah",
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
    slug: "dimas-sarah",
    name: "Hendra Gunawan",
    attendance: "attending",
    guests: 1,
    message: "Selamat menempuh hidup baru sahabatku Dimas! Semoga dilancarkan acaranya nanti. Sampai jumpa di pelaminan ya bro!",
    isLiked: true,
    likesCount: 1,
    amount: 350000,
    bank: "Mandiri",
  },
  {
    slug: "dimas-sarah",
    name: "Tante Dewi Suryani & Om Bram",
    attendance: "attending",
    guests: 2,
    message: "Cantiknya Sarah dan gantengnya Dimas. Doa terbaik dari Tante dan Om sekeluarga dari Surabaya. Amin YRA.",
    isLiked: false,
    likesCount: 0,
    amount: 1000000,
    bank: "BCA",
  },
  {
    slug: "dimas-sarah",
    name: "Lestari Dewi",
    attendance: "not-attending",
    guests: 0,
    message: "Mohon maaf belum bisa hadir langsung karena dinas luar kota. Doa tulus untuk kebahagiaan kalian berdua!",
    isLiked: false,
    likesCount: 0,
  },
];

const INITIAL_GIFTS = [
  {
    slug: "dimas-sarah",
    senderName: "Bpk. Ir. Rahmat Hidayat & Istri",
    bankTarget: "BCA",
    bankSender: "BCA",
    accountNumber: "8830-1928-11",
    amount: 1500000,
    message: "Selamat menempuh hidup baru ananda Dimas & Sarah, berkah selalu ya nak.",
    status: "confirmed",
  },
  {
    slug: "dimas-sarah",
    senderName: "Clara & Jonathan",
    bankTarget: "BCA",
    bankSender: "Mandiri",
    amount: 500000,
    message: "Happy Wedding Dimas & Sarah! Wishing you endless happiness & joy.",
    status: "confirmed",
  },
  {
    slug: "dimas-sarah",
    senderName: "Alumni Teknik Mesin 2015",
    bankTarget: "Mandiri",
    bankSender: "BCA",
    amount: 2500000,
    message: "Sakinah mawaddah warahmah Dimas! Dari kawan-kawan kampus angkatan 2015.",
    status: "confirmed",
  },
  {
    slug: "dimas-sarah",
    senderName: "Dr. Siti Nurhaliza, Sp.A",
    bankTarget: "BCA",
    bankSender: "BNI",
    amount: 1000000,
    message: "Turut bersukacita dan mendoakan yang terbaik untuk keluarga baru Dimas & Sarah.",
    status: "confirmed",
  },
  {
    slug: "dimas-sarah",
    senderName: "Hendra Gunawan",
    bankTarget: "QRIS",
    bankSender: "GoPay",
    amount: 350000,
    message: "Mantap bro Dimas akhirnya sah! Sukses resepsinya!",
    status: "confirmed",
  },
  {
    slug: "dimas-sarah",
    senderName: "Rudi Hartono (Kolega Kantor)",
    bankTarget: "Mandiri",
    bankSender: "Bank Jago",
    amount: 300000,
    message: "Selamat ya Pak Dimas & Mbak Sarah, semoga lancar acaranya.",
    status: "pending",
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
    console.log("🧹 Data lama berhasil dibersihkan.");

    // Seed wishes
    await Wish.insertMany(INITIAL_WISHES);
    console.log(`✨ ${INITIAL_WISHES.length} ucapan awal berhasil dimasukkan.`);

    // Seed guests
    await Guest.insertMany(INITIAL_GUESTS);
    console.log(`✨ ${INITIAL_GUESTS.length} daftar tamu awal berhasil dimasukkan.`);

    // Seed gifts (amplop digital)
    await Gift.insertMany(INITIAL_GIFTS);
    console.log(`✨ ${INITIAL_GIFTS.length} amplop digital awal berhasil dimasukkan.`);

    console.log("\n🎉 Database Seeding Selesai dengan Sukses!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal melakukan seeding:", error);
    process.exit(1);
  }
}

seedData();
