import mongoose, { Schema, Document } from "mongoose";

export interface IWish extends Document {
  slug: string;
  name: string;
  attendance: "attending" | "not-attending";
  guests: number;
  message: string;
  isLiked: boolean;
  likesCount: number;
  amount?: number;
  bank?: string;
  proofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WishSchema = new Schema<IWish>(
  {
    slug: {
      type: String,
      default: "dimas-sarah",
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Nama tamu wajib diisi"],
      trim: true,
    },
    attendance: {
      type: String,
      enum: ["attending", "not-attending"],
      default: "attending",
      required: true,
    },
    guests: {
      type: Number,
      default: 1,
      min: [0, "Jumlah tamu minimal 0"],
      max: [10, "Jumlah tamu maksimal 10"],
    },
    message: {
      type: String,
      required: [true, "Ucapan / doa wajib diisi"],
      trim: true,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    bank: {
      type: String,
      default: "",
      trim: true,
    },
    proofUrl: {
      type: String,
      default: "",
      trim: true,
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

export const Wish = mongoose.model<IWish>("Wish", WishSchema);
