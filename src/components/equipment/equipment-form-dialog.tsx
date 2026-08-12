"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { createEquipmentAction, updateEquipmentAction } from "@/app/actions/equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { EquipmentView } from "@/components/equipment/types";
import { statusLabels } from "@/components/equipment/types";
import {
  EquipmentDialogTabs,
  getEquipmentTabPanelId,
  type EquipmentDialogTabId,
} from "@/components/equipment/equipment-dialog-tabs";
import { cn } from "@/lib/utils";

export const equipmentFormFields = [
  {
    id: "general",
    title: "ข้อมูลทั่วไป",
    fields: [
      ["assetCode", "เลขครุภัณฑ์"],
      ["deviceType", "ประเภทอุปกรณ์"],
      ["category", "หมวดครุภัณฑ์"],
      ["serialNumber", "Serial Number"],
      ["receivedYear", "ปีที่ได้รับ"],
      ["budgetSource", "แหล่งงบประมาณ"],
    ],
  },
  {
    id: "location",
    title: "สถานที่และผู้รับผิดชอบ",
    fields: [
      ["department", "หน่วยงาน"],
      ["building", "อาคาร"],
      ["floor", "ชั้น"],
      ["room", "ห้อง"],
      ["location", "จุดติดตั้ง"],
      ["owner", "ผู้รับผิดชอบ"],
    ],
  },
  {
    id: "technical",
    title: "ข้อมูลทางเทคนิค",
    fields: [
      ["cpu", "CPU"],
      ["ram", "RAM"],
      ["storage", "Storage"],
      ["operatingSystem", "ระบบปฏิบัติการ/Firmware"],
    ],
  },
  {
    id: "network",
    title: "ข้อมูลเครือข่าย",
    fields: [
      ["ipAddress", "IP Address"],
      ["macAddress", "MAC Address"],
      ["networkSpeed", "พอร์ต/ความเร็ว"],
      ["connectionStatus", "สถานะการเชื่อมต่อ"],
    ],
  },
  {
    id: "condition",
    title: "สภาพและหมายเหตุ",
    fields: [
      ["condition", "สภาพการใช้งาน"],
      ["approximateAge", "อายุโดยประมาณ"],
      ["problem", "ปัญหาที่พบ"],
      ["recommendation", "ข้อเสนอแนะ"],
      ["note", "หมายเหตุ"],
    ],
  },
] as const satisfies ReadonlyArray<{
  id: EquipmentDialogTabId;
  title: string;
  fields: ReadonlyArray<readonly [string, string]>;
}>;

const sectionStyles: Record<EquipmentDialogTabId, string> = {
  general: "border-violet-200/80 bg-violet-50/40 dark:border-violet-900/70 dark:bg-violet-950/20",
  location: "border-blue-200/80 bg-blue-50/40 dark:border-blue-900/70 dark:bg-blue-950/20",
  technical: "border-cyan-200/80 bg-cyan-50/40 dark:border-cyan-900/70 dark:bg-cyan-950/20",
  network: "border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/70 dark:bg-emerald-950/20",
  condition: "border-amber-200/80 bg-amber-50/40 dark:border-amber-900/70 dark:bg-amber-950/20",
};

function initialValue(item: EquipmentView | undefined, field: string) {
  if (!item) return "";
  if (field === "deviceType") return item.deviceType?.name || "";
  if (field === "department") return item.department?.name || "";
  if (field === "building") return item.building?.name || "";
  if (field === "owner") return item.owner?.name || "";
  return String(item[field as keyof EquipmentView] || "");
}

export function EquipmentFormDialog({ item }: { item?: EquipmentView }) {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<EquipmentDialogTabId>("general");
  const router = useRouter();
  const action = item ? updateEquipmentAction.bind(null, item.id) : createEquipmentAction;
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      router.refresh();
      queueMicrotask(() => {
        setDirty(false);
        setOpen(false);
      });
    }
  }, [state.success, router]);

  const close = () => {
    if (!dirty || window.confirm("มีข้อมูลที่ยังไม่ได้บันทึก ต้องการปิดหรือไม่")) {
      setDirty(false);
      setOpen(false);
    }
  };

  const openDialog = () => {
    setActiveTab("general");
    setDirty(false);
    setOpen(true);
  };

  const idPrefix = item?.id || "new-equipment";

  return (
    <>
      <Button
        type="button"
        size={item ? "icon-sm" : "sm"}
        variant={item ? "ghost" : "default"}
        aria-label={item ? "แก้ไข" : undefined}
        onClick={openDialog}
      >
        {item ? <Pencil /> : <><Plus /> เพิ่มอุปกรณ์</>}
      </Button>
      <Modal
        open={open}
        onClose={close}
        title={item ? "แก้ไขข้อมูลอุปกรณ์" : "เพิ่มอุปกรณ์"}
        description={item?.systemCode || "ระบบจะสร้างรหัสให้อัตโนมัติ"}
        wide
        locked={pending}
      >
        <form action={formAction} className="space-y-5" onChange={() => setDirty(true)}>
          <EquipmentDialogTabs
            value={activeTab}
            onChange={setActiveTab}
            idPrefix={idPrefix}
          />
          {equipmentFormFields.map((section) => (
            <fieldset
              key={section.id}
              id={getEquipmentTabPanelId(section.id, idPrefix)}
              role="tabpanel"
              aria-labelledby={`${idPrefix}-tab-${section.id}`}
              tabIndex={0}
              hidden={activeTab !== section.id}
              className={cn("rounded-2xl border p-4", sectionStyles[section.id])}
            >
              <legend className="px-2 text-sm font-semibold text-foreground">{section.title}</legend>
              {section.id === "general" ? (
                <div className="mb-4 max-w-sm">
                  <label htmlFor={`${idPrefix}-status`} className="mb-1 block text-sm font-medium">สถานะ</label>
                  <select
                    id={`${idPrefix}-status`}
                    name="status"
                    defaultValue={item?.status || "ACTIVE"}
                    className="h-9 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.fields.map(([name, label]) => (
                  <div
                    key={name}
                    className={name === "location" || name === "problem" || name === "recommendation" || name === "note" ? "lg:col-span-2" : ""}
                  >
                    <label htmlFor={`${idPrefix}-${name}`} className="mb-1 block text-sm font-medium">{label}</label>
                    <Input
                      id={`${idPrefix}-${name}`}
                      name={name}
                      defaultValue={initialValue(item, name)}
                      aria-invalid={Boolean(state.fieldErrors?.[name])}
                    />
                    {state.fieldErrors?.[name]?.[0] ? <p className="mt-1 text-xs text-destructive">{state.fieldErrors[name][0]}</p> : null}
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
          {state.error ? <p role="alert" className="text-sm text-destructive">{state.error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close} disabled={pending}>ยกเลิก</Button>
            <Button type="submit" disabled={pending}>{pending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
