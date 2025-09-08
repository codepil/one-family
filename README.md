# Kinfolk – Family Website

A production-ready full-stack React + Express application for families to share blogs, plan events, and build an interactive family tree with a modern, warm brand. Includes client-side AI summaries demo and a rich UI built with TailwindCSS and shadcn-style components.

## Tech Stack

- React 18 + TypeScript + Vite (SPA)
- Express (integrated with Vite for single-port dev)
- TailwindCSS 3 with design tokens (HSL variables)
- shadcn-style UI primitives (Radix + Tailwind)
- TanStack Query (data fetching/cache)
- Vitest (unit testing)

## Features Implemented

- Blogs: list/filter by status/tags, create, edit, and view details
- Events: tabs (upcoming/ongoing/past/all), search, create/edit, invite management
- Family Tree: expandable tree, select member, edit details, add child/sibling
- AI Summary (demo): local summarizer with keyword extraction
- Responsive layout, shared header/footer, modern theming

## Monorepo Layout

```
client/                    # React SPA
  App.tsx                  # Router + providers
  pages/                   # Routes (Index, Blogs, Events, FamilyTree)
  components/
    layout/                # SiteHeader, SiteFooter
    ui/                    # shadcn-style components
    FamilyTree.tsx         # Interactive tree widget
    AISummary.tsx          # Local demo summarizer
server/                    # Express API
  index.ts                 # Server setup and routes
  routes/                  # Example handlers (demo)
shared/                    # Shared types
  api.ts                   # Example response interfaces
```

## Getting Started

Prerequisites: Node 18+, pnpm 8+.

Install dependencies:

```bash
pnpm install
```

Start dev server (client + server on one port):

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Run production server (after build):

```bash
pnpm start
```

Type-check and tests:

```bash
pnpm typecheck
pnpm test
```

## Environment Variables

- Server-side env is loaded via `dotenv`.
- Public client env must be prefixed with `VITE_`.
- Common variables you might add later (optional):
  - `VITE_API_BASE` – override API base URL
  - `PORT` – server port (production)

Create a `.env` file at project root for local development when needed.

## Routing

- SPA routes are defined in `client/App.tsx` using React Router.
- Add pages under `client/pages/` and wire them in `App.tsx`.
- API routes are Express handlers in `server/routes/` and mounted in `server/index.ts` under `/api/*`.

Example APIs (starter):

- `GET /api/ping` → `{ ok: true }`
- `GET /api/demo` → `{ message: string }`

## Styling & Theming

- Tailwind config expects HSL design tokens defined in `client/global.css` (e.g. `--primary: 343 88% 60%`).
- Colors in `tailwind.config.ts` reference these tokens (`hsl(var(--primary))`).
- Update tokens in `client/global.css` only with HSL values to avoid color drift.

## UI Conventions

- Prefer small, composable components; avoid deeply nested JSX trees.
- Use `cn()` from `client/lib/utils.ts` for class merging.
- Buttons/inputs/etc come from `client/components/ui/*`.
- Keep shared layout (header/footer) consistent across pages.

## Domain Implementation Notes

- Blogs (`/blogs`)
  - Tabs: All / Published / Drafts
  - Search by title/author/tag
  - Create/Edit forms in right sidebar
  - Tags accept comma or `#` separated input
- Events (`/events`)
  - Tabs: Upcoming / Ongoing / Past / All (derived from start/end times)
  - Search by title/location
  - Circular “+” FAB-style button to create; edit in sidebar
  - Invites: add invitee name/email; status chips shown
- Family Tree (`/family-tree`)
  - Click to select member; edit name/born in sidebar
  - Add Child / Add Sibling actions; updates tree immutably
- Home (`/`)
  - Hero + feature cards, AI snapshot, embedded tree preview

All data is currently in-memory for demo purposes. Swap to a real backend (see next section) to persist.

## Persistence & Integrations (optional)

- Database/Auth/Storage: Supabase or Neon + Prisma
- Media uploads: Supabase Storage or S3-compatible
- AI summaries: call your LLM provider server-side (never expose secrets in browser)

Suggested path:

1. Add models/tables (posts, events, invites, members) in your DB
2. Implement server routes for CRUD under `/api/*`
3. Use TanStack Query mutations/queries in the client
4. Add optimistic updates and cache invalidation as needed

## Deployment

- Standard: any Node host that runs `pnpm build && pnpm start`
- Static adapters are not recommended (Express is required)
- Netlify/Vercel: configure build command `pnpm build` and start/adapter as Node server

## Coding Standards

- TypeScript strict mode preferred
- Keep functions pure where possible; avoid mutating props/state
- No TODO placeholders; write complete implementations
- Use Vitest for unit tests; colocate specs next to source when practical

## Accessibility

- All actionable icons (e.g., circular “+”) include `aria-label` and screen-reader text
- Keyboard focus styles preserved via shadcn patterns

## License

MIT © Kinfolk contributors
