const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface WishPayload {
  name: string;
  attendance: "attending" | "not-attending";
  guests: number;
  message: string;
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

  // Wishes & RSVP
  getWishes: async () => {
    const res = await fetch(`${API_BASE}/wishes`, { cache: "no-store" });
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

  deleteWish: async (id: string) => {
    const res = await fetch(`${API_BASE}/wishes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus ucapan");
    return await res.json();
  },

  // Guests (Buku Tamu)
  getGuests: async (params?: { category?: string; search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);

    const res = await fetch(`${API_BASE}/guests?${query.toString()}`, { cache: "no-store" });
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
  getWedding: async (slug: string = "dimas-sarah") => {
    const res = await fetch(`${API_BASE}/wedding/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal mengambil data undangan");
    return await res.json();
  },

  updateWedding: async (slug: string = "dimas-sarah", data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/wedding/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal menyimpan data undangan");
    return await res.json();
  },
};
