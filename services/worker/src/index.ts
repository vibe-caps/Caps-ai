import Fastify from "fastify";
import pino from "pino";
import { Worker, Queue, QueueEvents } from "bullmq";
import { Redis } from "ioredis";

const server = Fastify({ logger: pino({ level: "info" }) });
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const plans = new Worker(
  "plans",
  async (job) => {
    server.log.info({ jobId: job.id }, "processing plan -> codegen");
    const codegenQueue = new Queue("codegen", { connection: connection.options as any });
    await codegenQueue.add("codegen", { spec: (job.data as any).projectSpec });
    return { ok: true };
  },
  { connection: connection.options as any }
);

const qe = new QueueEvents("codegen", { connection: connection.options as any });
qe.on("completed", ({ jobId }) => server.log.info({ jobId }, "codegen completed"));
qe.on("failed", ({ jobId, failedReason }) => server.log.error({ jobId, failedReason }, "codegen failed"));

server.get("/health", async () => ({ ok: true }));

const port = Number(process.env.PORT) || 4004;
server.listen({ port, host: "0.0.0.0" }).then(() => {
  server.log.info({ port }, "worker listening");
});
