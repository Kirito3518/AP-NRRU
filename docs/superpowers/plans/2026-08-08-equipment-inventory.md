# NRRU Equipment Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the public NRRU equipment dashboard and authenticated administrator dialog workflows, seeded with all 30 populated workbook records.

**Architecture:** Keep the application as one Next.js App Router service backed by Prisma/PostgreSQL. Public reads use server-rendered queries; client components own interactive filters and dialogs; all mutations validate input and enforce database-backed administrator sessions on the server.

**Tech Stack:** Next.js 16.3, React 19, TypeScript, Prisma 7, PostgreSQL, shadcn/ui, Recharts, Zod, bcryptjs, Vitest, Testing Library, Playwright.

## Global Constraints

- Public users can view dashboard, list, and equipment details without authentication.
- Only authenticated administrators who have changed the initial password can create, update, or soft-delete equipment.
- Create, view, edit, delete confirmation, and mandatory password change use dialogs.
- Seed exactly 30 populated rows from the supplied workbook and remain idempotent by `NRRU-EQ-0001` through `NRRU-EQ-0030`.
- Seed `admin` / `admin1234`, storing only a password hash and requiring a password change on first login.
- Preserve duplicate source IP/MAC values and optional missing asset codes.
- Use Thai user-facing text, shadcn/ui, a purple NRRU visual palette, and responsive layouts.
- Do not modify the source workbook.
- Do not add unnecessary code comments.
- Do not commit design or implementation plan files. Do not create code commits unless the user later requests them.

---

## File Structure

- `prisma/schema.prisma`: generalized equipment, session, lookup, and audit models.
- `prisma/seed.ts`: idempotent administrator, lookup, and 30-record workbook seed.
- `src/lib/auth.ts`: session creation, lookup, cookie, logout, and authorization helpers.
- `src/lib/validation/auth.ts`: login and password-change schemas.
- `src/lib/validation/equipment.ts`: equipment input normalization and validation.
- `src/lib/equipment/queries.ts`: public dashboard and list queries.
- `src/lib/equipment/mutations.ts`: authorized transactional mutations and audit writes.
- `src/app/actions/auth.ts`: login, logout, and password-change actions.
- `src/app/actions/equipment.ts`: create, edit, and soft-delete actions.
- `src/app/page.tsx`: public dashboard composition.
- `src/app/equipment/page.tsx`: public list page and query parsing.
- `src/app/login/page.tsx`: administrator login.
- `src/components/equipment/*`: table, filters, details, form, and delete dialogs.
- `src/components/auth/*`: login and mandatory password-change UI.
- `src/components/dashboard/*`: chart and recent-equipment components.
- `src/test/*`: Vitest setup and focused unit/integration tests.
- `e2e/equipment.spec.ts`: public and administrator browser flows.

### Task 1: Test Foundation and Workbook Seed Fixture

