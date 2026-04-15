# Project Structure

Next.js 16 CRM frontend (App Router, TypeScript, Tailwind CSS v4).

---

## Top-level layout

```
sidago/
├── app/                    # Next.js App Router pages & API routes
├── components/             # Reusable, project-wide components
├── features/               # Feature modules (domain-driven)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions, services, config
├── providers/              # React context providers
├── public/                 # Static assets (CSS, images)
├── types/                  # TypeScript type definitions
└── [config files]          # next.config.ts, tsconfig.json, etc.
```

---

## `app/` — Pages & API routes

```
app/
├── (auth)/                         # Public routes (no auth required)
│   ├── _components/
│   │   ├── Login.tsx
│   │   └── Form.tsx
│   ├── page.tsx                    # Login page
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── layout.tsx
│
├── (protected)/                    # Authenticated routes
│   ├── layout.tsx                  # Wraps sidebar + header
│   ├── dashboard/page.tsx          # Role-based redirect
│   ├── admin/dashboard/page.tsx
│   ├── manager/dashboard/page.tsx
│   ├── agent/
│   │   ├── dashboard/page.tsx
│   │   └── calls/page.tsx
│   └── backoffice/
│       ├── closed-contacts/page.tsx
│       ├── currently-hot-leads-svg/page.tsx
│       ├── currently-hot-leads-95rm/page.tsx
│       ├── currently-hot-leads-benton/page.tsx
│       ├── recent-interest-svg/page.tsx
│       ├── recent-interest-95rm/page.tsx
│       ├── recent-interest-benton/page.tsx
│       ├── unassigned-hot-leads-svg/page.tsx
│       ├── unassigned-hot-leads-95rm/page.tsx
│       ├── unassigned-hot-leads-benton/page.tsx
│       ├── ever-been-hot-svg/page.tsx
│       ├── ever-been-hot-95rm/page.tsx
│       └── ever-been-hot-benton/page.tsx
│
├── api/
│   └── auth/
│       ├── login/route.ts
│       ├── me/route.ts
│       └── refresh/route.ts
│
├── 403/page.tsx
├── not-found.tsx
└── layout.tsx                      # Root layout (providers)
```

---

## `components/` — Shared components

### `components/ui/` — Base UI library

All primitive and feedback components. Import from the barrel:

```ts
import { Button, CardShell, SectionLabel, Modal } from "@/components/ui";
```

| File                 | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `Button.tsx`         | Generic button                                                           |
| `Input.tsx`          | Text input                                                               |
| `Textarea.tsx`       | Multi-line input                                                         |
| `Select.tsx`         | Dropdown select                                                          |
| `Card.tsx`           | Generic card + CardContent                                               |
| `CardShell.tsx`      | **Reusable card wrapper** (rounded-2xl, border, shadow, dark mode)       |
| `SectionLabel.tsx`   | **Reusable section heading** (uppercase tracking, optional icon)         |
| `Badge.tsx`          | TypeBadge, CampaignBadge, StatusBadge, TimezoneBadge, CompanySymbolBadge |
| `Modal.tsx`          | Dialog modal with direction animations                                   |
| `Confirmation.tsx`   | Confirm/cancel dialog                                                    |
| `EmptyState.tsx`     | Empty data placeholder                                                   |
| `ErrorState.tsx`     | Error display                                                            |
| `Spinner.tsx`        | Wave loading spinner                                                     |
| `Preloader.tsx`      | Full-page loading screen                                                 |
| `RoutePreloader.tsx` | Route transition loading                                                 |
| `Table.tsx`          | Data table                                                               |
| `index.ts`           | Barrel export for all of the above                                       |

### `components/guards/` — Route protection

| File               | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `PrivateRoute.tsx` | Redirects unauthenticated users to login            |
| `GuestRoute.tsx`   | Redirects authenticated users away from auth pages  |
| `HasRole.tsx`      | Renders children only if user has the required role |

### `components/layouts/protected/` — Authenticated shell

