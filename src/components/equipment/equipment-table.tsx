import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EquipmentDetailsDialog } from "@/components/equipment/equipment-details-dialog";
import { EquipmentFormDialog } from "@/components/equipment/equipment-form-dialog";
import { EquipmentDeleteDialog } from "@/components/equipment/equipment-delete-dialog";
import type { EquipmentView } from "@/components/equipment/types";
import { statusLabels } from "@/components/equipment/types";
import { cn } from "@/lib/utils";

export const equipmentStatusStyles: Record<EquipmentView["status"], string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  PROBLEM: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  MAINTENANCE: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  MOVED: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200",
  MISSING: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
  RETIRED: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
};

const equipmentStatusRowStyles: Record<EquipmentView["status"], string> = {
  ACTIVE: "border-l-2 border-l-emerald-400",
  PROBLEM: "border-l-2 border-l-amber-400",
  MAINTENANCE: "border-l-2 border-l-sky-400",
  MOVED: "border-l-2 border-l-violet-400",
  MISSING: "border-l-2 border-l-rose-400",
  RETIRED: "border-l-2 border-l-slate-400",
};

export function EquipmentTable({ items, canManage }: { items: EquipmentView[]; canManage: boolean }) {
  if (!items.length) {
    return <Card className="grid min-h-56 place-items-center border-primary/15 bg-gradient-to-br from-primary/[0.04] to-card p-6 text-sm text-muted-foreground">ไม่พบรายการที่ตรงกับเงื่อนไข</Card>;
  }

  return (
    <Card className="overflow-hidden border-primary/15 shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/[0.035] hover:bg-primary/[0.05]">
              <TableHead>รหัสระบบ</TableHead>
              <TableHead>ประเภทอุปกรณ์</TableHead>
              <TableHead>สถานที่</TableHead>
              <TableHead>IP / MAC</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={cn("transition-colors hover:bg-primary/[0.035]", equipmentStatusRowStyles[item.status])}
              >
                <TableCell className="font-medium">{item.systemCode}</TableCell>
                <TableCell>
                  <div className="max-w-72">
                    <p className="font-medium">{item.deviceType?.name || "ไม่ระบุ"}</p>
                    <p className="text-xs text-muted-foreground">{item.serialNumber || "ไม่มี Serial Number"}</p>
                  </div>
                </TableCell>
                <TableCell>{item.building?.name || "-"} {item.floor ? `ชั้น ${item.floor}` : ""}</TableCell>
                <TableCell>
                  <p>{item.ipAddress || "-"}</p>
                  <p className="text-xs text-muted-foreground">{item.macAddress || "-"}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-semibold", equipmentStatusStyles[item.status])}>
                    {statusLabels[item.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <EquipmentDetailsDialog item={item} />
                    {canManage ? <><EquipmentFormDialog item={item} /><EquipmentDeleteDialog id={item.id} systemCode={item.systemCode} /></> : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
