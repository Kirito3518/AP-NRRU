"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteEquipmentAction } from "@/app/actions/equipment";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function EquipmentDeleteDialog({ id, systemCode }: { id: string; systemCode: string }) {
  const [open, setOpen] = useState(false); const [pending, startTransition] = useTransition(); const router = useRouter();
  return <><Button type="button" size="icon-sm" variant="destructive" onClick={() => setOpen(true)} aria-label="ลบ"><Trash2 /></Button><Modal open={open} onClose={() => setOpen(false)} title="ยืนยันการลบข้อมูล" description={systemCode} locked={pending}><p className="text-sm text-muted-foreground">รายการจะถูกซ่อนจากหน้าสาธารณะ แต่ยังคงอยู่ในฐานข้อมูลเพื่อการตรวจสอบ</p><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>ยกเลิก</Button><Button type="button" variant="destructive" disabled={pending} onClick={() => startTransition(async () => { await deleteEquipmentAction(id); setOpen(false); router.refresh(); })}>{pending ? "กำลังลบ..." : "ยืนยันลบ"}</Button></div></Modal></>;
}