| File               | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `AuthLayout.tsx`   | Main layout: sidebar + header + content area      |
| `Sidebar.tsx`      | Collapsible navigation sidebar (Framer Motion)    |
| `SidebarItem.tsx`  | Individual nav link item                          |
| `Header.tsx`       | Top bar with profile, notifications, theme toggle |
| `Mobilebar.tsx`    | Bottom navigation for mobile                      |
| `Notification.tsx` | Notification popover                              |
| `Profile.tsx`      | User avatar + dropdown menu                       |
| `ThemeToggle.tsx`  | Dark/light mode switch                            |

### `components/layouts/public/` — Unauthenticated shell

| File               | Purpose                         |
| ------------------ | ------------------------------- |
| `PublicLayout.tsx` | Centered login/auth page layout |
| `Branding.tsx`     | Logo + brand name               |
| `FormHeading.tsx`  | Heading above auth forms        |
| `Heading.tsx`      | Generic heading component       |

### `components/skeletons/` — Loading placeholders

| File                | Purpose                     |
| ------------------- | --------------------------- |
| `TableSkeleton.tsx` | Animated table row skeleton |

---

## `features/` — Feature modules

Each feature follows this convention:

```
features/[feature-name]/
├── [FeatureName].tsx       # Main container (state, layout)
├── _components/            # Private sub-components (prefix _ = not shared)
│   └── *.tsx
└── _lib/
    ├── data.ts             # Mock / static data
    └── utils.ts            # Feature-specific helpers
```

### `features/agent-calls/`

The agent calling interface. All state lives in `AgentCalls.tsx`.

```
AgentCalls.tsx
_components/
├── CallsHeader.tsx         # Sticky top bar
│   ├── CallsLogo.tsx       # Phone icon + "Call UI" title
│   └── LeadSelector.tsx    # Lead dropdown + counter
├── AutoCallingBanner.tsx   # Auto-call progress bar
│   └── PingDot.tsx         # Animated pulse indicator
├── HeroCard.tsx            # Lead name, badges, stat boxes
│   └── LeadStatBox.tsx     # Company / Role info box
├── PhoneCard.tsx           # Clickable phone number link
├── CallNotesCard.tsx       # Notes textarea + save button
├── CallOutcomeCard.tsx     # 8 outcome action buttons
│   └── OutcomeButton.tsx   # Individual outcome button
├── DatesCard.tsx           # Callback + read-only dates
│   ├── DatePickerField.tsx # Labeled date input with calendar icon
│   └── DateReadonlyRow.tsx # Read-only date row with icon
├── HistoryCard.tsx         # Notes / Calls / Other contacts history
├── IdentityCard.tsx        # Name, lead type, email, contact type form
└── WorkToggleRow.tsx       # "Doesn't work here anymore" toggle
_lib/
├── data.ts                 # leadsByAgent mock data, select options
└── utils.ts                # getAgentKeyFromCookie
```

### `features/agent-dashboard/`

Agent performance dashboard with stats, charts, and leaderboard.

```
AgentDashboard.tsx
_components/
├── StatusSection.tsx       # Today's KPI row
│   └── StatusCard.tsx      # Single KPI card
├── AgentGridSection.tsx    # Grid of all agents
│   ├── AgentAvatar.tsx     # Avatar with winner crown
│   ├── AgentIdentity.tsx   # Name + brand
│   └── WinnerBadge.tsx     # Trophy badge overlay
├── ChartsSection.tsx       # Charts area
│   └── BarChart.tsx        # Performance bar chart
├── Leaderboard.tsx         # Monthly + all-time leaderboard
│   └── LeaderboardTable.tsx # Ranked table rows
├── MetricTile.tsx          # Small metric display tile
├── Panel.tsx               # Generic section panel wrapper
├── Title.tsx               # Section title component
└── WidgetCard.tsx          # Dashboard widget card wrapper
_lib/
├── data.ts
└── utils.ts
```

### `features/backoffice-*/`

