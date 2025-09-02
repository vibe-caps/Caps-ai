import { type inferAsyncReturnType } from "@trpc/server";
import { headers } from "next/headers";
import { connectMongo } from "@/lib/db";

export async function createContext() {
  await connectMongo();
  const h = headers();
  const auth = h.get("authorization");
  const userId = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  return { userId };
}
export type Context = inferAsyncReturnType<typeof createContext>;
