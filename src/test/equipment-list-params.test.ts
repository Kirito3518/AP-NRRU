import { describe, expect, it } from "vitest";
import { normalizeEquipmentListParams } from "@/lib/equipment/list-params";

describe("normalizeEquipmentListParams", () => {
  it("bounds invalid pages and keeps supported filters", () => {
    expect(normalizeEquipmentListParams({ page: "-4", status: "PROBLEM", q: "  cisco  " })).toEqual({
      page: 1,
      pageSize: 10,
      q: "cisco",
      status: "PROBLEM",
      building: "",
      department: "",
      deviceType: "",
    });
  });

  it("drops unsupported statuses", () => {
    expect(normalizeEquipmentListParams({ status: "BROKEN" }).status).toBe("");
  });
});
