import mongoose, { Schema } from "mongoose";

export interface ISession {
  userId: string;
  refreshToken: string;
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: String, index: true, required: true },
    refreshToken: { type: String, unique: true, required: true },
    userAgent: { type: String },
    ip: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
