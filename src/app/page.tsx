import Link from "next/link";
import { AlertTriangle, Boxes, CircleCheck, MapPinOff, Wrench } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { StatCard } from "@/components/stat-card";
import { StatusDonut } from "@/components/status-donut";
import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { PasswordChangeDialog } from "@/components/auth/password-change-dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/equipment/queries";

const statusLabel = { ACTIVE: "ใช้งาน", PROBLEM: "มีปัญหา", MAINTENANCE: "ซ่อมบำรุง", MOVED: "ย้ายจุด", MISSING: "สูญหาย", RETIRED: "จำหน่าย" } as const;

export default async function HomePage() {
  const [data, user] = await Promise.all([getDashboardData(), getCurrentUser()]);
  return <>
    <Navbar />
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-medium text-primary">NRRU Equipment Inventory</p><h2 className="text-2xl font-semibold">ภาพรวมครุภัณฑ์และอุปกรณ์เครือข่าย</h2><p className="text-sm text-muted-foreground">ข้อมูลจากการสำรวจล่าสุดของมหาวิทยาลัยราชภัฏนครราชสีมา</p></div><Link href="/equipment" className={buttonVariants()}>ดูรายการทั้งหมด</Link></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard title="ทั้งหมด" value={data.total} description="รายการในระบบ" icon={Boxes} iconBg="bg-purple-100" iconColor="text-purple-700" />
        <StatCard title="ใช้งาน" value={data.statusCounts.ACTIVE} icon={CircleCheck} iconBg="bg-green-100" iconColor="text-green-700" />
        <StatCard title="มีปัญหา" value={data.statusCounts.PROBLEM} icon={AlertTriangle} iconBg="bg-red-100" iconColor="text-red-700" />
        <StatCard title="ซ่อมบำรุง" value={data.statusCounts.MAINTENANCE} icon={Wrench} iconBg="bg-amber-100" iconColor="text-amber-700" />
        <StatCard title="สูญหาย" value={data.statusCounts.MISSING} icon={MapPinOff} iconBg="bg-stone-100" iconColor="text-stone-600" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><Card className="p-5"><h3 className="text-sm font-semibold">จำนวนตามประเภทอุปกรณ์</h3><DistributionChart data={data.byType} /></Card><StatusDonut total={data.total} active={data.statusCounts.ACTIVE} problem={data.statusCounts.PROBLEM} maintenance={data.statusCounts.MAINTENANCE} missing={data.statusCounts.MISSING} /></div>
      <div className="grid gap-4 lg:grid-cols-2"><Card className="p-5"><h3 className="mb-3 text-sm font-semibold">จำนวนตามอาคาร</h3><DistributionChart data={data.byBuilding} /></Card><Card className="p-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">รายการล่าสุด</h3><Link href="/equipment" className="text-sm text-primary hover:underline">ดูทั้งหมด</Link></div><div className="space-y-2">{data.recent.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.deviceType?.name || "ไม่ระบุประเภท"}</p><p className="text-xs text-muted-foreground">{item.systemCode} · {item.building?.name || "ไม่ระบุอาคาร"}</p></div><Badge variant={item.status === "PROBLEM" || item.status === "MISSING" ? "destructive" : "secondary"}>{statusLabel[item.status]}</Badge></div>)}</div></Card></div>
    </main>
    {user?.mustChangePassword ? <PasswordChangeDialog /> : null}
  </>;
}
