# NRRU Equipment Inventory System Design

## Objective

Complete the existing NRRU equipment inventory web application and seed it from `ใบงานสำรวจครุภัณฑ์และอุปกรณ์เครือข่าย_NRRU(ปรับปรุง).xlsx`. Public users can view dashboards, lists, and equipment details. Only authenticated administrators can create, update, or delete records.

## Scope

The application will provide:

- A public dashboard driven by live database data.
- A public, searchable, filterable, paginated equipment list.
- A public equipment-detail dialog.
- Administrator login and database-backed sessions.
- Administrator-only create, edit, and delete actions presented through dialogs.
- A mandatory password-change dialog on first login.
- Idempotent seed data containing all 30 populated survey rows from the source workbook.
- Thai user-facing text, responsive layouts, loading/empty/error states, and accessible shadcn/ui components.

Importing or editing Excel files at runtime, multiple administrator roles, and restoring deleted records through the UI are outside the current scope.

## Architecture

The system remains a single Next.js App Router application backed by Prisma and PostgreSQL. Server Components perform public reads where practical. Server Actions or route handlers perform mutations, with authentication and authorization enforced on the server. Client Components are limited to interactive tables, filters, charts, dialogs, forms, and notifications.

Primary routes:

- `/`: public dashboard with status summaries, type/building charts, and recent equipment.
- `/equipment`: public equipment list with search, filters, pagination, and dialogs.
- `/login`: administrator login page with safe redirect handling.

Create, edit, view, delete-confirmation, and first-login password change are dialogs. Dedicated create/edit pages are not required.

## User Interface

The interface uses shadcn/ui and may install additional shadcn components as needed. The visual language follows the purple palette in the NRRU workbook and remains responsive on desktop and mobile.

The equipment form is divided into compact sections:

1. General information
2. Location and responsibility
3. Technical specifications
4. Network information
5. Condition, problems, and notes

Public users see view controls only. Authenticated administrators additionally see add, edit, and delete controls. Destructive deletion uses `AlertDialog`. Forms prevent duplicate submissions and warn before closing when unsaved changes exist.

## Data Model

The existing access-point-specific model will be generalized to `Equipment`. Each record contains:

- A generated unique system code such as `NRRU-EQ-0001`.
- Optional asset code and serial number.
- Department, building, floor, room/installation point, and responsible owner.
- Category and equipment/device type.
- Received year and budget source.
- CPU, RAM, storage, operating system or firmware.
- IP address, MAC address, network ports or speed, and connection status.
- Operational condition, approximate age, problem or requirement, recommendation, and notes.
- Normalized application status.
- Creation/update timestamps, last editor, and soft-deletion timestamp.

`Department`, `Building`, and `DeviceType` remain normalized lookup tables. Equipment history records capture material create, update, and delete events with the administrator and timestamp.

The administrator model includes `mustChangePassword`. Sessions use random opaque tokens; only token hashes are stored in the database. Authentication cookies are HTTP-only, same-site, secure in production, and expire server-side.

## Workbook Mapping and Seed Rules

The authoritative data source is rows 6–35 of the `แบบสำรวจครุภัณฑ์` worksheet: 30 populated survey records under the 23-column header in row 5. Blank template rows are not imported. The source workbook itself is never modified.

Mapping rules:

- Whitespace is trimmed while meaningful Thai text is preserved.
- `-` is treated as a missing value except where it is meaningful free-form content.
- The generated system code follows workbook order: `NRRU-EQ-0001` through `NRRU-EQ-0030`.
- Missing asset codes are allowed and do not participate in uniqueness checks.
- Duplicate IP or MAC values in the source are preserved because the workbook is authoritative; the UI may flag them but seed must not discard records.
- Connection status `ปกติ` maps to application status `ACTIVE`.
- Weak signal, `แย่`, or another explicit operational problem maps to `PROBLEM`.
- A row whose problem states `อุปกรณ์สูญหาย` maps to `MISSING`, even when device details are absent.
- Other supported administrator-selectable statuses are `MAINTENANCE`, `MOVED`, and `RETIRED`.

