# Coolify Home Server Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and document a production Docker Compose deployment for `ap.0jay-shop.com` on host loopback port `3002`, including a private persistent PostgreSQL database.

**Architecture:** A multi-stage Dockerfile builds Next.js 16 standalone output and a small non-root runtime image. Docker Compose starts PostgreSQL 17 on a private network, waits for it to become healthy, then runs Prisma migrations before starting the app; Cloudflare Tunnel reaches the app through `127.0.0.1:3002`.

**Tech Stack:** Next.js 16.3, Node.js 22 Alpine, pnpm, Prisma 7.9, PostgreSQL 17, Docker Compose, Cloudflare Tunnel, Coolify

## Global Constraints

- Publish the app only at `127.0.0.1:3002`; do not alter services using ports `80`, `3000`, `3001`, or `8000`.
- Do not publish PostgreSQL port `5432` to the host.
- Keep PostgreSQL data in a named Docker volume.
- Run schema migrations before every app start; do not seed automatically on redeploy.
- Run the production application as a non-root user.
- Keep all production credentials out of Git.
- Follow the bundled Next.js 16 guidance in `node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md` and `node_modules/next/dist/docs/01-app/02-guides/self-hosting.md`.

---

### Task 1: Standalone Next.js production image

**Files:**
- Modify: `next.config.ts`
- Create: `.dockerignore`
- Create: `Dockerfile`

**Interfaces:**
- Consumes: `pnpm-lock.yaml`, `package.json`, `prisma/schema.prisma`, `prisma/migrations`, and Next.js application source.
- Produces: Docker image command `/app/docker-entrypoint.sh` and HTTP service on container port `3000`.

- [ ] **Step 1: Write a failing static deployment test**

