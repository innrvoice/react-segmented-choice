FROM node:22-alpine AS build

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY scripts/setup-git-hooks.mjs ./scripts/setup-git-hooks.mjs

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build:storybook

FROM caddy:2-alpine AS runtime

WORKDIR /srv

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /workspace/storybook-static /srv

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
