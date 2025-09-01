import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { z } from "zod";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({ transformer: SuperJSON });

export const appRouter = t.router({
  health: t.procedure.query(() => ({ ok: true })),
  auth: t.router({
    me: t.procedure.query(({ ctx }) => ({ userId: ctx.userId || null })),
  }),
  orgs: t.router({
    list: t.procedure.query(() => []),
  }),
  projects: t.router({
    list: t.procedure.query(() => []),
    create: t.procedure.input(z.object({ name: z.string() })).mutation(({ input }) => ({ id: "p_" + Date.now(), ...input })),
  }),
  plans: t.router({
    get: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => ({ id: input.id, status: "complete" })),
  }),
  builds: t.router({
    get: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => ({ id: input.id, status: "queued" })),
  }),
});

export type AppRouter = typeof appRouter;