Create `src/test/deployment-config.test.ts` with assertions that `next.config.ts` contains `output: "standalone"`, `Dockerfile` has multiple stages, copies `.next/standalone` and `.next/static`, declares `USER nextjs`, and exposes port `3000`.

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("production image", () => {
  it("uses Next.js standalone output", () => {
    expect(read("next.config.ts")).toContain('output: "standalone"');
  });

  it("builds a minimal non-root runtime image", () => {
    const dockerfile = read("Dockerfile");
    expect(dockerfile.match(/^FROM /gm)?.length).toBeGreaterThanOrEqual(3);
    expect(dockerfile).toContain(".next/standalone");
    expect(dockerfile).toContain(".next/static");
    expect(dockerfile).toContain("USER nextjs");
    expect(dockerfile).toContain("EXPOSE 3000");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/test/deployment-config.test.ts`

Expected: FAIL because standalone output and the Dockerfile do not exist.

- [ ] **Step 3: Enable standalone output and define build context exclusions**

Set `output: "standalone"` in `next.config.ts`. Create `.dockerignore` excluding `.git`, `.next`, `node_modules`, `.env*`, test coverage, docs, `.codex-tmp`, and local spreadsheet files while retaining application source, Prisma migrations, manifests, and the lockfile.

- [ ] **Step 4: Implement the multi-stage Dockerfile**

Use `node:22-alpine` stages named `base`, `deps`, `builder`, and `runner`. Enable Corepack, install locked dependencies with `pnpm install --frozen-lockfile`, copy sources, run `pnpm exec prisma generate`, and run `pnpm build`. In the runner, create UID/GID `1001`, copy standalone output, static assets, public assets, Prisma schema/migrations, generated Prisma runtime, and the entrypoint. Set `HOSTNAME=0.0.0.0`, `PORT=3000`, `NODE_ENV=production`, `USER nextjs`, and `EXPOSE 3000`.

- [ ] **Step 5: Run the static test and local production build**

Run: `pnpm vitest run src/test/deployment-config.test.ts && pnpm build`

Expected: the deployment test passes and Next.js produces `.next/standalone/server.js`.

- [ ] **Step 6: Commit the production image**

```bash
git add next.config.ts .dockerignore Dockerfile src/test/deployment-config.test.ts
git commit -m "build: add standalone production image"
```

### Task 2: Safe database startup and Compose stack

**Files:**
- Create: `docker-entrypoint.sh`
- Modify: `docker-compose.yml`
- Modify: `src/test/deployment-config.test.ts`

**Interfaces:**
- Consumes: `DATABASE_URL`, `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` supplied by Coolify.
- Produces: healthy services `app` and `postgres`, named volume `postgres_data`, and host endpoint `http://127.0.0.1:3002`.

- [ ] **Step 1: Extend the failing deployment test**

Assert that Compose binds `127.0.0.1:3002:3000`, has no PostgreSQL `ports` entry, defines `postgres_data`, uses `condition: service_healthy`, and that `docker-entrypoint.sh` runs `prisma migrate deploy` followed by `node server.js` using `exec`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/test/deployment-config.test.ts`

Expected: FAIL against the current development-only Compose file and missing entrypoint.

- [ ] **Step 3: Add the migration-first entrypoint**

Create an executable POSIX shell script:

```sh
#!/bin/sh
set -eu

echo "Applying database migrations..."
pnpm exec prisma migrate deploy
echo "Starting Next.js..."
exec node server.js
```

Ensure the runtime image contains the Prisma CLI needed by the command, or replace the invocation with the verified local Prisma executable copied from the dependency stage.

- [ ] **Step 4: Replace Compose with the production stack**

Define `postgres:17-alpine` with environment interpolation using required-value syntax, `pg_isready` health check, `unless-stopped`, and `postgres_data:/var/lib/postgresql/data`. Define `app` with `build: .`, `127.0.0.1:3002:3000`, `DATABASE_URL`, `depends_on.postgres.condition: service_healthy`, an HTTP health check, and `unless-stopped`. Do not define a host port for PostgreSQL or include pgAdmin.

- [ ] **Step 5: Validate the files and start the stack with disposable test credentials**

Run `docker compose config` with temporary process-scoped environment values, then run `docker compose up --build -d`. Inspect `docker compose ps` and `docker compose logs app`.

Expected: both services become healthy, logs show a successful migration before Next.js startup, `Invoke-WebRequest http://127.0.0.1:3002/login` succeeds, and connecting to host port `5432` is not required by the stack.

- [ ] **Step 6: Verify persistence**

Run the seed once inside the app container, record the row count, recreate only the app container with `docker compose up -d --force-recreate app`, and verify the same row count remains.

- [ ] **Step 7: Stop the verification stack without deleting its volume**

Run: `docker compose down`

Expected: containers and the network stop; `postgres_data` remains because `--volumes` is not used.

- [ ] **Step 8: Commit the production stack**

```bash
git add docker-entrypoint.sh Dockerfile docker-compose.yml src/test/deployment-config.test.ts
git commit -m "build: add Coolify application stack"
```

### Task 3: Coolify and Cloudflare operator documentation

**Files:**
- Create: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Consumes: the Compose service names and port mapping from Task 2.
- Produces: exact operator steps for Coolify deployment, one-time seeding, Cloudflare Tunnel routing, verification, backup, and restore.

- [ ] **Step 1: Extend the deployment test for safe example configuration**

Assert `.env.example` lists `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `DATABASE_URL`, contains no current development password, and README names `ap.0jay-shop.com`, `127.0.0.1:3002`, and the one-time seed command.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/test/deployment-config.test.ts`

Expected: FAIL because the example environment file and deployment instructions are absent.

- [ ] **Step 3: Add non-secret environment examples**

Document Compose interpolation values and a private service URL in `.env.example`, using a visible replacement marker such as `replace-with-a-long-random-password` rather than a working password.

- [ ] **Step 4: Document Coolify setup and first boot**

Add a Thai deployment section to README covering repository selection, Docker Compose build pack, environment variable creation, deployment health checks, and the one-time command `docker compose exec app pnpm db:seed`. State the initial admin account and mandatory password change.

- [ ] **Step 5: Document Cloudflare Tunnel and operations**

Specify public hostname `ap.0jay-shop.com`, service type `HTTP`, URL `127.0.0.1:3002`, verification commands, `pg_dump` backup, `psql` restore, and the warning never to run `docker compose down --volumes` unless intentionally deleting the database.

- [ ] **Step 6: Run all verification**

Run: `pnpm lint && pnpm typecheck && pnpm test:run && pnpm build && docker compose config`

Expected: every command exits successfully and Compose resolves the production stack without exposing PostgreSQL.

- [ ] **Step 7: Commit documentation**

```bash
git add .env.example README.md src/test/deployment-config.test.ts
git commit -m "docs: add Coolify deployment guide"
```

### Task 4: Final deployment audit

**Files:**
- Verify only; modify earlier files only if verification exposes a defect.

**Interfaces:**
- Consumes: all artifacts from Tasks 1-3.
- Produces: evidence that the repository is ready to paste into Coolify and route through Cloudflare Tunnel.

- [ ] **Step 1: Inspect final Git diff and secret hygiene**

Run: `git status --short`, `git diff HEAD~3 --check`, and search tracked deployment files for the current development password.

Expected: no whitespace errors, no unrelated changes, and no committed production secret.

- [ ] **Step 2: Re-run quality gates**

Run: `pnpm lint && pnpm typecheck && pnpm test:run && pnpm build`

Expected: all commands exit with status 0.

- [ ] **Step 3: Validate the final container path**

Run: `docker compose build --no-cache app`, start the stack, wait for health, request `http://127.0.0.1:3002/login`, and inspect logs for migration completion before server startup.

Expected: HTTP succeeds, both containers are healthy, and migration ordering is visible in logs.

- [ ] **Step 4: Cleanly stop local verification**

Run: `docker compose down` without `--volumes`.

- [ ] **Step 5: Report the exact Coolify variables and Cloudflare route**

Provide the user with the final variable names, password generation guidance, deploy/seed sequence, and `ap.0jay-shop.com -> http://127.0.0.1:3002` route.
