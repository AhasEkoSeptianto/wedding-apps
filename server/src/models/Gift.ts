import mongoose, { Schema, Document } from "mongoose";

export interface IGift extends Document {
  slug: string;
  senderName: string;
  bankTarget: string;
  bankSender: string;
  accountNumber?: string;
  amount: number;
  message?: string;
  proofUrl?: string;
  status: "confirmed" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema = new Schema<IGift>(
  {
    slug: {
      type: String,
      default: "dimas-sarah",
      index: true,
      trim: true,
    },
    senderName: {
      type: String,
      required: [true, "Nama pengirim amplop wajib diisi"],
      trim: true,
    },
    bankTarget: {
      type: String,
      default: "BCA",
      trim: true,
    },
    bankSender: {
      type: String,
      default: "",
      trim: true,
    },
    accountNumber: {
      type: String,
      default: "",
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Nominal amplop wajib diisi"],
      min: [1000, "Nominal amplop minimal Rp 1.000"],
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    proofUrl: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending"],
      default: "confirmed",
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

export const Gift = mongoose.model<IGift>("Gift", GiftSchema);

