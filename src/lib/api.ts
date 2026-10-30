import { WeddingData, HtmlTemplate } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface WishPayload {
  slug?: string;
  name: string;
  attendance: "attending" | "not-attending";
  guests: number;
  message: string;
  amount?: number;
  bank?: string;
  proofUrl?: string;
}

export interface GiftPayload {
  slug?: string;
  senderName: string;
  bankTarget?: string;
  bankSender?: string;
  accountNumber?: string;
  amount: number;
  message?: string;
  proofUrl?: string;
  status?: "confirmed" | "pending";
}

export interface GuestPayload {
  name: string;
  phone?: string;
  category?: "VIP" | "Keluarga" | "Sahabat" | "Reguler";
  status?: "Hadir" | "Ragu" | "Belum Respon" | "Tidak Hadir";
  pax?: number;
  table?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  weddingSlug: string;
  role: "client" | "admin";
  createdAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  weddingSlug?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface HtmlTemplatePayload {
  slug?: string;
  name: string;
  category: string;
  description?: string;
  previewColor?: string;
  thumbnailUrl?: string;
  coverPhotoUrl?: string;
  bannerPhotoUrl?: string;
  previewAlbum?: string[];
  price?: string;
  designer?: string;
  tier?: "vip" | "gold" | "free";
  tierBadge?: string;
  html: string;
  isPreset?: boolean;
  isActive?: boolean;
}

export const api = {
  // Auth
  register: async (payload: RegisterPayload) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Pendaftaran gagal");
    return data;
  },

  login: async (payload: LoginPayload) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login gagal");
    return data;
  },

  adminLogin: async (payload: LoginPayload) => {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login admin gagal");
    return data as { success: boolean; token: string; user: UserProfile; message: string };
  },

  getMe: async (token: string) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil profil");
    return data;
  },

  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      return { status: "offline", error: err };
    }
  },

  // HTML Template Design Management (Admin & Client Catalog)
  getTemplates: async (params?: { category?: string; search?: string; all?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.all) query.set("all", "true");

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE}/templates${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data template HTML");
    return (await res.json()) as { success: boolean; count: number; data: HtmlTemplate[] };
  },

  getTemplate: async (idOrSlug: string) => {
    const res = await fetch(`${API_BASE}/templates/${encodeURIComponent(idOrSlug)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data template");
    return (await res.json()) as { success: boolean; data: HtmlTemplate };
  },

  createTemplate: async (payload: HtmlTemplatePayload, token?: string) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/templates`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal membuat template baru");
    return data as { success: boolean; data: HtmlTemplate; message: string };
  },

  updateTemplate: async (id: string, payload: Partial<HtmlTemplatePayload>, token?: string) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/templates/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal memperbarui template");
    return data as { success: boolean; data: HtmlTemplate; message: string };
  },

  deleteTemplate: async (id: string, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/templates/${id}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus template");
    return data as { success: boolean; message: string };
  },

  // Wishes & RSVP
  getWishes: async (slug?: string) => {
    const url = slug ? `${API_BASE}/wishes?slug=${encodeURIComponent(slug)}` : `${API_BASE}/wishes`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data ucapan");
    return await res.json();
  },

  createWish: async (payload: WishPayload) => {
    const res = await fetch(`${API_BASE}/wishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal mengirim ucapan");
    return await res.json();
  },

  toggleLikeWish: async (id: string) => {
    const res = await fetch(`${API_BASE}/wishes/${id}/like`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Gagal menyukai ucapan");
    return await res.json();
  },

  deleteWish: async (id: string) => {
    const res = await fetch(`${API_BASE}/wishes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus ucapan");
    return await res.json();
  },

  // Digital Envelope / Gifts
  getGifts: async (params?: { slug?: string; search?: string; status?: "confirmed" | "pending" }) => {
    const query = new URLSearchParams();
    if (params?.slug) query.set("slug", params.slug);
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE}/gifts${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data amplop digital");
    return await res.json();
  },

  createGift: async (payload: GiftPayload) => {
    const res = await fetch(`${API_BASE}/gifts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal mengirim konfirmasi tanda kasih");
    return await res.json();
  },

  updateGiftStatus: async (id: string, status: "confirmed" | "pending") => {
    const res = await fetch(`${API_BASE}/gifts/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Gagal mengubah status amplop");
    return await res.json();
  },

  deleteGift: async (id: string) => {
    const res = await fetch(`${API_BASE}/gifts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus riwayat amplop");
    return await res.json();
  },

  // Guests Book
  getGuests: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const qs = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`${API_BASE}/guests${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil daftar tamu");
    return await res.json();
  },

  getGuestStats: async () => {
    const res = await fetch(`${API_BASE}/guests/stats`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil statistik tamu");
    return await res.json();
  },

  createGuest: async (payload: GuestPayload) => {
    const res = await fetch(`${API_BASE}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal menambahkan tamu");
    return await res.json();
  },

  updateGuest: async (id: string, payload: Partial<GuestPayload>) => {
    const res = await fetch(`${API_BASE}/guests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal memperbarui data tamu");
    return await res.json();
  },

  deleteGuest: async (id: string) => {
    const res = await fetch(`${API_BASE}/guests/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus tamu");
    return await res.json();
  },

  checkInGuest: async (identifier: { qrCode?: string; id?: string }) => {
    const res = await fetch(`${API_BASE}/guests/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(identifier),
    });
    if (!res.ok) throw new Error("Gagal memproses check-in");
    return await res.json();
  },

  // Wedding Studio Data
  getWedding: async (slug: string = "dimas&sarah") => {
    const res = await fetch(`${API_BASE}/wedding/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data undangan");
    return await res.json();
  },

  updateWedding: async (
    slug: string = "dimas&sarah",
    data: Partial<WeddingData> | WeddingData | Record<string, unknown>
  ) => {
    const res = await fetch(`${API_BASE}/wedding/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal menyimpan data undangan");
    return await res.json();
  },

  // Cloudinary Storage Upload
  uploadImage: async (file: File, folder: string = "couples") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || "Gagal mengunggah foto ke Cloudinary");
    }
    return result.data as {
      url: string;
      publicId: string;
      format: string;
      bytes: number;
    };
  },

  deleteUploadedImage: async (publicId: string) => {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    return await res.json();
  },
};