**Files:**
- Modify: `package.json`
- Modify: `prisma.config.ts`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/fixtures/equipment-seed.ts`
- Create: `src/test/equipment-seed.test.ts`

**Interfaces:**
- Produces: `equipmentSeedRows: EquipmentSeedRow[]` with exactly 30 normalized source records.
- Produces: `EquipmentSeedRow` containing every mapped source field and `systemCode`.

- [ ] Add `zod`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, and `tsx` with pnpm; add scripts `test`, `test:run`, `typecheck`, `db:seed`, and `test:e2e`.
- [ ] Read the relevant Next.js 16 guides under `node_modules/next/dist/docs/` before implementing server actions, cookies, forms, and cache revalidation.
- [ ] Create Vitest configuration using the `@` alias and jsdom setup importing `@testing-library/jest-dom/vitest`.
- [ ] Write a failing test asserting 30 rows, sequential unique system codes, row 4 mapping to `MISSING`, row 22 mapping to `PROBLEM`, and preservation of duplicated source IP/MAC values.
- [ ] Run `pnpm test:run src/test/equipment-seed.test.ts` and confirm failure because the fixture is absent.
- [ ] Create the typed fixture by transcribing rows 6–35 from the workbook, converting `-` to `null`, trimming whitespace, and mapping statuses according to the spec.
- [ ] Run the focused test and confirm all assertions pass.

### Task 2: Generalized Prisma Schema and Idempotent Seed

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `prisma/migrations/<timestamp>_equipment_inventory/migration.sql`
- Create: `src/test/seed-shape.test.ts`

**Interfaces:**
- Produces: Prisma models `Equipment`, `EquipmentHistory`, `Department`, `Building`, `DeviceType`, `User`, and `Session`.
- Consumes: `equipmentSeedRows` from `src/test/fixtures/equipment-seed.ts`.

- [ ] Write a failing schema/fixture test asserting optional `assetCode`, unique `systemCode`, soft-delete timestamp, `mustChangePassword`, session token hash, and all 23 workbook fields.
- [ ] Run the test and confirm it fails against the access-point-only schema.
- [ ] Replace `AccessPoint` with `Equipment`, add `EquipmentHistory`, extend `User` and `Session`, and retain normalized lookup relations and indexes used by list filters.
- [ ] Generate a migration with Prisma, inspect the SQL, and regenerate the client.
- [ ] Implement `prisma/seed.ts` using lookup upserts, administrator upsert with bcrypt hash, and equipment upserts keyed by `systemCode`.
- [ ] Configure the Prisma seed command and run the focused schema/fixture test.
- [ ] Start PostgreSQL from `docker-compose.yml`, apply migrations, run the seed twice, and query counts to prove both runs leave exactly 30 non-deleted equipment records and one administrator.

### Task 3: Authentication, Sessions, and Mandatory Password Change

**Files:**
- Create: `src/lib/validation/auth.ts`
- Create: `src/lib/auth.ts`
- Create: `src/app/actions/auth.ts`
- Create: `src/components/auth/login-form.tsx`
- Create: `src/components/auth/password-change-dialog.tsx`
- Create: `src/app/login/page.tsx`
- Create: `src/test/auth.test.ts`
- Modify: `src/components/navbar.tsx`

**Interfaces:**
- Produces: `getCurrentUser(): Promise<AuthUser | null>`.
- Produces: `requireAdmin(options?: { allowPasswordChangeRequired?: boolean }): Promise<AuthUser>`.
- Produces server actions `loginAction`, `logoutAction`, and `changePasswordAction` returning discriminated `ActionResult` values.

- [ ] Write failing tests for invalid credentials, token hashing, expired sessions, secure cookie options, logout, and rejection of ordinary mutations while `mustChangePassword` is true.
- [ ] Run `pnpm test:run src/test/auth.test.ts` and confirm the tests fail.
- [ ] Implement Zod schemas and auth helpers using random 32-byte opaque tokens, SHA-256 token hashes, HTTP-only same-site cookies, and database expiry checks.
- [ ] Implement login, logout, and password-change actions; password change updates the hash, clears `mustChangePassword`, and rotates the session.
- [ ] Build the Thai login form and non-dismissible password-change dialog with shadcn form controls and accessible error states.
- [ ] Update the navbar to show login for guests and administrator identity/logout for authenticated users.
- [ ] Run the focused auth tests and confirm they pass.

### Task 4: Equipment Validation, Queries, and Authorized Mutations

**Files:**
- Create: `src/lib/validation/equipment.ts`
- Create: `src/lib/equipment/queries.ts`
- Create: `src/lib/equipment/mutations.ts`
- Create: `src/app/actions/equipment.ts`
- Create: `src/test/equipment-domain.test.ts`

**Interfaces:**
- Produces: `equipmentInputSchema`, `EquipmentInput`, `EquipmentListParams`, and `ActionResult`.
- Produces: `getDashboardData()`, `getEquipmentPage(params)`, and `getEquipmentById(id)`.
- Produces: `createEquipment`, `updateEquipment`, and `softDeleteEquipment` with transactionally written audit history.

- [ ] Write failing tests for optional/unique asset codes, IP/MAC syntax, URL filter parsing, exclusion of soft-deleted records, pagination, authorization, and audit writes.
- [ ] Run the focused test and confirm failure.
- [ ] Implement normalization and Zod validation, including empty-string-to-null behavior and immutable generated system codes.
- [ ] Implement dashboard aggregation and list queries with bounded pagination, debounced-search-compatible query parameters, normalized filters, and case-insensitive search across specified fields.
- [ ] Implement authorized create/update/soft-delete mutations using Prisma transactions and revalidation of `/` and `/equipment`.
- [ ] Wrap mutations in server actions returning field errors, Thai form errors, `401`, `403`, `404`, and conflict outcomes without exposing internal messages.
- [ ] Run focused tests and confirm they pass.

### Task 5: Public Dashboard

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/status-donut.tsx`
- Modify: `src/components/stat-card.tsx`
- Create: `src/components/dashboard/distribution-chart.tsx`
- Create: `src/components/dashboard/recent-equipment.tsx`
- Create: `src/test/dashboard.test.tsx`

**Interfaces:**
- Consumes: `getDashboardData()` with status, building, type, and recent-equipment data.

- [ ] Write a failing render test asserting correct Thai headings, live status totals, chart labels, recent records, and absence of mojibake text.
- [ ] Run the focused test and confirm failure against the placeholder dashboard.
- [ ] Replace all corrupted Thai strings and placeholder sections with server-driven cards, accessible Recharts visualizations, and a recent-equipment table.
- [ ] Ensure charts have useful empty states and do not render decorative or duplicate information.
- [ ] Make the layout responsive from mobile cards through desktop chart panels.
- [ ] Run the focused dashboard test and confirm it passes.

### Task 6: Public Equipment List and Details Dialog

