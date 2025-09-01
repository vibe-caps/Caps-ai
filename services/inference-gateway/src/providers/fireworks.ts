import { request } from "undici";

export async function callFireworks(messages: any[], model: string) {
  const apiKey = process.env.FIREWORKS_API_KEY;
  if (!apiKey) throw new Error("FIREWORKS_API_KEY missing");
  const res = await request("https://api.fireworks.ai/inference/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages })
  });
  const json = await res.body.json();
  return json;
}
