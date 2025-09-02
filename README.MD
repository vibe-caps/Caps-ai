# Caps AI Monorepo

Turn prompts into running micro‑SaaS apps.

- TurboRepo + pnpm workspaces
- Next.js 14 web app with tRPC and custom Mongo auth
- Services: inference-gateway, orchestrator, codegen, worker
- Packages: ui, types, sdk, auth, config
- CLI (Go) single static binary with Termux support

Quickstart
- pnpm install
- pnpm turbo run dev (starts web + services in dev)
- make -C cli build && ./cli/bin/caps --help

See apps/docs for full documentation.

