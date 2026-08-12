import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  EquipmentDialogTabs,
  equipmentDialogTabs,
  getEquipmentTabPanelId,
} from "@/components/equipment/equipment-dialog-tabs";
import { equipmentDetailsFields } from "@/components/equipment/equipment-details-dialog";
import { equipmentFormFields } from "@/components/equipment/equipment-form-dialog";
import { equipmentStatusStyles } from "@/components/equipment/equipment-table";

describe("equipment dialog tabs", () => {
  it("defines the five shared equipment sections in order", () => {
    expect(equipmentDialogTabs.map((tab) => tab.id)).toEqual([
      "general",
      "location",
      "technical",
      "network",
      "condition",
    ]);
  });

  it("renders one active accessible tab and stable panel IDs", () => {
    const html = renderToStaticMarkup(
      <EquipmentDialogTabs
        value="network"
        onChange={vi.fn()}
        idPrefix="equipment-details"
      />,
    );
    expect((html.match(/role="tab"/g) ?? []).length).toBe(5);
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-controls="equipment-details-panel-network"');
    expect(getEquipmentTabPanelId("condition", "equipment-form")).toBe(
      "equipment-form-panel-condition",
    );
  });

  it("assigns every details field to exactly one shared tab", () => {
    expect(equipmentDetailsFields).toHaveLength(25);
    expect(new Set(equipmentDetailsFields.map((field) => field.tab)).size).toBe(5);
    expect(equipmentDetailsFields.filter((field) => field.tab === "network")).toHaveLength(4);
  });

  it("assigns every editable field to one of the five tabs", () => {
    const fieldCount = equipmentFormFields.reduce((total, section) => total + section.fields.length, 0);
    expect(fieldCount).toBe(25);
    expect(new Set(equipmentFormFields.map((section) => section.id))).toEqual(
      new Set(["general", "location", "technical", "network", "condition"]),
    );
  });

  it("keeps operational status colors distinct", () => {
    expect(equipmentStatusStyles.ACTIVE).toContain("emerald");
    expect(equipmentStatusStyles.PROBLEM).toContain("amber");
    expect(equipmentStatusStyles.MISSING).toContain("rose");
    expect(equipmentStatusStyles.RETIRED).toContain("slate");
  });
});
