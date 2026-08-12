"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordChangeDialog() {
  const [state, action, pending] = useActionState(changePasswordAction, {});
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-labelledby="password-title">
    <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl">
      <h2 id="password-title" className="text-xl font-semibold">เปลี่ยนรหัสผ่านก่อนใช้งาน</h2>
      <p className="mt-1 text-sm text-muted-foreground">เพื่อความปลอดภัย กรุณาตั้งรหัสผ่านใหม่ก่อนจัดการข้อมูล</p>
      <form action={action} className="mt-5 space-y-4">
        <div className="space-y-2"><label htmlFor="currentPassword" className="text-sm font-medium">รหัสผ่านปัจจุบัน</label><Input id="currentPassword" name="currentPassword" type="password" required /></div>
        <div className="space-y-2"><label htmlFor="newPassword" className="text-sm font-medium">รหัสผ่านใหม่</label><Input id="newPassword" name="newPassword" type="password" minLength={8} required /></div>
        {state.error ? <p role="alert" className="text-sm text-destructive">{state.error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>{pending ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}</Button>
      </form>
    </div>
  </div>;
}
