import { describe, expect, it } from "vitest";

import { equipmentSeedRows } from "@/test/fixtures/equipment-seed";

describe("equipmentSeedRows", () => {
  it("preserves all 30 populated survey records in workbook order", () => {
    expect(equipmentSeedRows).toHaveLength(30);
    expect(equipmentSeedRows.map((row) => row.systemCode)).toEqual(
      Array.from({ length: 30 }, (_, index) =>
        `NRRU-EQ-${String(index + 1).padStart(4, "0")}`,
      ),
    );
  });

  it("maps missing and problem equipment statuses from the survey", () => {
    expect(equipmentSeedRows[3].status).toBe("MISSING");
    expect(equipmentSeedRows[21].status).toBe("PROBLEM");
  });

  it("keeps duplicated source network values instead of dropping records", () => {
    expect(equipmentSeedRows.filter((row) => row.ipAddress === "10.106.110.63")).toHaveLength(13);
    expect(equipmentSeedRows.filter((row) => row.macAddress === "2C:D0:2D:DB:F3:6D")).toHaveLength(2);
  });
});
