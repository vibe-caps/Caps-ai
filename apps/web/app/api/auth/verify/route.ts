import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db";
import { verifyEmail } from "@caps/auth";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { token } = await req.json();
    const out = await verifyEmail(token);
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
