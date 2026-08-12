"use client";

import { cn } from "@/lib/utils";

export const equipmentDialogTabs = [
  {
    id: "general",
    label: "ข้อมูลทั่วไป",
    activeClass: "bg-violet-600 text-white shadow-sm dark:bg-violet-500",
    inactiveClass: "text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40",
  },
  {
    id: "location",
    label: "สถานที่และผู้รับผิดชอบ",
    activeClass: "bg-blue-600 text-white shadow-sm dark:bg-blue-500",
    inactiveClass: "text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40",
  },
  {
    id: "technical",
    label: "ข้อมูลทางเทคนิค",
    activeClass: "bg-cyan-600 text-white shadow-sm dark:bg-cyan-500",
    inactiveClass: "text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/40",
  },
  {
    id: "network",
    label: "ข้อมูลเครือข่าย",
    activeClass: "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500",
    inactiveClass: "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40",
  },
  {
    id: "condition",
    label: "สภาพและหมายเหตุ",
    activeClass: "bg-amber-500 text-white shadow-sm dark:bg-amber-400 dark:text-amber-950",
    inactiveClass: "text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40",
  },
] as const;

export type EquipmentDialogTabId = (typeof equipmentDialogTabs)[number]["id"];

export function getEquipmentTabPanelId(tabId: EquipmentDialogTabId, idPrefix: string) {
  return `${idPrefix}-panel-${tabId}`;
}

export function EquipmentDialogTabs({
  value,
  onChange,
  idPrefix,
  ariaLabel = "ส่วนข้อมูลอุปกรณ์",
}: {
  value: EquipmentDialogTabId;
  onChange: (value: EquipmentDialogTabId) => void;
  idPrefix: string;
  ariaLabel?: string;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1" role="tablist" aria-label={ariaLabel} aria-orientation="horizontal">
      <div className="flex min-w-max gap-1 rounded-2xl bg-muted/60 p-1">
        {equipmentDialogTabs.map((tab) => {
          const selected = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={getEquipmentTabPanelId(tab.id, idPrefix)}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm",
                selected ? tab.activeClass : tab.inactiveClass,
              )}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
