"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="grid min-h-[70vh] place-items-center p-6 text-center"><div><h1 className="text-2xl font-semibold">ไม่สามารถโหลดข้อมูลได้</h1><p className="mt-2 text-sm text-muted-foreground">เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้ง</p><Button className="mt-5" onClick={reset}>ลองใหม่</Button></div></main>;
}
