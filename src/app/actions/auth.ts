"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { changePasswordSchema, loginSchema } from "@/lib/validation/auth";
import { createSession, deleteCurrentSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AuthActionState = { error?: string };

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await deleteCurrentSession();
  redirect("/");
}

export async function changePasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const user = await requireAdmin(true);
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const storedUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!storedUser || !(await compare(parsed.data.currentPassword, storedUser.passwordHash))) return { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hash(parsed.data.newPassword, 12), mustChangePassword: false } });
  await deleteCurrentSession();
  await createSession(user.id);
  redirect("/");
}
