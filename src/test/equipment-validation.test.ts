import { describe, expect, it } from "vitest";

import { equipmentInputSchema } from "@/lib/validation/equipment";

const validInput = {
  deviceType: "Wireless Access Point",
  status: "ACTIVE",
  ipAddress: "10.109.0.251",
  macAddress: "5A:AF:97:C2:69:65",
};

describe("equipmentInputSchema", () => {
  it("accepts valid optional network identifiers", () => {
    expect(equipmentInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects malformed IP and MAC addresses", () => {
    expect(equipmentInputSchema.safeParse({ ...validInput, ipAddress: "999.1.1.1" }).success).toBe(false);
    expect(equipmentInputSchema.safeParse({ ...validInput, macAddress: "not-a-mac" }).success).toBe(false);
  });

  it("normalizes blank optional fields to null", () => {
    const result = equipmentInputSchema.parse({ ...validInput, assetCode: "  " });
    expect(result.assetCode).toBeNull();
  });
});
