import { NextResponse } from "next/server";

const ORCH_URL = process.env.ORCHESTRATOR_URL || "http://localhost:4002";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${ORCH_URL}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
