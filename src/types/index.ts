export interface Wish {
  id: string;
  slug?: string;
  name: string;
  attendance: 'attending' | 'not-attending';
  guests: number;
  message: string;
  isLiked?: boolean;
  likesCount?: number;
  amount?: number;
  bank?: string;
  proofUrl?: string;
  createdAt: string;
}

export interface GiftItem {
  id: string;
  slug?: string;
  senderName: string;
  bankTarget: string;
  bankSender: string;
  accountNumber?: string;
  amount: number;
  message?: string;
  proofUrl?: string;
  status: "confirmed" | "pending";
  createdAt: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  holderName: string;
}

export interface StoryItem {
  id?: string;
  year: string;
  title: string;
  description: string;
}

export interface GuestItem {
  id: string;
  name: string;
  phone: string;
  category: "VIP" | "Keluarga" | "Sahabat" | "Reguler";
  status: "Hadir" | "Ragu" | "Belum Respon" | "Tidak Hadir";
  pax: number;
  table: string;
  qrCode?: string;
  checkedIn?: boolean;
  checkedInAt?: string | null;
  createdAt?: string;
}

export interface HtmlTemplate {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  previewColor: string;
  thumbnailUrl?: string;
  previewAlbum?: string[];
  price?: string;
  designer?: string;
  tier?: "vip" | "gold" | "free";
  tierBadge?: string;
  html: string;
  isPreset?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeddingData {
  title: string;
  slug?: string;
  themeId?: string;
  designMode?: "standard" | "custom_html";
  customHtml?: string;
  groom: {
    fullName: string;
    nickName: string;
    instagram: string;
    parents: string;
    photoUrl: string;
  };
  bride: {
    fullName: string;
    nickName: string;
    instagram: string;
    parents: string;
    photoUrl: string;
  };
  quote: {
    source: string;
    text: string;
  };
  events: {
    akad: {
      date: string;
      time: string;
      venue: string;
      address: string;
    };
    resepsi: {
      date: string;
      time: string;
      venue: string;
      address: string;
    };
  };
  music: {
    title: string;
    duration: string;
    enabled: boolean;
  };
  gift: {
    bca: string;
    mandiri: string;
  };
  gallery?: string[];
  stories?: StoryItem[];
  rsvp: {
    deadline: string;
    maxGuests: string;
    waNotification: boolean;
  };
}
