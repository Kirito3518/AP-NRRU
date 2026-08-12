"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { EquipmentView } from "@/components/equipment/types";
import { statusLabels } from "@/components/equipment/types";
import {
  EquipmentDialogTabs,
  equipmentDialogTabs,
  getEquipmentTabPanelId,
  type EquipmentDialogTabId,
} from "@/components/equipment/equipment-dialog-tabs";
import { cn } from "@/lib/utils";

export const equipmentDetailsFields: {
  tab: EquipmentDialogTabId;
  label: string;
  getValue: (item: EquipmentView) => string | null | undefined;
}[] = [
  { tab: "general", label: "รหัสระบบ", getValue: (item) => item.systemCode },
  { tab: "general", label: "เลขครุภัณฑ์", getValue: (item) => item.assetCode },
  { tab: "general", label: "ประเภทอุปกรณ์", getValue: (item) => item.deviceType?.name },
  { tab: "general", label: "หมวดครุภัณฑ์", getValue: (item) => item.category },
  { tab: "general", label: "Serial Number", getValue: (item) => item.serialNumber },
  { tab: "general", label: "สถานะ", getValue: (item) => statusLabels[item.status] },
  { tab: "location", label: "หน่วยงาน", getValue: (item) => item.department?.name },
  { tab: "location", label: "อาคาร", getValue: (item) => item.building?.name },
  { tab: "location", label: "ชั้น", getValue: (item) => item.floor },
  { tab: "location", label: "ห้อง", getValue: (item) => item.room },
  { tab: "location", label: "จุดติดตั้ง", getValue: (item) => item.location },
  { tab: "location", label: "ผู้รับผิดชอบ", getValue: (item) => item.owner?.name },
  { tab: "technical", label: "CPU", getValue: (item) => item.cpu },
  { tab: "technical", label: "RAM", getValue: (item) => item.ram },
  { tab: "technical", label: "Storage", getValue: (item) => item.storage },
  { tab: "technical", label: "ระบบปฏิบัติการ/Firmware", getValue: (item) => item.operatingSystem },
  { tab: "network", label: "IP Address", getValue: (item) => item.ipAddress },
  { tab: "network", label: "MAC Address", getValue: (item) => item.macAddress },
  { tab: "network", label: "พอร์ต/ความเร็ว", getValue: (item) => item.networkSpeed },
  { tab: "network", label: "สถานะการเชื่อมต่อ", getValue: (item) => item.connectionStatus },
  { tab: "condition", label: "สภาพการใช้งาน", getValue: (item) => item.condition },
  { tab: "condition", label: "อายุโดยประมาณ", getValue: (item) => item.approximateAge },
  { tab: "condition", label: "ปัญหาที่พบ", getValue: (item) => item.problem },
  { tab: "condition", label: "ข้อเสนอแนะ", getValue: (item) => item.recommendation },
  { tab: "condition", label: "หมายเหตุ", getValue: (item) => item.note },
];

const sectionStyles: Record<EquipmentDialogTabId, string> = {
  general: "border-violet-200/80 bg-violet-50/40 dark:border-violet-900/70 dark:bg-violet-950/20",
  location: "border-blue-200/80 bg-blue-50/40 dark:border-blue-900/70 dark:bg-blue-950/20",
  technical: "border-cyan-200/80 bg-cyan-50/40 dark:border-cyan-900/70 dark:bg-cyan-950/20",
  network: "border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/70 dark:bg-emerald-950/20",
  condition: "border-amber-200/80 bg-amber-50/40 dark:border-amber-900/70 dark:bg-amber-950/20",
};

const statusStyles: Record<EquipmentView["status"], string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  PROBLEM: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  MAINTENANCE: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200",
  MOVED: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200",
  MISSING: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
  RETIRED: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
};

export function EquipmentDetailsDialog({ item }: { item: EquipmentView }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EquipmentDialogTabId>("general");

  const openDialog = () => {
    setActiveTab("general");
    setOpen(true);
  };

  return (
    <>
      <Button type="button" size="icon-sm" variant="ghost" onClick={openDialog} aria-label="ดูรายละเอียด">
        <Eye />
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={item.deviceType?.name || "รายละเอียดอุปกรณ์"}
        description={item.systemCode}
        wide
      >
        <div className="space-y-4">
          <EquipmentDialogTabs
            value={activeTab}
            onChange={setActiveTab}
            idPrefix="equipment-details"
          />
          {equipmentDialogTabs.map((tab) => {
            const fields = equipmentDetailsFields.filter((field) => field.tab === tab.id);
            return (
              <section
                key={tab.id}
                id={getEquipmentTabPanelId(tab.id, "equipment-details")}
                role="tabpanel"
                aria-labelledby={`equipment-details-tab-${tab.id}`}
                tabIndex={0}
                hidden={activeTab !== tab.id}
                className={cn("rounded-2xl border p-3 sm:p-4", sectionStyles[tab.id])}
              >
                <h3 className="mb-3 text-sm font-semibold text-foreground">{tab.label}</h3>
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fields.map((field) => {
                    const isStatus = field.label === "สถานะ";
                    return (
                      <div
                        key={field.label}
                        className={cn(
                          "rounded-xl border bg-background/80 p-3",
                          isStatus && statusStyles[item.status],
                        )}
                      >
                        <dt className="text-xs text-muted-foreground">{field.label}</dt>
                        <dd className="mt-1 break-words text-sm font-medium">{field.getValue(item) || "-"}</dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
