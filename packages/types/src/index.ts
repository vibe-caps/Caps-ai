import { z } from "zod";

export const AuthUserSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  orgId: z.string().optional(),
  role: z.enum(["owner", "admin", "member"]).default("member"),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const ProjectSpecSchema = z.object({
  meta: z.object({
    name: z.string(),
    description: z.string().optional(),
    target: z.enum(["web", "mobile", "fullstack"]).default("web"),
  }),
  pages: z.array(z.object({
    path: z.string(),
    title: z.string().optional(),
    components: z.array(z.string()).optional(),
  })).default([]),
  routes: z.array(z.object({
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    path: z.string(),
    handlerName: z.string().optional(),
  })).default([]),
  components: z.array(z.object({
    name: z.string(),
    props: z.record(z.any()).optional(),
  })).default([]),
  apiModules: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).default([]),
  dbSchema: z.array(z.object({
    name: z.string(),
    fields: z.record(z.string()),
  })).default([]),
  thirdParty: z.array(z.object({
    name: z.string(),
    config: z.record(z.any()).optional(),
  })).default([]),
  infraPlan: z.object({
    web: z.enum(["vercel"]).default("vercel"),
    services: z.enum(["railway", "render"]).default("railway"),
  }).default({ web: "vercel", services: "railway" }),
});
export type ProjectSpec = z.infer<typeof ProjectSpecSchema>;

export const BuildEventSchema = z.object({
  id: z.string(),
  type: z.enum(["plan_created", "codegen_started", "codegen_completed", "build_succeeded", "build_failed"]) ,
  message: z.string().optional(),
  timestamp: z.number(),
});
export type BuildEvent = z.infer<typeof BuildEventSchema>;

export type BuildStatus = "queued" | "running" | "succeeded" | "failed";
