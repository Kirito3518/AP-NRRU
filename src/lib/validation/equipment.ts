import { z } from "zod";

const optionalText = z.preprocess(
  (input) => {
    if (typeof input !== "string") return input ?? null;
    const value = input.trim();
    return value === "" ? null : value;
  },
  z.string().nullable(),
);

const optionalIp = z.preprocess(
  (input) => (typeof input === "string" && input.trim() === "" ? null : input),
  z
    .string()
    .refine((value) => {
      const parts = value.split(".");
      return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
    }, "รูปแบบ IP Address ไม่ถูกต้อง")
    .nullable(),
);

const optionalMac = z.preprocess(
  (input) => (typeof input === "string" && input.trim() === "" ? null : input),
  z.string().regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, "รูปแบบ MAC Address ไม่ถูกต้อง").nullable(),
);

export const equipmentStatuses = [
  "ACTIVE",
  "PROBLEM",
  "MAINTENANCE",
  "MOVED",
  "MISSING",
  "RETIRED",
] as const;

export const equipmentInputSchema = z.object({
  assetCode: optionalText.optional().default(null),
  category: optionalText.optional().default(null),
  deviceType: optionalText.optional().default(null),
  serialNumber: optionalText.optional().default(null),
  receivedYear: optionalText.optional().default(null),
  budgetSource: optionalText.optional().default(null),
  department: optionalText.optional().default(null),
  building: optionalText.optional().default(null),
  floor: optionalText.optional().default(null),
  room: optionalText.optional().default(null),
  location: optionalText.optional().default(null),
  owner: optionalText.optional().default(null),
  cpu: optionalText.optional().default(null),
  ram: optionalText.optional().default(null),
  storage: optionalText.optional().default(null),
  operatingSystem: optionalText.optional().default(null),
  ipAddress: optionalIp.optional().default(null),
  macAddress: optionalMac.optional().default(null),
  networkSpeed: optionalText.optional().default(null),
  connectionStatus: optionalText.optional().default(null),
  condition: optionalText.optional().default(null),
  approximateAge: optionalText.optional().default(null),
  problem: optionalText.optional().default(null),
  recommendation: optionalText.optional().default(null),
  note: optionalText.optional().default(null),
  status: z.enum(equipmentStatuses),
});

export type EquipmentInput = z.infer<typeof equipmentInputSchema>;
