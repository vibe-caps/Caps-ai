import Fastify from "fastify";
import pino from "pino";
import { Queue, Worker } from "bullmq";
import { generateWebApp } from "./generators/web";
import { putObject } from "./storage";
import { Redis } from "ioredis";

const server = Fastify({ logger: pino({ level: "info" }) });
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const codegenQueue = new Queue("codegen", { connection: connection.options as any });

server.get("/health", async () => ({ ok: true }));

server.post("/codegen", async (req, reply) => {
  try {
    const spec = req.body as any;
    const job = await codegenQueue.add("codegen", { spec });
    return { jobId: job.id };
  } catch (e: any) {
    reply.code(400);
    return { error: e.message };
  }
});

const worker = new Worker(
  "codegen",
  async (job) => {
    const { spec } = job.data as any;
    const { zipPath } = await generateWebApp(spec);
    const stored = await putObject(`${job.id}.zip`, zipPath);
    return { artifact: stored };
  },
  { connection: connection.options as any }
);

worker.on("completed", (job) => server.log.info({ jobId: job.id }, "codegen done"));
worker.on("failed", (job, err) => server.log.error({ jobId: job?.id, err }, "codegen failed"));

const port = Number(process.env.PORT) || 4003;
server.listen({ port, host: "0.0.0.0" }).then(() => {
  server.log.info({ port }, "codegen listening");
});
