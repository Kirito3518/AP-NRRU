import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { EquipmentListParams } from "@/lib/equipment/list-params";

const includeRelations = { department: true, building: true, deviceType: true, owner: true } as const;

export async function getDashboardData() {
  const equipment = await prisma.equipment.findMany({ where: { deletedAt: null }, include: includeRelations, orderBy: { createdAt: "desc" } });
  const statusCounts = Object.fromEntries(["ACTIVE", "PROBLEM", "MAINTENANCE", "MOVED", "MISSING", "RETIRED"].map((status) => [status, equipment.filter((item) => item.status === status).length]));
  const countBy = (values: (string | undefined)[]) => Object.entries(values.reduce<Record<string, number>>((result, value) => {
    const key = value || "ไม่ระบุ";
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  return {
    total: equipment.length,
    statusCounts,
    byBuilding: countBy(equipment.map((item) => item.building?.name)),
    byType: countBy(equipment.map((item) => item.deviceType?.name)),
    recent: equipment.slice(0, 5),
  };
}

export async function getEquipmentPage(params: EquipmentListParams) {
  const where: Prisma.EquipmentWhereInput = {
    deletedAt: null,
    ...(params.status ? { status: params.status as Prisma.EnumEquipmentStatusFilter["equals"] } : {}),
    ...(params.building ? { building: { name: params.building } } : {}),
    ...(params.department ? { department: { name: params.department } } : {}),
    ...(params.deviceType ? { deviceType: { name: params.deviceType } } : {}),
    ...(params.q ? { OR: [
      { systemCode: { contains: params.q, mode: "insensitive" as const } },
      { assetCode: { contains: params.q, mode: "insensitive" as const } },
      { serialNumber: { contains: params.q, mode: "insensitive" as const } },
      { ipAddress: { contains: params.q, mode: "insensitive" as const } },
      { macAddress: { contains: params.q, mode: "insensitive" as const } },
      { deviceType: { name: { contains: params.q, mode: "insensitive" } } },
      { department: { name: { contains: params.q, mode: "insensitive" } } },
      { building: { name: { contains: params.q, mode: "insensitive" } } },
    ] } : {}),
  };
  const [items, total, buildings, departments, deviceTypes] = await Promise.all([
    prisma.equipment.findMany({ where, include: includeRelations, orderBy: { systemCode: "asc" }, skip: (params.page - 1) * params.pageSize, take: params.pageSize }),
    prisma.equipment.count({ where }),
    prisma.building.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.deviceType.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { items, total, pageCount: Math.max(1, Math.ceil(total / params.pageSize)), buildings, departments, deviceTypes };
}
