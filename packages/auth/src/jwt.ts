import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  email: string;
  orgId?: string;
  role?: string;
}

const JWT_SECRET = (process.env.JWT_SECRET || "dev-secret") as unknown as jwt.Secret;
const JWT_REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET || "dev-refresh") as unknown as jwt.Secret;

export function signAccessToken(payload: JwtPayload, expiresIn: string | number = "15m") {
  return jwt.sign(payload as any, JWT_SECRET, { algorithm: "HS256", expiresIn } as any);
}

export function signRefreshToken(payload: JwtPayload, expiresIn: string | number = "30d") {
  return jwt.sign(payload as any, JWT_REFRESH_SECRET, { algorithm: "HS256", expiresIn } as any);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload & JwtPayload;
}
