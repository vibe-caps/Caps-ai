import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db";
import { register, RegisterSchema } from "@caps/auth";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    const parsed = RegisterSchema.parse(body);
    const { user, verifyToken } = await register(parsed);
    return NextResponse.json({ userId: user._id, verifyToken });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
