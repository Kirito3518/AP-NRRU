import { equipmentStatuses } from "@/lib/validation/equipment";

export type EquipmentListParams = {
  page: number;
  pageSize: number;
  q: string;
  status: string;
  building: string;
  department: string;
  deviceType: string;
};

type RawParams = Record<string, string | string[] | undefined>;

function text(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeEquipmentListParams(input: RawParams): EquipmentListParams {
  const page = Number.parseInt(text(input.page), 10);
  const status = text(input.status);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    q: text(input.q),
    status: equipmentStatuses.includes(status as (typeof equipmentStatuses)[number]) ? status : "",
    building: text(input.building),
    department: text(input.department),
    deviceType: text(input.deviceType),
  };
}
