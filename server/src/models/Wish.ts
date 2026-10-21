import mongoose, { Schema, Document } from "mongoose";

export interface IWish extends Document {
  name: string;
  attendance: "attending" | "not-attending";
  guests: number;
  message: string;
  createdAt: Date;
}

const WishSchema = new Schema<IWish>(
  {
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

