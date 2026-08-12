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
});
