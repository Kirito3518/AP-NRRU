import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("production image", () => {
  it("uses Next.js standalone output", () => {
    expect(read("next.config.ts")).toContain('output: "standalone"');
  });

  it("builds a minimal non-root runtime image", () => {
    expect(existsSync("Dockerfile")).toBe(true);
    const dockerfile = read("Dockerfile");
    expect(dockerfile.match(/^FROM /gm)?.length).toBeGreaterThanOrEqual(3);
    expect(dockerfile).toContain(".next/standalone");
    expect(dockerfile).toContain(".next/static");
    expect(dockerfile).toContain("USER nextjs");
    expect(dockerfile).toContain("EXPOSE 3000");
  });

  it("pins the verified Alpine release for the Node runtime", () => {
    const dockerfile = read("Dockerfile");
    expect(dockerfile).toContain("node:22-alpine3.23");
    expect(dockerfile).not.toContain("node:22-alpine AS");
  });
});

describe("production compose stack", () => {
  it("publishes only the application on the new loopback port", () => {
    const compose = read("docker-compose.yml");
    const postgresService = compose.match(/  postgres:[\s\S]*?(?=\n  app:)/)?.[0];
    expect(compose).toContain('"127.0.0.1:3002:3000"');
    expect(postgresService).toBeDefined();
    expect(postgresService).not.toContain("ports:");
  });

  it("waits for a healthy persistent database", () => {
    const compose = read("docker-compose.yml");
    expect(compose).toContain("condition: service_healthy");
    expect(compose).toContain("pg_isready");
    expect(compose).toContain("postgres_data:/var/lib/postgresql/data");
    expect(compose).toMatch(/volumes:\s*\n\s+postgres_data:/);
  });

  it("runs migrations before the server", () => {
    expect(existsSync("docker-entrypoint.sh")).toBe(true);
    const entrypoint = read("docker-entrypoint.sh");
    expect(entrypoint.indexOf("prisma migrate deploy")).toBeGreaterThan(-1);
    expect(entrypoint.indexOf("exec node server.js")).toBeGreaterThan(
      entrypoint.indexOf("prisma migrate deploy"),
    );
  });

  it("provides an explicit one-time seed service", () => {
    const compose = read("docker-compose.yml");
    expect(compose).toContain("target: builder");
    expect(compose).toContain('command: ["pnpm", "db:seed"]');
    expect(compose).toContain('profiles: ["tools"]');
  });
});

describe("deployment documentation", () => {
  it("documents required variables without development credentials", () => {
    expect(existsSync(".env.example")).toBe(true);
    const example = read(".env.example");
    expect(example).toContain("POSTGRES_DB=");
    expect(example).toContain("POSTGRES_USER=");
    expect(example).toContain("POSTGRES_PASSWORD=");
    expect(example).toContain("DATABASE_URL=");
    expect(example).not.toContain("POSTGRES_PASSWORD=postgres");
  });

  it("documents the Coolify and Cloudflare handoff", () => {
    const readme = read("README.md");
    expect(readme).toContain("ap.0jay-shop.com");
    expect(readme).toContain("127.0.0.1:3002");
    expect(readme).toContain("docker compose --profile tools run --rm seed");
  });
});
