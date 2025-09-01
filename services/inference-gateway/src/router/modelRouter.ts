import { z } from "zod";
import { callOpenRouter } from "../providers/openrouter";
import { callTogether } from "../providers/together";
import { callFireworks } from "../providers/fireworks";

export const InferSchema = z.object({
  purpose: z.enum(["thinking", "coding"]).default("thinking"),
  messages: z.array(z.object({ role: z.string(), content: z.string() })),
  stream: z.boolean().optional(),
});
export type InferInput = z.infer<typeof InferSchema>;

const chains = {
  thinking: [
    { provider: "openrouter", model: "deepseek/deepseek-r1" },
    { provider: "together", model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo" },
    { provider: "fireworks", model: "openthinker/openthinker-32b" },
  ],
  coding: [
    { provider: "together", model: "Qwen/Qwen2.5-Coder-32B-Instruct" },
    { provider: "openrouter", model: "deepseek/deepseek-coder-v2" },
    { provider: "together", model: "codellama/CodeLlama-70b-Instruct" },
    { provider: "fireworks", model: "bigcode/starcoder2-15b" },
  ],
} as const;

export async function infer(input: InferInput) {
  const { purpose, messages, stream } = input;
  const chain = chains[purpose];
  const errors: any[] = [];
  for (const step of chain) {
    try {
      if (step.provider === "openrouter") return await callOpenRouter(messages, step.model, !!stream);
      if (step.provider === "together") return await callTogether(messages, step.model);
      if (step.provider === "fireworks") return await callFireworks(messages, step.model);
    } catch (e: any) {
      errors.push({ step, error: e.message });
      continue;
    }
  }
  throw new Error("All providers failed: " + JSON.stringify(errors));
}
