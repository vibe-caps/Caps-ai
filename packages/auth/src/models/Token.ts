import mongoose, { Schema } from "mongoose";

export interface IToken {
  userId: string;
  type: "verify" | "reset";
  token: string;
  expiresAt: Date;
  createdAt: Date;
  usedAt?: Date | null;
}

const TokenSchema = new Schema<IToken>(
  {
    userId: { type: String, index: true, required: true },
    type: { type: String, enum: ["verify", "reset"], required: true },
    token: { type: String, unique: true, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Token = mongoose.models.Token || mongoose.model<IToken>("Token", TokenSchema);
