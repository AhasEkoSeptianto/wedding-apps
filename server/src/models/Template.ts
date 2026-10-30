import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  slug: string;
  name: string;
  category: string;
  description: string;
  previewColor: string;
  thumbnailUrl?: string;
  coverPhotoUrl?: string;
  bannerPhotoUrl?: string;
  previewAlbum?: string[];
  price?: string;
  designer?: string;
  tier?: "vip" | "gold" | "free";
  tierBadge?: string;
  html: string;
  isPreset: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    slug: {
      type: String,
      required: [true, "Slug template wajib diisi"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Nama template wajib diisi"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Kategori template wajib diisi"],
      trim: true,
      default: "Umum",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    previewColor: {
      type: String,
      trim: true,
      default: "#b38742",
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },
    coverPhotoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    bannerPhotoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    previewAlbum: {
      type: [String],
      default: [],
    },
    price: {
      type: String,
      trim: true,
      default: "Rp 149.000",
    },
    designer: {
      type: String,
      trim: true,
      default: "Atelier JanjiSuci",
    },
    tier: {
      type: String,
      enum: ["vip", "gold", "free"],
      default: "gold",
    },
    tierBadge: {
      type: String,
      trim: true,
      default: "Desain Pilihan",
    },
    html: {
      type: String,
      required: [true, "Kode HTML template wajib diisi"],
    },
    isPreset: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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
      },
    },
  }
);

export const Template = mongoose.model<ITemplate>("Template", TemplateSchema);
