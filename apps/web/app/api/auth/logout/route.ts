import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db";
import { logout } from "@caps/auth";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const cookie = req.headers.get("cookie") || "";
    const token = (/refresh_token=([^;]+)/.exec(cookie) || [])[1];
    if (token) await logout(token);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("refresh_token", "", { httpOnly: true, expires: new Date(0), path: "/" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
