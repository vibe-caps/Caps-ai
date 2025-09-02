import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export function createClient<TAppRouter extends object = any>(baseUrl: string) {
  return createTRPCProxyClient<TAppRouter>({
    links: [
      httpBatchLink({
        url: `${baseUrl}/api/trpc`,
        fetch(url, options) {
          return fetch(url, { ...options, credentials: "include" });
        }
      })
    ]
  });
}

export async function rest<T>(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}
