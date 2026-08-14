# RelayPipe

A file-processing pipeline platform: sign in, upload a file, and watch it move through a real pipeline — queued, processed, and delivered — step by step, live on screen.

The upload path is fully wired end-to-end: the web app creates a job record, hands the client a presigned S3 PUT URL, the client uploads directly to S3, then confirms the job through the API. The processing layer (background worker, outputs, webhooks) is scaffolded in the database schema and partially implemented.

## Architecture

<img src="apps/FileAPI/public/FlowDiagram.png" alt="RelayPipe architecture diagram" width="800" />

## Monorepo layout

This is a [Turborepo](https://turborepo.dev) monorepo managed with [pnpm](https://pnpm.io) workspaces.

### Apps

| App | Path | Description |
| --- | --- | --- |
| `file-api` | `apps/FileAPI` | Main Next.js app (port `3000`). Landing page, `/project` upload dashboard, and the API itself — served from `/api` via oRPC's OpenAPI handler, which also generates the OpenAPI spec. |
| `file_worker` | `apps/file_worker` | BullMQ background worker (TypeScript, run with `tsx`). Currently a stub — connects to Redis and processes an `emails` queue. |
| `docs` | `apps/docs` | Next.js app on port `3001` — leftover Turborepo starter scaffold. |

### Packages

| Package | Path | Description |
| --- | --- | --- |
| `@repo/contract` | `packages/contract` | [oRPC](https://orpc.unnoq.com) contract — the single source of truth for the API. Defines routes (`fileinit`, `fileupload`, `get_api`), Zod input/output schemas, and the shared error registry (`BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, …). |
| `@repo/database` | `packages/database` | Prisma 7 setup with the `pg` adapter. Schema (`prisma/schema.prisma`), migrations, and a shared `prisma` client instance. |
| `@repo/ui` | `packages/ui` | Small React component library (`button`, `card`, `code`). |
| `@repo/eslint-config` | `packages/eslint-config` | Shared ESLint configs (`base`, `next-js`, `react-internal`). |
| `@repo/typescript-config` | `packages/typescript-config` | Shared `tsconfig` presets. |
| `queue` | `packages/queue` | Empty placeholder package (no code yet). |

## Data model

Defined in `packages/database/prisma/schema.prisma` (PostgreSQL):

- **User** — identified by email (from Clerk). `users` table.
- **Job** — one upload: `s3Key`, `filename`, `mimeType`, `size`, `jobType` (`image` | `pdf`), `status` (`pending` → `queued` → `processing` → `done` | `failed`), retry/error fields, timestamps.
- **JobOutput** — artifacts produced by processing a job (`outputType`, `s3Key`, `url`).
- **WebhookEndpoint** / **WebhookDelivery** — per-user webhook endpoints and their delivery attempts (`pending` | `delivered` | `failed`).

## Tech stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Web:** Next.js 16, React 19, Tailwind CSS v4, shadcn-style components
- **API:** oRPC (contract-first), served as an OpenAPI handler with a generated OpenAPI spec
- **Auth:** Clerk (middleware + `currentUser()`)
- **Database:** PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
- **Object storage:** AWS S3 with presigned URLs (`@aws-sdk/client-s3`)
- **Queues:** BullMQ + Redis (worker app); Upstash Redis in the web app
- **Client upload UI:** custom `useFileUpload` hook + upload component with progress, drag-and-drop, and retry

## Getting started

### Prerequisites

- Node.js ≥ 18 and pnpm 9
- A PostgreSQL database (for `DATABASE_URL`)
- An AWS S3 bucket + access keys (for presigned uploads)
- A Clerk application (for auth)
- Redis (local, for the worker; Upstash, for the web app)

### Install & configure

```sh
pnpm install
```

Create `.env` files. The build expects env vars in `apps/FileAPI/.env` (and `packages/database/.env` for Prisma CLI):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth |
| `BUCKET_NAME` / `BUCKET_REGION` / `S3_ACCESS_KEY` / `S3_SECRET_ACCESS_KEY` | S3 presigned uploads |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis (web app) |
| `BETTER_AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Reserved (better-auth dependency) |

### Set up the database

```sh
pnpm db:generate   # generate the Prisma client
pnpm db:migrate    # apply migrations
pnpm db:studio     # browse the DB in Prisma Studio
```

### Run it

```sh
pnpm dev                      # all apps (FileAPI on :3000, docs on :3001)
pnpm dev --filter=file-api    # web app + API only
pnpm dev --filter=file_worker # background worker
```

Open [http://localhost:3000](http://localhost:3000) (sign in with Clerk), then upload a file on the landing page or `/project`. The OpenAPI spec is served at [http://localhost:3000/api](http://localhost:3000/api).

## Scripts

Run from the repo root:

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps in dev mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint everything |
| `pnpm check-types` | Typecheck everything |
| `pnpm format` | Format with Prettier |
| `pnpm db:generate` | Regenerate the Prisma client |
| `pnpm db:migrate` / `pnpm db:migrate:prod` | Apply DB migrations |
| `pnpm db:studio` | Open Prisma Studio |

## API

The API is defined contract-first in `packages/contract` and served by `apps/FileAPI` under the `/api` prefix. All routes are JSON.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/v1/fileinit` | Validates file metadata (MIME type, ≤ 50 MB), creates a pending `Job`, returns `{ s3url, jobId }` |
| `POST` | `/api/v1/fileconfirm` | Confirms a job after a successful S3 upload, returns `{ jobId, Status }` (DB/queue wiring pending) |
| `GET` | `/api/v1/get_api` | (contract defined; handler not implemented yet) Returns the user's API key |

Supported MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.

## Status / roadmap

Working today:

- [x] Clerk auth + user registration
- [x] Contract-first API (oRPC) with generated OpenAPI spec
- [x] Presigned S3 upload flow with job tracking
- [x] Upload UI with progress, drag-and-drop, retry

In progress / stubbed:

- [ ] `fileconfirm` persists the job status and enqueues it on the BullMQ worker (currently returns `done` without a DB write)
- [ ] Real processing logic in `file_worker` (currently a stub `emails` queue)
- [ ] API key management (`get_api` route, `api_keys` table was dropped in a later migration)
- [ ] Job outputs and webhook delivery
