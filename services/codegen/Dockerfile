FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate && pnpm i --frozen-lockfile || pnpm i
COPY . .
RUN pnpm build
CMD ["node", "dist/index.js"]
