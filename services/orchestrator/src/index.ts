import Fastify from "fastify";
import pino from "pino";
import { Queue } from "bullmq";
import { redis } from "./redis";
import { z } from "zod";
import { planFromPrompt } from "./planner";

const server = Fastify({ logger: pino({ level: "info" }) });

const plansQueue = new Queue("plans", { connection: redis.options as any });

server.get("/health", async () => ({ ok: true }));

server.post("/plan", async (req, reply) => {
  const bodySchema = z.object({ prompt: z.string().min(5) });
  try {
    const { prompt } = bodySchema.parse(req.body);
    const projectSpec = await planFromPrompt(prompt);
    const job = await plansQueue.add("plan", { projectSpec });
    return { jobId: job.id, projectSpec };
  } catch (e: any) {
    reply.code(400);
    return { error: e.message };
  }
});

const port = Number(process.env.PORT) || 4002;
server.listen({ port, host: "0.0.0.0" }).then(() => {
  server.log.info({ port }, "orchestrator listening");
});
