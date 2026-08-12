"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { equipmentInputSchema } from "@/lib/validation/equipment";

export type EquipmentActionState = { success?: boolean; error?: string; fieldErrors?: Record<string, string[]> };

async function lookupIds(data: ReturnType<typeof equipmentInputSchema.parse>) {
  const [department, building, deviceType, owner] = await Promise.all([
    data.department ? prisma.department.upsert({ where: { name: data.department }, update: {}, create: { name: data.department } }) : null,
    data.building ? prisma.building.upsert({ where: { name: data.building }, update: {}, create: { name: data.building } }) : null,
    data.deviceType ? prisma.deviceType.upsert({ where: { name: data.deviceType }, update: {}, create: { name: data.deviceType } }) : null,
    data.owner ? prisma.owner.upsert({ where: { name: data.owner }, update: {}, create: { name: data.owner } }) : null,
  ]);
  return { departmentId: department?.id ?? null, buildingId: building?.id ?? null, deviceTypeId: deviceType?.id ?? null, ownerId: owner?.id ?? null };
}

function mutationData(data: ReturnType<typeof equipmentInputSchema.parse>) {
  return {
    assetCode: data.assetCode,
    category: data.category,
    serialNumber: data.serialNumber,
    receivedYear: data.receivedYear,
    budgetSource: data.budgetSource,
    cpu: data.cpu,
    ram: data.ram,
    storage: data.storage,
    operatingSystem: data.operatingSystem,
    ipAddress: data.ipAddress,
    macAddress: data.macAddress,
    networkSpeed: data.networkSpeed,
    connectionStatus: data.connectionStatus,
    floor: data.floor,
    room: data.room,
    location: data.location,
    condition: data.condition,
    approximateAge: data.approximateAge,
    problem: data.problem,
    recommendation: data.recommendation,
    note: data.note,
    status: data.status,
  };
}

function parseForm(formData: FormData) {
  return equipmentInputSchema.safeParse(Object.fromEntries(formData));
}

export async function createEquipmentAction(_: EquipmentActionState, formData: FormData): Promise<EquipmentActionState> {
  try {
    const user = await requireAdmin();
    const parsed = parseForm(formData);
    if (!parsed.success) return { error: "กรุณาตรวจสอบข้อมูล", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    const last = await prisma.equipment.findFirst({ orderBy: { systemCode: "desc" }, select: { systemCode: true } });
    const next = Number(last?.systemCode.split("-").at(-1) || 0) + 1;
    const relations = await lookupIds(parsed.data);
    await prisma.equipment.create({ data: { systemCode: `NRRU-EQ-${String(next).padStart(4, "0")}`, ...mutationData(parsed.data), ...relations, updatedById: user.id, histories: { create: { action: "CREATED", userId: user.id } } } });
    revalidatePath("/"); revalidatePath("/equipment");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error && error.message === "PASSWORD_CHANGE_REQUIRED" ? "กรุณาเปลี่ยนรหัสผ่านก่อน" : "ไม่สามารถเพิ่มข้อมูลได้" };
  }
}

export async function updateEquipmentAction(id: string, _: EquipmentActionState, formData: FormData): Promise<EquipmentActionState> {
  try {
    const user = await requireAdmin();
    const parsed = parseForm(formData);
    if (!parsed.success) return { error: "กรุณาตรวจสอบข้อมูล", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    const relations = await lookupIds(parsed.data);
    await prisma.equipment.update({ where: { id, deletedAt: null }, data: { ...mutationData(parsed.data), ...relations, updatedById: user.id, histories: { create: { action: "UPDATED", userId: user.id } } } });
    revalidatePath("/"); revalidatePath("/equipment");
    return { success: true };
  } catch { return { error: "ไม่สามารถแก้ไขข้อมูลได้" }; }
}

export async function deleteEquipmentAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await prisma.equipment.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date(), updatedById: user.id, histories: { create: { action: "DELETED", userId: user.id } } } });
  revalidatePath("/"); revalidatePath("/equipment");
}