All backoffice features share the same structure. Each has 3 brand variants
(SVG, 95RM, Benton) rendered as separate page-level components.

```
features/backoffice-[name]/
├── Backoffice[Name].tsx         # Main container
└── _components/
    ├── [Name]Svg.tsx            # SVG brand table view
    ├── [Name]95rm.tsx           # 95RM brand table view
    ├── [Name]Benton.tsx         # Benton brand table view
    ├── [Name]Table.tsx          # Shared table component
    └── [Name]EmptyState.tsx     # Empty state for this feature
```

Current backoffice features:

- `backoffice-currently-hot/`
- `backoffice-ever-been-hot/`
- `backoffice-recent-interest/`
- `backoffice-unassigned-hot-leads/`
- `backoffice-closed-contacts/`

---

## `types/` — TypeScript definitions

Split by domain. Always import from `@/types` (the barrel) unless you need
to reference a specific domain file directly.

| File             | Contents                                                         |
| ---------------- | ---------------------------------------------------------------- |
| `agent.types.ts` | `AirtableAgent`, `Agent`                                         |
| `lead.types.ts`  | `AirtableLead`, `Lead`                                           |
| `form.types.ts`  | `CallsFormState`, `CallsModalState`, `createFormStateFromLead()` |
| `index.ts`       | Re-exports all of the above                                      |

---

## `hooks/` — Custom hooks

| File                | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `useAuthActions.ts` | `login()`, `logout()` bound to auth context    |
| `useMe.ts`          | React Query hook to fetch the current user     |
| `useRouteMeta.ts`   | Returns route title/icon based on current path |

---

## `lib/` — Utilities & services

| File                       | Purpose                                                  |
| -------------------------- | -------------------------------------------------------- |
| `api.ts`                   | Fetch wrapper (auto-attaches token, handles 401 refresh) |
| `auth-routing.ts`          | `getDefaultRouteForRole()`, redirect helpers             |
| `navigation.ts`            | Nav items keyed by role                                  |
| `token.ts`                 | Read/write access & refresh tokens                       |
| `secureStorage.ts`         | AES-encrypted localStorage wrapper                       |
| `utils.ts`                 | Shared utility helpers (`delay`, etc.)                   |
| `toast.ts`                 | Typed toast notification helpers                         |
| `services/auth.service.ts` | `loginRequest()`, `refreshToken()`, `fetchMe()`          |
| `validation/index.ts`      | Zod schemas for forms                                    |
| `mocks/users.ts`           | Seed user data for mock auth API                         |

---

## `providers/` — React context

| File                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `AuthProvider.tsx`  | Provides `useAuth()` — user, loading, login, logout |
| `QueryProvider.tsx` | TanStack React Query client                         |
| `ThemeProvider.tsx` | Dark/light theme, persists to localStorage          |

---

## Component conventions

### Naming

- Feature containers: `PascalCase.tsx` (e.g. `AgentCalls.tsx`)
- Private sub-components: prefix directory with `_` (e.g. `_components/`)
- Shared primitives: live in `components/ui/`

### Props types

Defined inline or as a `type Props = { ... }` near the component.

### "use client" directive

Added only where needed (event handlers, hooks, animations).
Server components are the default — don't add `"use client"` unnecessarily.

### Styling

- Tailwind CSS utility classes throughout
- Dark mode via `.dark:*` variants
- Standard card pattern → use `<CardShell>` from `components/ui`
- Standard section label → use `<SectionLabel>` from `components/ui`

### Data flow

- Local UI state: `useState`
- Server/async state: TanStack React Query (`useQuery`)
- Global auth state: `useAuth()` context hook
- Mock data: `_lib/data.ts` in each feature

### Adding a new feature

1. Create `features/[feature-name]/[FeatureName].tsx`
2. Add `_components/` and `_lib/` subdirectories
3. Add a page at `app/(protected)/[route]/page.tsx`
4. Add the nav item to `lib/navigation.ts` for the correct role(s)
5. Add a `<HasRole>` guard if the route is role-restricted
