import { createHash } from "node:crypto";

export const SESSION_COOKIE_NAME = "nrru_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}
