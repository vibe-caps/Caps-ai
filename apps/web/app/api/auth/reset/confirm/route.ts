import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db";
import { resetPassword } from "@caps/auth";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { token, newPassword } = await req.json();
    const out = await resetPassword(token, newPassword);
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
