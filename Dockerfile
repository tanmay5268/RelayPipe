FROM node:22.12.0-slim
WORKDIR /app

RUN npm install -g pnpm@9.12.0

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pnpm install --filter file_worker... --frozen-lockfile --prod

ENV NODE_ENV=production

CMD ["pnpm", "--filter", "file_worker", "start"]