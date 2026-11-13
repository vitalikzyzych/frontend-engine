---
name: ui
description: UI conventions - shadcn components, shared components (PageHeader, DataTable, EmptyState, ErrorState, ConfirmDialog), tokens, dark mode and accessibility.
---

# UI

- Primitives: `src/shared/ui/` (shadcn). Add new ones with `pnpm dlx shadcn@latest add <name>`. Do not hand-edit them; wrap them in `src/shared/components/` instead.
- Page layout: `PageHeader` with title, description and actions, then content. Pages inside `(app)` get the sidebar shell automatically.
- Lists: `DataTable` with server pagination and sorting, column headers from `DataTableColumnHeader`.
- States: `EmptyState`, `ErrorState` (with retry), skeletons for loading.
- Destructive actions: `ConfirmDialog` with `isDestructive`.
- Colors only through tokens (`bg-primary`, `text-muted-foreground`...). Brand changes go in `src/styles/tokens.css`. Check dark mode.
- Merge classes with `cn` from `cn`.
- Icons from `lucide-react`. Icon-only buttons need `aria-label`.
- Keep components small; extract once a file passes about 150 lines.
