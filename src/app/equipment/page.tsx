import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { EquipmentTable } from "@/components/equipment/equipment-table";
import { EquipmentFormDialog } from "@/components/equipment/equipment-form-dialog";
import { PasswordChangeDialog } from "@/components/auth/password-change-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth";
import { normalizeEquipmentListParams } from "@/lib/equipment/list-params";
import { getEquipmentPage } from "@/lib/equipment/queries";

export default async function EquipmentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const params = normalizeEquipmentListParams(raw);
  const [data, user] = await Promise.all([getEquipmentPage(params), getCurrentUser()]);
  const canManage = Boolean(user && !user.mustChangePassword);
  const pageUrl = (page: number) => {
    const query = new URLSearchParams();
    Object.entries({ q: params.q, status: params.status, building: params.building, department: params.department, deviceType: params.deviceType }).forEach(([key, value]) => value && query.set(key, value));
    query.set("page", String(page));
    return `/equipment?${query}`;
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
        <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-violet-50/70 to-card p-5 shadow-sm dark:via-violet-950/30">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-wide text-primary">Equipment Registry</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">รายการครุภัณฑ์และอุปกรณ์</h1>
              <p className="mt-1 text-sm text-muted-foreground">ทั้งหมด {data.total} รายการ</p>
            </div>
            {canManage ? <EquipmentFormDialog /> : null}
          </div>
        </section>

        <form className="grid gap-3 rounded-2xl border border-primary/15 bg-card/95 p-4 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          <Input
            name="q"
            defaultValue={params.q}
            placeholder="ค้นหารหัส รุ่น IP หรือ MAC"
            className="border-primary/15 bg-background/80 focus-visible:border-primary/50 focus-visible:ring-primary/20 lg:col-span-2"
          />
          <select name="status" defaultValue={params.status} className="h-9 rounded-xl border border-primary/15 bg-background/80 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
            <option value="">ทุกสถานะ</option>
            <option value="ACTIVE">ใช้งาน</option>
            <option value="PROBLEM">มีปัญหา</option>
            <option value="MAINTENANCE">ซ่อมบำรุง</option>
            <option value="MOVED">ย้ายจุด</option>
            <option value="MISSING">สูญหาย</option>
            <option value="RETIRED">จำหน่าย</option>
          </select>
          <select name="building" defaultValue={params.building} className="h-9 rounded-xl border border-primary/15 bg-background/80 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
            <option value="">ทุกอาคาร</option>
            {data.buildings.map((item) => <option key={item.id}>{item.name}</option>)}
          </select>
          <select name="department" defaultValue={params.department} className="h-9 rounded-xl border border-primary/15 bg-background/80 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
            <option value="">ทุกหน่วยงาน</option>
            {data.departments.map((item) => <option key={item.id}>{item.name}</option>)}
          </select>
          <select name="deviceType" defaultValue={params.deviceType} className="h-9 rounded-xl border border-primary/15 bg-background/80 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
            <option value="">ทุกประเภทอุปกรณ์</option>
            {data.deviceTypes.map((item) => <option key={item.id}>{item.name}</option>)}
          </select>
          <Button type="submit" className="shadow-sm">ค้นหาและกรอง</Button>
          <Link href="/equipment" className={buttonVariants({ variant: "outline" })}>ล้างตัวกรอง</Link>
        </form>

        <EquipmentTable items={data.items} canManage={canManage} />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">หน้า {params.page} จาก {data.pageCount}</p>
          <div className="flex gap-2">
            <Link aria-disabled={params.page <= 1} className={`${buttonVariants({ variant: "outline", size: "sm" })} border-primary/15 ${params.page <= 1 ? "pointer-events-none opacity-50" : ""}`} href={pageUrl(params.page - 1)}>ก่อนหน้า</Link>
            <Link aria-disabled={params.page >= data.pageCount} className={`${buttonVariants({ variant: "outline", size: "sm" })} border-primary/15 ${params.page >= data.pageCount ? "pointer-events-none opacity-50" : ""}`} href={pageUrl(params.page + 1)}>ถัดไป</Link>
          </div>
        </div>
      </main>
      {user?.mustChangePassword ? <PasswordChangeDialog /> : null}
    </>
  );
}
