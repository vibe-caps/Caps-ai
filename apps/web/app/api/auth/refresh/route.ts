import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db";
import { refresh } from "@caps/auth";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const cookie = req.headers.get("cookie") || "";
    const token = (/refresh_token=([^;]+)/.exec(cookie) || [])[1];
    if (!token) throw new Error("No refresh token");
    const { accessToken, refreshToken } = await refresh(token);
    const res = NextResponse.json({ accessToken });
    res.cookies.set("refresh_token", refreshToken, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
