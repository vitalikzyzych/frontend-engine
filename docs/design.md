# From design to screen

How designs (HTML exports, Figma frames, screenshots) become screens in this project. The design describes what the user sees; the project's tokens and components decide how it is built. Markup from a design is never copied into the code.

This guide is the starting point and will grow once the first real designs arrive. Rules that keep coming back in reviews move into the `ui` skill or into lint.

## Two separate steps

**1. Brand, once per application, before the first feature.** The look that every screen shares: colors, radius, fonts, logo. It goes into a small pull request of its own, so feature pull requests never change the look of the whole application.

**2. Screens, per feature.** Layout, columns, labels, actions and states of one feature. They go into the feature brief and are built from existing components.

## Step 1: brand

Source: the design system page of the design, or the most complete screen when there is none.

1. **Colors.** Map the design's palette onto the roles in `src/styles/tokens.css`, not onto new variables. The roles are: `background` and `foreground` (page), `card` and `popover` (raised surfaces), `primary` (main actions, links), `secondary` and `accent` (quiet buttons, hover), `muted` and `muted-foreground` (secondary text, empty areas), `destructive` (delete, errors), `border`, `input`, `ring` (focus), `sidebar-*` (navigation), `chart-1` to `chart-5`. Convert hex values to OKLCH (https://oklch.com). Every role needs a value in `:root` and in `.dark`; when the design has no dark mode, derive one and mark it in the pull request as not designed.
2. **Radius.** `--radius` in `tokens.css`. The other radii are derived from it.
3. **Fonts.** Load them with `next/font` in `src/app/[locale]/layout.tsx` and point `--font-sans` (and `--font-mono` when needed) in `src/styles/globals.css` at them.
4. **Logo and favicon.** Logo in `src/shared/components/app-shell/app-sidebar.tsx`, favicon in `src/app/[locale]/`.
5. **Check.** Open the members list, a member page, the invite dialog and the edit page in light and dark mode. Compare them with the design. Differences that tokens cannot fix (a different button shape, a different table style) are listed in the pull request; they are solved in step 2 when a screen needs them, not by editing `src/shared/ui/`.

A color in the design that has no role (for example a second brand color used for highlights) is a decision: either it maps to an existing role, or a new token is added to `tokens.css` and to the Tailwind theme in `globals.css`, with a name that says what it is for (`--highlight`), not what it looks like (`--purple`).

## Step 2: screens

Design files for a feature go in `docs/features/<name>/` (HTML exports, screenshots, or a `figma.md` with links to the frames). `/new-feature <name>` reads them when it writes the brief.

**Reading a design.** Large HTML exports are expensive to read in full. Prefer screenshots of each state, or point to the part of the HTML that matters. One screenshot per state helps most: default, loading, empty, error, dialog open, validation errors.

**What the brief takes from the design:**

- routes and the page layout (list, detail with tabs, full-page form, dialog)
- columns, fields, labels and action names, exactly as written, because tests query by visible text
- which actions need a confirmation
- the empty, loading and error states the design shows; missing ones follow the members feature

**Mapping to components.** Each part of the design is matched to what already exists:

- **Page title, description and buttons on the right:** `PageHeader`.
- **Path above the title:** `PageBreadcrumbs`.
- **Table with sorting and paging:** `DataTable` and `DataTableColumnHeader`.
- **Filters:** `Input` for search, `Select` for one value, `DataTableFacetedFilter` for several values, `DateRangeFilter` for dates.
- **Tabs:** `Tabs`, with the selected tab in the URL.
- **Status pill:** `Badge` with a variant, in a `<entity>-status-badge.tsx`.
- **Form in a popup:** `Dialog` with the shared fields component.
- **Form on its own page:** the edit page pattern from members.
- **Confirmation popup:** `ConfirmDialog`.
- **Empty or error box:** `EmptyState` and `ErrorState`.

Something the design needs that is not in the list:

1. A shadcn component exists for it: `pnpm dlx shadcn@latest add <name>`.
2. It is a combination of existing parts used by more than one feature: a new component in `src/shared/components/`, in its own small pull request.
3. It is specific to one feature: a component in that feature's `components/`.

New components are listed in the brief under Screens, so they are agreed before the tests are written.

**What is not taken from the design:** hex colors, pixel sizes and fonts written in the markup. Colors come from tokens (`bg-primary`, `text-muted-foreground`), spacing and sizes from the Tailwind scale (`gap-4`, `p-6`), text sizes from the Tailwind type scale. A screen that cannot match the design with tokens and the scale points to a missing token from step 1, not to a hardcoded value.

## Review

A pull request with a new screen includes screenshots in light and dark mode. The review compares them with the design for layout, labels and states, not for exact pixels.
