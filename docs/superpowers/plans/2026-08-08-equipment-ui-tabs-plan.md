# Equipment UI Colors and Dialog Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with checkpoints.

**Goal:** Add restrained color accents to `/equipment` and split the equipment details and create/edit dialogs into accessible tabs without changing data or permissions.

**Architecture:** Add one small client-side tab control with a shared five-tab definition. The details dialog and form dialog will own their active tab state and render shared tab IDs; the form will keep every panel mounted and toggle `hidden` so uncontrolled inputs, validation, and unsaved-change state survive tab changes. Page and table colors will use literal Tailwind classes mapped to equipment status.

**Tech Stack:** Next.js App Router, React client components, Tailwind CSS v4, existing shadcn-style Button/Card/Badge/Modal components, Vitest, TypeScript.

## Global Constraints

- Keep the existing server actions, field names, validation, authorization, and database behavior unchanged.
- Public users can view equipment; only authenticated administrators can create, update, or delete it.
- Use the existing purple NRRU palette; reserve green, amber, red, and slate for operational status meaning.
- Do not add a new dependency or replace the existing modal shell.
- Keep delete confirmation and mandatory password-change dialogs single-purpose without tabs.
- Do not commit the plan or implementation changes unless explicitly requested.
- Do not add inline code comments.

---

### Task 1: Add the shared accessible equipment tab control

**Files:**
- Create: `src/components/equipment/equipment-dialog-tabs.tsx`
- Create: `src/test/equipment-dialog-tabs.test.tsx`

**Interfaces:**
- Produces `equipmentDialogTabs`, `EquipmentDialogTabId`, `getEquipmentTabPanelId(tabId, idPrefix)`, and `EquipmentDialogTabs({ value, onChange, idPrefix, ariaLabel })`.
- `EquipmentDialogTabs` renders a horizontally scrollable `role="tablist"` containing five `button[role="tab"]` elements, with `aria-selected`, `aria-controls`, and stable IDs.

- [ ] **Step 1: Write the failing test**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  EquipmentDialogTabs,
  equipmentDialogTabs,
  getEquipmentTabPanelId,
} from "@/components/equipment/equipment-dialog-tabs";

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
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx`

Expected: FAIL because `src/components/equipment/equipment-dialog-tabs.tsx` does not exist.

- [ ] **Step 3: Write the minimal implementation**

Create the tab definition with IDs `general`, `location`, `technical`, `network`, and `condition`. Give each tab a literal active color class, render the tab list with `overflow-x-auto`, and use `cn` only to combine static and active classes. Set `aria-selected={value === tab.id}`, `aria-controls={getEquipmentTabPanelId(tab.id, idPrefix)}`, and `id={`${idPrefix}-tab-${tab.id}`}`. Keep the tab buttons `type="button"` so they never submit the equipment form.

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx`

Expected: PASS with two tests.

### Task 2: Split the read-only details dialog into tabs

**Files:**
- Modify: `src/components/equipment/equipment-details-dialog.tsx`

**Interfaces:**
- Consumes `EquipmentDialogTabs`, `EquipmentDialogTabId`, and `getEquipmentTabPanelId` from Task 1.
- Produces a read-only dialog with five panels; switching tabs changes only the visible panel and keeps the current equipment item unchanged.

- [ ] **Step 1: Write the failing test**

Extend `src/test/equipment-dialog-tabs.test.tsx` with a pure grouping assertion exported by the details module:

```tsx
import { equipmentDetailsFields } from "@/components/equipment/equipment-details-dialog";

it("assigns every details field to exactly one shared tab", () => {
  expect(equipmentDetailsFields).toHaveLength(25);
  expect(new Set(equipmentDetailsFields.map((field) => field.tab)).size).toBe(5);
  expect(equipmentDetailsFields.filter((field) => field.tab === "network")).toHaveLength(4);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx`

Expected: FAIL because the details field metadata is currently a flat, unexported tuple list without tab IDs.

- [ ] **Step 3: Implement the tabbed read-only dialog**

Export `equipmentDetailsFields` as objects with `tab`, `label`, and `getValue`, preserving all 25 existing fields. Add `activeTab` state initialized to `general`, render `EquipmentDialogTabs`, and render one `role="tabpanel"` per tab with `hidden={activeTab !== tab.id}` so every field remains mounted. Add `aria-labelledby` and `tabIndex={0}` to each panel. Keep the existing `Modal`, Eye button, item values, and close behavior. Apply a light per-section accent border/background to detail cards and stronger status coloring for the status value.