**Files:**
- Create: `src/app/equipment/page.tsx`
- Create: `src/components/equipment/equipment-table.tsx`
- Create: `src/components/equipment/equipment-filters.tsx`
- Create: `src/components/equipment/equipment-details-dialog.tsx`
- Create: `src/components/equipment/equipment-pagination.tsx`
- Create: `src/test/equipment-list.test.tsx`

**Interfaces:**
- Consumes: `getEquipmentPage(params)` and `getEquipmentById(id)`.
- Produces: selected-record dialog state and URL-backed filter interactions.

- [ ] Write failing tests for guest-visible rows, search/filter query synchronization, pagination preservation, detail-dialog content, empty state, and hidden administrator controls for guests.
- [ ] Run the focused test and confirm failure.
- [ ] Build shadcn table, input, select, badge, skeleton, sheet-compatible mobile row layout, and pagination components.
- [ ] Implement debounced search and filters for status, building, department, and type using URL query parameters.
- [ ] Implement a large read-only details dialog grouped into the five form sections and usable by keyboard and mobile viewport.
- [ ] Run the focused list test and confirm it passes.

### Task 7: Administrator CRUD Dialogs

**Files:**
- Create: `src/components/equipment/equipment-form.tsx`
- Create: `src/components/equipment/equipment-form-dialog.tsx`
- Create: `src/components/equipment/equipment-delete-dialog.tsx`
- Create: `src/components/equipment/equipment-actions.tsx`
- Modify: `src/components/equipment/equipment-table.tsx`
- Modify: `src/app/equipment/page.tsx`
- Create: `src/test/equipment-dialogs.test.tsx`

**Interfaces:**
- Consumes: equipment server actions and authenticated-user state.
- Produces: add/edit/delete controls visible only to eligible administrators.

- [ ] Write failing tests for dialog opening, five form sections, field errors, double-submit prevention, dirty-close warning, successful refresh/close, edit prefill, and destructive confirmation.
- [ ] Run the focused test and confirm failure.
- [ ] Build a reusable shadcn form with accessible labels, responsive sections, lookup selects, status select, and server/field error rendering.
- [ ] Build create and edit dialogs sharing the form while preserving immutable system code behavior.
- [ ] Add unsaved-change interception and pending-state controls without preventing successful post-submit close.
- [ ] Build `AlertDialog` soft-delete confirmation and show all administrator actions only when the session permits mutation.
- [ ] Run focused dialog tests and confirm they pass.

### Task 8: Global Styling, Error States, and Navigation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/navbar.tsx`
- Create: `src/app/loading.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Modify: shadcn files under `src/components/ui/` only as generated or required.

**Interfaces:**
- Produces: consistent NRRU shell, typography, responsive navigation, toast/error presentation, and route states.

- [ ] Install required shadcn components through its CLI, including dialog, alert-dialog, select, label, textarea, form, skeleton, separator, tabs or accordion, and sonner.
- [ ] Define the purple NRRU color tokens, Thai-capable typography, focus states, table density, and responsive content widths.
- [ ] Complete navbar routes and mobile navigation while preserving public access.
- [ ] Add Thai loading, error, not-found, empty, and retry experiences without leaking server errors.
- [ ] Run `pnpm lint`, `pnpm typecheck`, and all unit/integration tests; fix every introduced failure.

### Task 9: Browser Verification and Completion Audit

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/equipment.spec.ts`
- Modify: project files only when browser verification exposes a defect.

**Interfaces:**
- Verifies the complete public and administrator workflows against migrated, seeded PostgreSQL.

- [ ] Write browser tests proving guests can view dashboard/list/details but see no mutation controls and direct mutation attempts are rejected.
- [ ] Write browser tests for `admin` login, mandatory first password change, session persistence, create dialog, edit dialog, soft-delete confirmation, logout, search, filters, pagination, and mobile viewport behavior.
- [ ] Run the application against a freshly migrated database and execute the browser suite.
- [ ] Reconcile database evidence: exactly 30 initial non-deleted equipment rows, sequential codes, one missing row, one problem row, and representative source values matching workbook rows 1, 4, 22, and 30.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, and `pnpm build` from a clean process and preserve the final outputs as completion evidence.
- [ ] Inspect desktop and mobile screenshots for clipping, mojibake, inaccessible dialogs, broken charts, and overflow; fix material defects and rerun affected checks.
- [ ] Review `git diff` to ensure source workbook and unrelated user changes remain untouched and no unnecessary code comments were added.

## Plan Self-Review

- Every design-spec requirement maps to at least one task.
- Authentication gates are verified at both UI and server boundaries.
- Workbook count, source fidelity, and idempotence have explicit tests and database reconciliation.
- Public dashboard, list, detail, dialog CRUD, errors, responsive behavior, and final build all have verification steps.
- Shared interfaces are defined before consumers and names remain consistent across tasks.
