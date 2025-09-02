import { z } from "zod";
import { ProjectSpecSchema, type ProjectSpec } from "../schemas/projectSpec";

const INFER_URL = process.env.INFER_URL || "http://localhost:4001";

export async function planFromPrompt(prompt: string): Promise<ProjectSpec> {
  const system = `You are a planner that outputs ONLY JSON matching the schema: ${ProjectSpecSchema.toString()}`;
  const res = await fetch(`${INFER_URL}/infer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      purpose: "thinking",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ]
    }),
  });
  const data = await res.json();
  let content = data?.choices?.[0]?.message?.content || data?.message || JSON.stringify(data);
  let jsonText = attemptExtractJson(content);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    jsonText = autoRepairJson(jsonText);
    parsed = JSON.parse(jsonText);
  }
  const validated = ProjectSpecSchema.parse(parsed);
  return validated;
}

function attemptExtractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}$/);
  return match ? match[0] : text;
}

function autoRepairJson(text: string): string {
  return text
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/\n/g, " ")
    .trim();
}
