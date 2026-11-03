import { Request, Response, NextFunction } from "express";
import { Wedding } from "../models/Wedding.js";
import { Template } from "../models/Template.js";

const DEFAULT_SLUG = "dimas&sarah";
const LEGACY_DEFAULT_SLUG = "dimas-sarah";

// Default seed data matching EditorStudio
const INITIAL_WEDDING_DATA = {
  slug: DEFAULT_SLUG,
  title: "Pernikahan Dimas & Sarah",
  themeId: "royal-bloom",
  designMode: "standard",
  customHtml: "",
  coverPhotoUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuANVhaGqV68XA5DcEWcz6y9fnNioN4v5VCHS40ZDHeG8gQFJ23cZ8OjYjZVw5sX5JlDaUMqOd_y4aoLCxdGpbXbDuVPMrsfMnY4PHFRU2aiECcgvC_khC_P46fyh3_Nqhm2jb5I0MrEUCoGUdJVGhBpTBXuRWhDXvlJkO-a6lx-AVtpoLqOyI5b78K2eMFA23y5qqZPsrNZDk2ZZZR3LBppdxAJ0zLpQbm1EwMOOmE",
  bannerPhotoUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA9QvSaAxwsl9VZ_oVb2J6e2SAuKf2-hp6byA1Qw_k3_7sIYAW6lS50b69aUH_LBBD8KsFNjlcQ0xIthfCBBAmkCzfr4yma6kAqvUfQLFv99vXmB-Vpd-n5nGYsK8wUi7UTgrT-fMwMrvTHWhJ16J2eL06gtgxJsfz_REi8BgVUpEqOLSgnbmkPD7gGK696n3J3BXziepGRCzNQb7nsGQLxsf69n4xQ9dJTwhr8afU",
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
      date: "Sabtu, 24 Agustus 2025",
      time: "08.00 - 10.00 WIB",
      venue: "Masjid Agung Sunda Kelapa, Menteng",
      address:
        "Jl. Taman Sunda Kelapa No.16, Menteng, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta",
    },
    resepsi: {
      date: "Sabtu, 24 Agustus 2025",
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
    accounts: [
      {
        id: "acc_1",
        bank: "BCA",
        accountNumber: "8830-1928-11",
        accountName: "Sarah Anindita",
        holderName: "Sarah Anindita",
      },
      {
        id: "acc_2",
        bank: "Mandiri",
        accountNumber: "1370-0012-9901",
        accountName: "Dimas Prasetyo",
        holderName: "Dimas Prasetyo",
      },
    ],
    bca: "8830-1928-11 a.n Sarah Anindita",
    bcaNumber: "8830-1928-11",
    bcaName: "Sarah Anindita",
    mandiri: "1370-0012-9901 a.n Dimas Prasetyo",
    mandiriNumber: "1370-0012-9901",
    mandiriName: "Dimas Prasetyo",
  },
  gallery: [],
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
    deadline: "2025-08-15",
    maxGuests: "2",
    waNotification: true,
  },
};

