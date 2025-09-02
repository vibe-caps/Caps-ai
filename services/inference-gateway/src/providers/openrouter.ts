import { request } from "undici";

export async function callOpenRouter(messages: any[], model: string, stream = false) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");
  const res = await request("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, stream }),
  });
  if (!stream) {
    const json = await res.body.json();
    return json;
  }
  return res.body;
}