- [ ] **Step 4: Run the focused test**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx`

Expected: PASS, including the five-tab field grouping assertion.

### Task 3: Split the create/edit form into tabs without losing input state

**Files:**
- Modify: `src/components/equipment/equipment-form-dialog.tsx`

**Interfaces:**
- Consumes the shared tab IDs/control from Task 1.
- Keeps `createEquipmentAction`, `updateEquipmentAction`, `useActionState`, dirty-close confirmation, field errors, pending lock, and router refresh unchanged.

- [ ] **Step 1: Write the failing test**

Add a form grouping assertion to `src/test/equipment-dialog-tabs.test.tsx` by exporting the existing form metadata with tab IDs:

```tsx
import { equipmentFormFields } from "@/components/equipment/equipment-form-dialog";

it("assigns every editable field to one of the five tabs", () => {
  const fields = equipmentFormFields.flatMap((section) => section.fields);
  expect(fields.length).toBe(25);
  expect(new Set(equipmentFormFields.map((section) => section.id))).toEqual(
    new Set(["general", "location", "technical", "network", "condition"]),
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx`

Expected: FAIL because the form section metadata currently has titles only and is not exported with shared tab IDs.

- [ ] **Step 3: Implement the tabbed form**

Add `id` to each form section and export it as `equipmentFormFields`. Add `activeTab` state reset to `general` whenever the dialog opens. Render the shared tab control above the form panels. Keep all five fieldsets mounted and set `hidden={section.id !== activeTab}` so browser form controls retain typed values across tabs and all fields are still submitted. Put the status selector in the general panel, keep error messages next to their fields, add matching panel ARIA attributes, and preserve the existing dirty state and pending close behavior. Add section-specific border/background accents that match the shared tab colors.

- [ ] **Step 4: Run focused tests and static checks**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx && pnpm lint && pnpm typecheck`

Expected: PASS with no lint or type errors.

### Task 4: Add color hierarchy to the equipment page and table

**Files:**
- Modify: `src/app/equipment/page.tsx`
- Modify: `src/components/equipment/equipment-table.tsx`

**Interfaces:**
- No data or query changes; the page continues to use `getEquipmentPage`, URL filters, and `EquipmentTable` exactly as before.

- [ ] **Step 1: Write the failing test**

Add a small exported status-style map in `src/components/equipment/equipment-table.tsx` and test it in `src/test/equipment-dialog-tabs.test.tsx`:

```tsx
import { equipmentStatusStyles } from "@/components/equipment/equipment-table";

it("keeps operational status colors distinct", () => {
  expect(equipmentStatusStyles.ACTIVE).toContain("emerald");
  expect(equipmentStatusStyles.PROBLEM).toContain("amber");
  expect(equipmentStatusStyles.MISSING).toContain("rose");
  expect(equipmentStatusStyles.RETIRED).toContain("slate");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx`

Expected: FAIL because the table currently chooses only Badge variants and has no status-style map.

- [ ] **Step 3: Implement the page accents**

Export a literal `equipmentStatusStyles` map, apply it to Badge class names, and add a matching subtle left row accent plus `hover:bg-primary/[0.03]`. Give the equipment page heading a rounded soft-purple gradient block, make the filter card border/focus states use primary tints, and keep controls readable in light and dark themes. Do not change status labels, filter names, links, or table columns.

- [ ] **Step 4: Run focused tests**

Run: `pnpm vitest run src/test/equipment-dialog-tabs.test.tsx`

Expected: PASS with all tab/grouping/color assertions.

### Task 5: Verify the complete UI change

**Files:**
- No additional source files.

- [ ] **Step 1: Run the full automated suite**

Run: `pnpm test:run`

Expected: all existing tests plus the new equipment UI metadata tests pass.

- [ ] **Step 2: Run production checks**

Run: `pnpm lint && pnpm typecheck && pnpm build && git diff --check`

Expected: all commands exit successfully.

- [ ] **Step 3: Manually verify the public equipment page**

Open `/equipment` at desktop and 390px mobile widths. Confirm the purple header/filter accents, readable status colors, responsive table overflow, and absence of edit/delete controls for guests.

- [ ] **Step 4: Manually verify both tabbed dialogs**

As an administrator, open a details dialog and confirm all five tabs switch correctly. Open create/edit, type into a field, switch tabs, return, and confirm the value remains; trigger a validation error and confirm it remains visible on the relevant tab. Confirm pending submission, close confirmation, and successful refresh still work.

- [ ] **Step 5: Report the verification evidence**

Summarize changed files and the exact passing commands. Do not commit unless the user later requests it.