// GET /api/wedding/:slug
export async function getWedding(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawSlug = req.params.slug || DEFAULT_SLUG;
    const slug = decodeURIComponent(rawSlug).trim();
    const altSlug = slug.includes("&") ? slug.replace(/&/g, "-") : slug.replace(/-/g, "&");

    let wedding = await Wedding.findOne({
      $or: [{ slug }, { slug: altSlug }],
    });

    // Auto-create default if not exists
    if (!wedding && (slug === DEFAULT_SLUG || slug === LEGACY_DEFAULT_SLUG || altSlug === DEFAULT_SLUG || slug === "demo")) {
      wedding = await Wedding.create(INITIAL_WEDDING_DATA);
    }

    if (!wedding) {
      // Check if this slug matches an HTML Template (allowing /slug to serve template demo directly!)
      const matchedTemplate = await Template.findOne({
        $or: [{ slug }, { slug: altSlug }],
      });

      if (matchedTemplate) {
        res.json({
          success: true,
          data: {
            ...INITIAL_WEDDING_DATA,
            slug: matchedTemplate.slug,
            themeId: matchedTemplate.slug,
            designMode: "custom_html",
            customHtml: matchedTemplate.html,
            coverPhotoUrl: matchedTemplate.coverPhotoUrl || INITIAL_WEDDING_DATA.coverPhotoUrl,
            bannerPhotoUrl: matchedTemplate.bannerPhotoUrl || INITIAL_WEDDING_DATA.bannerPhotoUrl,
          },
        });
        return;
      }

      res.status(404).json({
        success: false,
        message: "Data undangan pernikahan tidak ditemukan.",
      });
      return;
    }

    // Convert to plain object to ensure separated gift fields & accounts exist
    const weddingObj = (wedding && typeof wedding.toObject === "function") ? wedding.toObject() : { ...wedding };
    let gift = weddingObj.gift || {};
    let accounts: any[] = Array.isArray(gift.accounts) ? [...gift.accounts] : [];

    // Auto-generate accounts if not present
    if (accounts.length === 0) {
      if (gift.bcaNumber || gift.bca) {
        const num = gift.bcaNumber || (gift.bca ? gift.bca.split("a.n")[0].trim() : "");
        const holder = gift.bcaName || (gift.bca && gift.bca.includes("a.n") ? gift.bca.split("a.n")[1].trim() : "Sarah Anindita");
        accounts.push({
          id: "acc_1",
          bank: "BCA",
          accountNumber: num,
          accountName: holder,
          holderName: holder,
        });
      }
      if (gift.mandiriNumber || gift.mandiri) {
        const num = gift.mandiriNumber || (gift.mandiri ? gift.mandiri.split("a.n")[0].trim() : "");
        const holder = gift.mandiriName || (gift.mandiri && gift.mandiri.includes("a.n") ? gift.mandiri.split("a.n")[1].trim() : "Dimas Prasetyo");
        accounts.push({
          id: "acc_2",
          bank: "Mandiri",
          accountNumber: num,
          accountName: holder,
          holderName: holder,
        });
      }
    }

    // Normalize accounts
    accounts = accounts.map((acc: any, idx: number) => ({
      id: acc.id || `acc_${idx + 1}`,
      bank: acc.bank || "BCA",
      accountNumber: acc.accountNumber || "",
      accountName: acc.accountName || acc.holderName || "",
      holderName: acc.holderName || acc.accountName || "",
      qrCode: acc.qrCode || "",
    }));

    // Find best match for legacy BCA and Mandiri
    const bcaAcc = accounts.find((a: any) => String(a.bank).toUpperCase().includes("BCA")) || accounts[0];
    const mandiriAcc = accounts.find((a: any) => String(a.bank).toUpperCase().includes("MANDIRI")) || (accounts.length > 1 ? accounts[1] : undefined);

    const bcaNum = bcaAcc ? bcaAcc.accountNumber : (gift.bcaNumber || "");
    const bcaHolder = bcaAcc ? (bcaAcc.accountName || bcaAcc.holderName) : (gift.bcaName || "");
    const mandiriNum = mandiriAcc ? mandiriAcc.accountNumber : (gift.mandiriNumber || "");
    const mandiriHolder = mandiriAcc ? (mandiriAcc.accountName || mandiriAcc.holderName) : (gift.mandiriName || "");

    weddingObj.gift = {
      ...gift,
      accounts,
      bca: bcaHolder ? `${bcaNum} a.n ${bcaHolder}` : bcaNum,
      bcaNumber: bcaNum,
      bcaName: bcaHolder,
      mandiri: mandiriHolder ? `${mandiriNum} a.n ${mandiriHolder}` : mandiriNum,
      mandiriNumber: mandiriNum,
      mandiriName: mandiriHolder,
    };

    res.json({
      success: true,
      data: weddingObj,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/wedding/:slug
export async function upsertWedding(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawSlug = req.params.slug || DEFAULT_SLUG;
    const slug = decodeURIComponent(rawSlug).trim();
    const altSlug = slug.includes("&") ? slug.replace(/&/g, "-") : slug.replace(/-/g, "&");
    const updateData = { ...req.body };

    // Auto-sync dynamic accounts & structured gift fields
    if (updateData.gift) {
      const g = { ...updateData.gift };
      let accounts: any[] = Array.isArray(g.accounts) ? [...g.accounts] : [];

      if (accounts.length > 0) {
        accounts = accounts.map((acc: any, idx: number) => ({
          id: acc.id || `acc_${idx + 1}`,
          bank: (acc.bank || "BCA").trim(),
          accountNumber: (acc.accountNumber || "").trim(),
          accountName: (acc.accountName || acc.holderName || "").trim(),
          holderName: (acc.holderName || acc.accountName || "").trim(),
          qrCode: acc.qrCode || "",
        }));

        const bcaAcc = accounts.find((a: any) => String(a.bank).toUpperCase().includes("BCA")) || accounts[0];
        const mandiriAcc = accounts.find((a: any) => String(a.bank).toUpperCase().includes("MANDIRI")) || (accounts.length > 1 ? accounts[1] : undefined);

        if (bcaAcc) {
          g.bcaNumber = bcaAcc.accountNumber;
          g.bcaName = bcaAcc.accountName || bcaAcc.holderName;
          g.bca = g.bcaName ? `${g.bcaNumber} a.n ${g.bcaName}` : g.bcaNumber;
        }
        if (mandiriAcc) {
          g.mandiriNumber = mandiriAcc.accountNumber;
          g.mandiriName = mandiriAcc.accountName || mandiriAcc.holderName;
          g.mandiri = g.mandiriName ? `${g.mandiriNumber} a.n ${g.mandiriName}` : g.mandiriNumber;
        }
        g.accounts = accounts;
      } else if (g.bcaNumber !== undefined || g.bcaName !== undefined || g.mandiriNumber !== undefined || g.mandiriName !== undefined) {
        // Build accounts from separate fields
        accounts = [];
        if (g.bcaNumber || g.bcaName) {
          accounts.push({
            id: "acc_1",
            bank: "BCA",
            accountNumber: (g.bcaNumber || "").trim(),
            accountName: (g.bcaName || "").trim(),
            holderName: (g.bcaName || "").trim(),
          });
        }
        if (g.mandiriNumber || g.mandiriName) {
          accounts.push({
            id: "acc_2",
            bank: "Mandiri",
            accountNumber: (g.mandiriNumber || "").trim(),
            accountName: (g.mandiriName || "").trim(),
            holderName: (g.mandiriName || "").trim(),
          });
        }
        g.accounts = accounts;
        g.bca = g.bcaName ? `${g.bcaNumber} a.n ${g.bcaName}` : (g.bcaNumber || "");
        g.mandiri = g.mandiriName ? `${g.mandiriNumber} a.n ${g.mandiriName}` : (g.mandiriNumber || "");
      }
      updateData.gift = g;
    }

    const targetSlug = updateData.slug ? decodeURIComponent(String(updateData.slug)).trim() : slug;

    const wedding = await Wedding.findOneAndUpdate(
      { $or: [{ slug }, { slug: altSlug }] },
      { ...updateData, slug: targetSlug },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Data undangan berhasil disimpan ke database!",
      data: wedding,
    });
  } catch (error) {
    next(error);
  }
}

