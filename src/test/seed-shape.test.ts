import { describe, expect, it } from "vitest";

import { equipmentSeedRows } from "@/test/fixtures/equipment-seed";

describe("equipment seed shape", () => {
  it("keeps optional asset identifiers separate from generated system codes", () => {
    expect(equipmentSeedRows.every((row) => row.systemCode.startsWith("NRRU-EQ-"))).toBe(true);
    expect(equipmentSeedRows.every((row) => !("assetCode" in row))).toBe(true);
  });

  it("preserves every workbook survey field needed by the equipment model", () => {
    expect(Object.keys(equipmentSeedRows[0])).toEqual(
      expect.arrayContaining([
        "department",
        "building",
        "floor",
        "location",
        "category",
        "deviceType",
        "serialNumber",
        "receivedYear",
        "budgetSource",
        "owner",
        "cpu",
        "ram",
        "storage",
        "operatingSystem",
        "ipAddress",
        "macAddress",
        "networkSpeed",
        "connectionStatus",
        "condition",
        "approximateAge",
        "problem",
        "note",
      ]),
    );
  });
});
