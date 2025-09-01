# Architecture

- apps/web: Next.js 14 App Router
- apps/mobile: Expo React Native
- services: inference-gateway, orchestrator, codegen, worker
- packages: ui, types, sdk, auth, config
- data: MongoDB + Redis + S3-compatible storage

Flow:
1. User enters prompt in Builder
2. Web calls orchestrator /plan → inference-gateway (thinking model)
3. Orchestrator emits ProjectSpec to Redis
4. Worker triggers codegen job
5. Codegen generates scaffold and stores artifact zip in storage; emits status
6. UI shows logs and allows download/preview
