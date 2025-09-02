import Fastify from "fastify";
import pino from "pino";
import { z } from "zod";
import { infer, InferSchema } from "./router/modelRouter";

const server = Fastify({ logger: pino({ level: "info" }) });

server.get("/health", async () => ({ ok: true }));

server.post("/infer", async (req, reply) => {
  try {
    const parsed = InferSchema.parse(req.body);
    const out = await infer(parsed);
    if ((parsed as any).stream && out && typeof (out as any).pipe === "function") {
      reply.raw.setHeader("Content-Type", "text/event-stream");
      (out as any).pipe(reply.raw);
      return reply;
    }
    return out;
  } catch (e: any) {
    reply.code(400);
    return { error: e.message };
  }
});

const port = Number(process.env.PORT) || 4001;
server.listen({ port, host: "0.0.0.0" }).then(() => {
  server.log.info({ port }, "inference-gateway listening");
});
