---
name: ui
description: UI conventions - shadcn components, shared components (PageHeader, PageBreadcrumbs, DataTable, filters, EmptyState, ErrorState, ConfirmDialog), list and detail page layouts, tabs, tokens, dark mode and accessibility.
---

# UI

- Primitives: `src/shared/ui/` (shadcn). Add new ones with `pnpm dlx shadcn@latest add <name>`. Do not hand-edit them; wrap them in `src/shared/components/` instead.
- Designs: follow `docs/design.md` for how a design file becomes a screen.
- Page layout: `PageHeader` with title, description and actions, then content. Pages inside `(app)` get the sidebar shell automatically.
- Nested pages (detail, edit) start with `PageBreadcrumbs`: list, record, current page. Reference: `member-detail-view.tsx`.
- Lists: `DataTable` with server pagination and sorting, column headers from `DataTableColumnHeader`. The record's name links to its page.
- Filters: `Select` for one value, `DataTableFacetedFilter` for several values, `DateRangeFilter` for a date range. All of them write to the URL. Reference: `members-toolbar.tsx`.
- Detail pages: header with the record's name and actions, then `Tabs` with the selected tab in the URL (`use-member-tab.ts`). Tab content that loads its own data mounts only when the tab is open.
- Forms: a dialog for small create forms; a separate page (`/<entity>/[id]/edit`) for editing and for larger forms. Both share one fields component.
- States: `EmptyState`, `ErrorState` (with retry), skeletons for loading, and a not-found state for records that do not exist.
- Destructive actions and actions that remove access: `ConfirmDialog` with `isDestructive`. Reversible actions (reactivate) run directly.
- Colors only through tokens (`bg-primary`, `text-muted-foreground`...). Brand changes go in `src/styles/tokens.css`. Check dark mode.
- Merge classes with `cn` from `cn`.
- Icons from `lucide-react`. Icon-only buttons need `aria-label`.
- Keep components small and one component per file; extract once a file passes about 150 lines.
