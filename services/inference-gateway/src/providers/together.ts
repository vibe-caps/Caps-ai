import { request } from "undici";

export async function callTogether(messages: any[], model: string) {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error("TOGETHER_API_KEY missing");
  const res = await request("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages })
  });
  const json = await res.body.json();
  return json;
}
