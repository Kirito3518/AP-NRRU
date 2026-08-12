"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return <form action={action} className="space-y-4">
    <div className="space-y-2"><label htmlFor="username" className="text-sm font-medium">ชื่อผู้ใช้</label><Input id="username" name="username" autoComplete="username" required /></div>
    <div className="space-y-2"><label htmlFor="password" className="text-sm font-medium">รหัสผ่าน</label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
    {state.error ? <p role="alert" className="text-sm text-destructive">{state.error}</p> : null}
    <Button type="submit" className="w-full" disabled={pending}>{pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</Button>
  </form>;
}
