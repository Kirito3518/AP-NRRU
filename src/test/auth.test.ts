import { describe, expect, it } from "vitest";

import { hashSessionToken, sessionCookieOptions } from "@/lib/auth-core";
import { changePasswordSchema, loginSchema } from "@/lib/validation/auth";

describe("authentication contracts", () => {
  it("hashes opaque session tokens without storing the token itself", () => {
    expect(hashSessionToken("secret-token")).toBe(
      "930bbdc51b6aed5c2a5678fd6e28dee7a05e8a4b643cfc0b4427c3efb86c0d94",
    );
    expect(hashSessionToken("secret-token")).not.toBe("secret-token");
  });

  it("uses a secure HTTP-only same-site cookie policy", () => {
    expect(sessionCookieOptions(true)).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
  });

  it("rejects blank login credentials and weak replacement passwords", () => {
    expect(loginSchema.safeParse({ username: "", password: "" }).success).toBe(false);
    expect(changePasswordSchema.safeParse({ currentPassword: "admin1234", newPassword: "123" }).success).toBe(false);
    expect(changePasswordSchema.safeParse({ currentPassword: "admin1234", newPassword: "new-password-123" }).success).toBe(true);
  });
});
