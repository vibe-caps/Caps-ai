import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db";
import { requestPasswordReset } from "@caps/auth";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { email } = await req.json();
    const out = await requestPasswordReset(email);
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
