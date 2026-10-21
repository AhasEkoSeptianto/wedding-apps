# 💍 JanjiSuci Backend - Express.js & MongoDB Atlas

Backend REST API untuk platform undangan pernikahan digital **JanjiSuci**, dibangun menggunakan **Node.js**, **Express.js**, **TypeScript**, dan **MongoDB Atlas (Mongoose)**.

---

## 🚀 Fitur Utama

- **RSVP & Ucapan Tamu**: Menerima konfirmasi kehadiran tamu (Hadir / Tidak Hadir), jumlah pax, dan doa restu secara real-time.
- **Manajemen Buku Tamu (Guests)**: CRUD data tamu lengkap dengan filter kategori (`VIP`, `Keluarga`, `Sahabat`, `Reguler`), status kehadiran, dan penomoran meja.
- **QR Code Check-in Resepsi**: Endpoint kilat pemindaian QR code tamu di meja resepsi on-site dengan validasi status kedatangan ganda (anti double check-in).
- **Statistik & KPI Real-time**: Perhitungan otomatis total tamu terdaftar, rasio RSVP hadir, jumlah pax, dan status check-in meja.
- **Data Undangan & Editor Studio**: Penyimpanan profil kedua mempelai, kutipan ayat, jadwal acara akad & resepsi, musik latar, serta rekening amplop digital.

---

## 🛠️ Konfigurasi MongoDB Atlas

Buka file `server/.env`, lalu ganti `<db_password>` dengan password user database MongoDB Atlas Anda:

```env
PORT=5000
MONGODB_URI=mongodb+srv://analisamarket7_db_user:<GANTI_DENGAN_PASSWORD_ANDA>@tester.bxgpewj.mongodb.net/wedding_apps?retryWrites=true&w=majority&appName=tester
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

> [!NOTE]
> Pastikan IP Address Anda telah diizinkan (Whitelisted) pada menu **Network Access** di dashboard MongoDB Atlas (atau set ke `0.0.0.0/0` untuk akses dari mana saja).

---

## 💻 Menjalankan Server

### 1. Menjalankan dari Root Project (`wedding-apps`)
```bash
# Menjalankan backend dengan live reload (tsx)
npm run server:dev

# Menjalankan seeding data awal ke MongoDB Atlas
npm run server:seed
```

### 2. Menjalankan dari Folder `server/`
```bash
cd server
npm run dev
```

Server akan aktif di: **`http://localhost:5000`**  
Pemeriksaan status: **`http://localhost:5000/api/health`**

---

## 📚 Dokumentasi Endpoint API

### 1. Status & Health
| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status server dan waktu aktif |

### 2. RSVP & Doa Restu (`/api/wishes`)
| Method | Endpoint | Request Body | Keterangan |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wishes` | - | Mengambil semua ucapan & doa (terbaru di atas) |
| `POST` | `/api/wishes` | `{ name, attendance, guests, message }` | Mengirim RSVP & ucapan baru |
| `DELETE` | `/api/wishes/:id` | - | Menghapus ucapan tertentu |

### 3. Manajemen Buku Tamu (`/api/guests`)
| Method | Endpoint | Query / Body | Keterangan |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/guests` | `?category=VIP&search=Rahmat&status=Hadir` | Mengambil daftar tamu terfilter |
| `GET` | `/api/guests/stats` | - | Ringkasan metrik dashboard & KPI kehadiran |
| `POST` | `/api/guests` | `{ name, phone, category, status, pax, table }` | Menambahkan tamu baru (otomatis generate QR) |
| `POST` | `/api/guests/bulk` | `{ guests: [...] }` | Impor data tamu secara massal |
| `POST` | `/api/guests/check-in` | `{ qrCode: "JS-VIP-001" }` atau `{ id }` | Scan & check-in tamu di meja resepsi |
| `PUT` | `/api/guests/:id` | `{ ...dataBaru }` | Memperbarui data tamu |
| `DELETE` | `/api/guests/:id` | - | Menghapus tamu dari daftar |

### 4. Data Undangan Editor (`/api/wedding`)
| Method | Endpoint | Body | Keterangan |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wedding/:slug?` | - | Mengambil data mempelai & acara (default: `dimas-sarah`) |
| `PUT` | `/api/wedding/:slug?` | `{ groom, bride, events, quote, music, gift, rsvp }` | Menyimpan perubahan data dari Editor Studio |

