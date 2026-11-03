import mongoose, { Schema, Document } from "mongoose";

export interface IBankAccount {
  id?: string;
  bank: string;
  accountNumber: string;
  holderName: string;
  accountName?: string;
  qrCode?: string;
}

export interface IWedding extends Document {
  slug: string;
  title: string;
  themeId?: string;
  designMode?: "standard" | "custom_html";
  customHtml?: string;
  coverPhotoUrl?: string;
  bannerPhotoUrl?: string;
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
    accounts?: IBankAccount[];
    bca?: string;
    bcaNumber?: string;
    bcaName?: string;
    mandiri?: string;
    mandiriNumber?: string;
    mandiriName?: string;
    address?: string;
    qrCode?: string;
  };
  gallery?: string[];
  stories?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  rsvp: {
    deadline: string;
    maxGuests: string;
    waNotification: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WeddingSchema = new Schema<IWedding>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: "dimas&sarah",
    },
    title: {
      type: String,
      default: "Pernikahan Dimas & Sarah",
    },
    themeId: {
      type: String,
      default: "royal-bloom",
    },
    designMode: {
      type: String,
      enum: ["standard", "custom_html"],
      default: "standard",
    },
    customHtml: {
      type: String,
      default: "",
    },
    coverPhotoUrl: {
      type: String,
      default: "",
    },
    bannerPhotoUrl: {
      type: String,
      default: "",
    },
    groom: {
      fullName: { type: String, default: "" },
      nickName: { type: String, default: "" },
      instagram: { type: String, default: "" },
      parents: { type: String, default: "" },
      photoUrl: { type: String, default: "" },
    },
    bride: {
      fullName: { type: String, default: "" },
      nickName: { type: String, default: "" },
      instagram: { type: String, default: "" },
      parents: { type: String, default: "" },
      photoUrl: { type: String, default: "" },
    },
    quote: {
      source: { type: String, default: "QS. Ar-Rum: 21" },
      text: { type: String, default: "" },
    },
    events: {
      akad: {
        date: { type: String, default: "" },
        time: { type: String, default: "" },
        venue: { type: String, default: "" },
        address: { type: String, default: "" },
      },
      resepsi: {
        date: { type: String, default: "" },
        time: { type: String, default: "" },
        venue: { type: String, default: "" },
        address: { type: String, default: "" },
      },
    },
    music: {
      title: { type: String, default: "Kahitna - Soulmate (Instrumental Acoustic)" },
      duration: { type: String, default: "03:42" },
      enabled: { type: Boolean, default: true },
    },
    gift: {
      accounts: [
        {
          id: { type: String, default: "" },
          bank: { type: String, default: "BCA" },
          accountNumber: { type: String, default: "" },
          holderName: { type: String, default: "" },
          accountName: { type: String, default: "" },
          qrCode: { type: String, default: "" },
        },
      ],
      bca: { type: String, default: "" },
      bcaNumber: { type: String, default: "" },
      bcaName: { type: String, default: "" },
      mandiri: { type: String, default: "" },
      mandiriNumber: { type: String, default: "" },
      mandiriName: { type: String, default: "" },
      address: { type: String, default: "" },
      qrCode: { type: String, default: "" },
    },
    gallery: { type: [String], default: [] },
    stories: [
      {
        year: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    rsvp: {
      deadline: { type: String, default: "2026-10-20" },
      maxGuests: { type: String, default: "2" },
      waNotification: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Wedding = mongoose.model<IWedding>("Wedding", WeddingSchema);