The seed is idempotent by generated system code. Re-running it updates the seeded records and lookup values without creating duplicates. It also creates administrator `admin` with initial password `admin1234` and `mustChangePassword = true`. The initial password is hashed and never stored as plaintext.

## Authorization and Data Flow

Public reads do not require a session. Every mutation independently verifies a valid, unexpired administrator session on the server. Hiding controls is only a presentation detail and is not relied upon for security.

Mutation flow:

1. The dialog submits structured form data.
2. Server-side schema validation checks required fields and IP/MAC formats.
3. The server verifies the administrator session and password-change state.
4. Prisma performs the write and audit-history write in one transaction.
5. Relevant cached routes are revalidated.
6. The dialog closes after success and the visible dashboard/list refreshes.

Administrators who still have `mustChangePassword = true` may only change their password or log out. Other mutations are rejected until the password has changed.

## Validation and Error Handling

Server-side validation is authoritative and is mirrored in the dialog for immediate feedback. Asset code uniqueness applies only to non-empty values. System codes are immutable. IP and MAC fields are optional but must be syntactically valid when present.

Expected failures display concise Thai messages:

- Invalid credentials or expired session.
- Missing/invalid form values.
- Duplicate non-empty asset code or system code.
- Record changed or deleted before an operation completed.
- Database or network failure.

Unauthorized mutation requests return `401`; authenticated users without permission or blocked by the mandatory password change return `403`. Not-found records return `404`. Unexpected errors are logged server-side without exposing secrets.

Delete is implemented as soft deletion. Deleted equipment is excluded from public lists, dashboard counts, and ordinary lookups.

## Dashboard and List Behavior

The dashboard shows total active inventory records and counts by normalized status. It includes meaningful charts for equipment type and building distribution and a recent-equipment section. Counts exclude soft-deleted records.

The equipment list supports a debounced text search across system code, asset code, equipment type, serial number, IP, MAC, department, and building. Filters cover status, building, department, and device type. Search/filter state is represented in URL query parameters so results can be shared and refreshed. Pagination is server-backed and preserves current filters.

## Testing and Verification

Automated coverage includes:

- Workbook-to-seed mapping and the expected count of 30 equipment records.
- Idempotent seed behavior.
- Login, session expiry, logout, and mandatory password change.
- Server-side authorization for every mutation.
- Validation of required fields, IP, MAC, and optional unique asset code.
- Create, update, soft delete, and audit-history writes.
- Dashboard aggregation and list search/filter/pagination.

Completion verification requires successful lint, TypeScript checking, automated tests, and production build. The running application is inspected through a browser for public viewing, administrator login, forced password change, create/edit/delete dialogs, responsive layouts, and Thai text rendering. Seeded totals and representative records are reconciled against the workbook.

## Success Criteria

The work is complete when all 30 populated workbook rows are present without loss, public users can view but cannot mutate data, the seeded administrator must change the initial password before managing equipment, administrator dialog workflows function end to end, dashboards and lists reflect database state, and all verification checks pass.

## UI Refinement: Equipment Colors and Dialog Tabs

The equipment page will receive restrained visual accents that extend the existing NRRU purple palette: a soft purple header treatment, clearer filter-card borders, status-specific badges, and violet hover/focus states for equipment rows and primary actions. Green, amber, red, and slate are reserved for operational status meaning so color remains useful rather than decorative.

The equipment details dialog and create/edit dialog will share five accessible tabs: General information, Location and responsibility, Technical specifications, Network information, and Condition and notes. The details dialog renders each tab read-only. The form dialog keeps one client-side form and preserves entered values, validation messages, pending state, and unsaved-change detection while the active tab changes. Tabs are horizontally scrollable on narrow screens and use the existing modal shell, so no new dialog behavior or dependency is introduced.

Delete confirmation and mandatory password-change dialogs remain single-purpose dialogs without tabs. Existing server actions, field names, validation, permissions, and data flow remain unchanged. UI verification will cover tab switching, active-tab accessibility, preservation of form state, status colors, and responsive behavior at mobile and desktop widths.
