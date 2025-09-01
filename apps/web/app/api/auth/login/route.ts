import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db";
import { login, LoginSchema } from "@caps/auth";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    const parsed = LoginSchema.parse(body);
    const meta = {
      userAgent: req.headers.get("user-agent") || undefined,
      ip: req.headers.get("x-forwarded-for") || undefined,
    };
    const { accessToken, refreshToken, user } = await login(parsed, meta);
    const res = NextResponse.json({ accessToken, user: { id: user._id, email: user.email } });
    res.cookies.set("refresh_token", refreshToken, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
