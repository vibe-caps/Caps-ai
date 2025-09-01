import { z } from "zod";
import argon2 from "argon2";
import { nanoid } from "nanoid";
import { User } from "./models/User";
import { Session } from "./models/Session";
import { Token } from "./models/Token";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function register(input: z.infer<typeof RegisterSchema>) {
  if (process.env.MONGO_AUTH_DISABLED === "true") {
    throw new Error("Mongo auth disabled; use Clerk adapter in web app.");
  }
  const exists = await User.findOne({ email: input.email });
  if (exists) throw new Error("Email already registered");
  const passwordHash = await argon2.hash(input.password);
  const user = await User.create({ email: input.email, name: input.name, passwordHash });
  const token = await Token.create({
    userId: String(user._id),
    type: "verify",
    token: nanoid(32),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
  return { user, verifyToken: token.token };
}

export async function login(input: z.infer<typeof LoginSchema>, meta?: { userAgent?: string; ip?: string }) {
  if (process.env.MONGO_AUTH_DISABLED === "true") {
    throw new Error("Mongo auth disabled; use Clerk adapter in web app.");
  }
  const user = await User.findOne({ email: input.email });
  if (!user) throw new Error("Invalid credentials");
  const ok = await argon2.verify(user.passwordHash, input.password);
  if (!ok) throw new Error("Invalid credentials");
  const payload = { sub: String(user._id), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await Session.create({
    userId: String(user._id),
    refreshToken,
    userAgent: meta?.userAgent,
    ip: meta?.ip,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  return { accessToken, refreshToken, user };
}

export async function refresh(token: string) {
  const session = await Session.findOne({ refreshToken: token });
  if (!session) throw new Error("Invalid refresh");
  if (session.expiresAt.getTime() < Date.now()) throw new Error("Session expired");
  const payload = verifyRefreshToken(token);
  const user = await User.findById(payload.sub);
  if (!user) throw new Error("User not found");
  const newPayload = { sub: String(user._id), email: user.email, role: user.role };
  const accessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);
  session.refreshToken = newRefreshToken;
  session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await session.save();
  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(token: string) {
  await Session.deleteOne({ refreshToken: token });
  return { ok: true };
}

export async function verifyEmail(token: string) {
  const t = await Token.findOne({ token, type: "verify" });
  if (!t) throw new Error("Invalid token");
  if (t.expiresAt.getTime() < Date.now()) throw new Error("Token expired");
  const user = await User.findById(t.userId);
  if (!user) throw new Error("User not found");
  user.emailVerifiedAt = new Date();
  await user.save();
  t.usedAt = new Date();
  await t.save();
  return { ok: true };
}

export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email });
  if (!user) return { ok: true };
  const token = await Token.create({
    userId: String(user._id),
    type: "reset",
    token: nanoid(32),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
  });
  return { resetToken: token.token };
}

export async function resetPassword(token: string, newPassword: string) {
  const t = await Token.findOne({ token, type: "reset" });
  if (!t) throw new Error("Invalid token");
  if (t.expiresAt.getTime() < Date.now()) throw new Error("Token expired");
  const user = await User.findById(t.userId);
  if (!user) throw new Error("User not found");
  user.passwordHash = await argon2.hash(newPassword);
  await user.save();
  t.usedAt = new Date();
  await t.save();
  return { ok: true };
}
