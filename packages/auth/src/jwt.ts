import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  email: string;
  orgId?: string;
  role?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh";

export function signAccessToken(payload: JwtPayload, expiresIn = "15m") {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn });
}

export function signRefreshToken(payload: JwtPayload, expiresIn = "30d") {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { algorithm: "HS256", expiresIn });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload & JwtPayload;
}
