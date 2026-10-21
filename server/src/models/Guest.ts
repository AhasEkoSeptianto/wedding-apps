import mongoose, { Schema, Document } from "mongoose";

export interface IGuest extends Document {
  name: string;
  phone: string;
  category: "VIP" | "Keluarga" | "Sahabat" | "Reguler";
  status: "Hadir" | "Ragu" | "Belum Respon" | "Tidak Hadir";
  pax: number;
  table: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    name: {
      type: String,
      required: [true, "Nama tamu wajib diisi"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["VIP", "Keluarga", "Sahabat", "Reguler"],
      default: "Reguler",
    },
    status: {
      type: String,
      enum: ["Hadir", "Ragu", "Belum Respon", "Tidak Hadir"],
      default: "Belum Respon",
    },
    pax: {
      type: Number,
      default: 1,
      min: 0,
    },
    table: {
      type: String,
      default: "Meja Reguler",
      trim: true,
    },
    qrCode: {
      type: String,
      unique: true,
      index: true,
      default: () => `JS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
      default: null,
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

export const Guest = mongoose.model<IGuest>("Guest", GuestSchema);

