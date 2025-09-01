import mongoose, { Schema } from "mongoose";

export interface IUser {
  email: string;
  name?: string;
  passwordHash: string;
  emailVerifiedAt?: Date | null;
  orgIds: string[];
  role: "owner" | "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true, index: true },
    name: { type: String },
    passwordHash: { type: String, required: true },
    emailVerifiedAt: { type: Date, default: null },
    orgIds: { type: [String], default: [] },
    role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
