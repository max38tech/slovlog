# Slovlog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a modern Slovenia travel blog (**slovlog.com**) with a public reading experience and a protected Google OAuth admin CMS backed by Supabase.

**Architecture:** Next.js 15 App Router application with `@supabase/ssr` for cookie-based Google OAuth authentication and Supabase PostgreSQL/Storage integration. Features Slovenian national colors, the Ljubljana dragon emblem, and the local Universa Sans typeface.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, `@supabase/ssr`, `@supabase/supabase-js`, Lucide React, Sonner, Unified / Remark / Rehype.

**Spec:** `docs/superpowers/specs/2026-09-24-slovlog-design.md`

## Global Constraints

- Domain target is `slovlog.com`, hosted on Vercel free tier with Supabase free tier.
- Font: Universa Sans loaded locally from `public/fonts/universa.otf` via `next/font/local` with geometric sans fallback.
- Brand logo: Ljubljana Dragon from `/home/shawn/Downloads/ljubljana_dragon_symbol.png` saved to `public/brand/ljubljana-dragon.png`.
- Protected Super-Admin: `shawn.shiobara@gmail.com` must never be deleted or demoted.
- Public routes must never expose unauthenticated draft posts or admin capabilities.
- All code must pass `npm run build` and TypeScript type-checking without errors.
- Every commit must be pushed to GitHub `origin main`.

## Review Focus

1. **Unregistered Google User Login:** A Google user whose email is not in `admin_users` tries logging in -> system must immediately destroy session and redirect to `/admin/login?error=unauthorized` with an explicit friendly rejection message.
2. **Super-Admin Protection:** An admin attempts to delete or demote `shawn.shiobara@gmail.com` via UI or API -> server action must reject the operation with a 403 Forbidden error.
3. **Empty or Missing Media Bucket:** Media upload fails if bucket `slovlog-media` is unconfigured -> uploader must show clear diagnostic toast rather than silent failure or crash.
4. **Draft Post Leakage:** An unauthenticated visitor visits `/posts/[slug]` for an unpublished draft -> page must return a 404 Not Found.
5. **Slug Collision:** An admin creates a post with a title that matches an existing slug -> system must auto-append a unique suffix (e.g. `-2`) instead of failing with a database unique violation.

---

### Task 1: Next.js Project Scaffolding & Slovenian Brand Asset Integration

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`
- Create: `public/fonts/universa.otf`
- Create: `public/brand/ljubljana-dragon.png`
- Create: `app/layout.tsx`, `app/globals.css`
- Test: Verify build and font loading

**Interfaces:**
- Produces: Base Next.js app with Tailwind color palette (`slovenia-blue`, `slovenia-green`, `slovenia-red`) and `font-universa` CSS class.

- [ ] **Step 1: Initialize Next.js project with TypeScript, Tailwind CSS, and dependencies**

Install dependencies:
```bash
npm install next@latest react@latest react-dom@latest lucide-react sonner clsx tailwind-merge
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss
```

- [ ] **Step 2: Copy brand assets to public folder**

Copy the local font and dragon image:
```bash
mkdir -p public/fonts public/brand
cp /home/shawn/Downloads/universa-sans-serif-font/Universa-BF68cb80f2cbb11.otf public/fonts/universa.otf
cp /home/shawn/Downloads/ljubljana_dragon_symbol.png public/brand/ljubljana-dragon.png
cp /home/shawn/Downloads/logo.png public/brand/logo.png
```

- [ ] **Step 3: Configure Tailwind CSS and CSS Variables for Slovenian Palette**

In `tailwind.config.ts` or CSS theme:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slovenia: {
          blue: {
            DEFAULT: "#005DA4",
            light: "#1E88E5",
            dark: "#004080",
          },
          green: {
            DEFAULT: "#2D6A4F",
            leaf: "#78A22F",
            light: "#88B04B",
          },
          red: {
            DEFAULT: "#C8102E",
          },
          canvas: "#F8FAFC",
        },
      },
      fontFamily: {
        universa: ["var(--font-universa)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Configure `app/layout.tsx` with `next/font/local`**

Set up `next/font/local` loading for `public/fonts/universa.otf` and Google font `Plus Jakarta Sans`.

- [ ] **Step 5: Verify build and commit**

Run: `npm run build`
Expected: Build succeeds.
Commit:
```bash
git add .
git commit -m "feat: scaffold Next.js project with Slovenian palette and brand assets"
git push origin main
```

---

### Task 2: Supabase Database Schema, SSR Clients & Types

**Files:**
- Create: `supabase/migrations/20260924_init.sql`
- Create: `types/database.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `.env.example`, `.env.local`

**Interfaces:**
- Produces: `createClient()` for browser, `createClient()` for server components/actions, database TypeScript interfaces (`Post`, `Media`, `AdminUser`).

- [ ] **Step 1: Write SQL migration file**

Create `supabase/migrations/20260924_init.sql` containing the full schema: `admin_users`, `posts`, `media`, RLS policies, `is_admin()` function, and storage policies.

- [ ] **Step 2: Create TypeScript database definitions**

Create `types/database.ts` with types for `Post`, `MediaItem`, `AdminUser`, and Supabase Database definitions.

- [ ] **Step 3: Implement Supabase SSR clients**

Install `@supabase/ssr` and `@supabase/supabase-js`:
```bash
npm install @supabase/ssr @supabase/supabase-js
```
Implement `lib/supabase/client.ts` (using `createBrowserClient`) and `lib/supabase/server.ts` (using `createServerClient` with `next/headers` cookies).

- [ ] **Step 4: Create `.env.example` and documentation**

Document `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `INITIAL_ADMIN_EMAIL="shawn.shiobara@gmail.com"`.

- [ ] **Step 5: Verify types and commit**

Run: `npx tsc --noEmit`
Commit:
```bash
git add supabase/ lib/supabase/ types/ .env.example
git commit -m "feat: add Supabase schema migration, SSR clients, and database types"
git push origin main
```

---

### Task 3: Google OAuth Authentication, Callback & Route Protection

**Files:**
- Create: `app/auth/callback/route.ts`
- Create: `middleware.ts`
- Create: `app/admin/login/page.tsx`
- Create: `lib/auth.ts`

**Interfaces:**
- Consumes: `lib/supabase/server.ts`, `lib/supabase/middleware.ts`
- Produces: Protected `/admin` routes, Google OAuth login page, session-to-admin email validator.

- [ ] **Step 1: Implement `lib/auth.ts` for admin validation**

Function `verifyAdminUser(email: string): Promise<{ authorized: boolean; role: 'owner' | 'admin' | null }>` checking if the email exists in `admin_users` or equals `INITIAL_ADMIN_EMAIL`.

- [ ] **Step 2: Implement `/auth/callback/route.ts`**

Handles OAuth redirect code:
1. Exchanges code for session cookies.
2. Checks user email against `verifyAdminUser`.
3. If not authorized: signs out user and redirects to `/admin/login?error=unauthorized`.
4. If authorized: redirects to `/admin`.

- [ ] **Step 3: Implement Next.js `middleware.ts`**

Intercepts `/admin/:path*` (except `/admin/login`):
Checks for active session. If missing, redirects to `/admin/login`.

- [ ] **Step 4: Build `/admin/login/page.tsx`**

Renders branded card with the Ljubljana dragon logo, "slovlog CMS", Google Sign-in button (`supabase.auth.signInWithOAuth({ provider: 'google' })`), and error banner if redirected with `error=unauthorized`.

- [ ] **Step 5: Verify build and commit**

Run: `npm run build`
Commit:
```bash
git add app/auth/ app/admin/login/ middleware.ts lib/auth.ts
git commit -m "feat: implement Google OAuth callback, login page, and admin middleware protection"
git push origin main
```

---

### Task 4: Admin Dashboard, Post Management & Markdown Editor

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/posts/page.tsx`
- Create: `app/admin/posts/new/page.tsx`
- Create: `app/admin/posts/[id]/edit/page.tsx`
- Create: `components/admin/PostEditor.tsx`
- Create: `components/admin/AdminSidebar.tsx`
- Create: `lib/actions/posts.ts`

**Interfaces:**
- Consumes: `lib/supabase/server.ts`, `types/database.ts`
- Produces: Full post CRUD, split-view Markdown editor, slug generator, post server actions.

- [ ] **Step 1: Create Admin layout and navigation sidebar**

Top bar / sidebar with Ljubljana dragon, links to Dashboard, Posts, Media, Admins, View Public Site, and Sign Out button.

- [ ] **Step 2: Create Admin Dashboard overview (`app/admin/page.tsx`)**

Shows metrics: Total Stories, Published, Drafts, Media Count, and quick "New Story" button.

- [ ] **Step 3: Implement post server actions in `lib/actions/posts.ts`**

`createPost()`, `updatePost()`, `deletePost()`, `togglePublish()`. Includes slug collision check that auto-appends `-2`, `-3` if a duplicate slug exists.

- [ ] **Step 4: Build Split-view Markdown Editor component**

Toolbar: Bold, Italic, H1, H2, Blockquote, Link, Image, Media Modal Insert.
Left: Markdown textarea. Right: Rendered HTML preview with Tailwind Typography.

- [ ] **Step 5: Build `app/admin/posts/page.tsx` and editor routes**

Post table with search, filter (Published / Drafts), edit link, publish toggle, and delete confirmation.

- [ ] **Step 6: Verify build and commit**

Run: `npm run build`
Commit:
```bash
git add app/admin/ components/admin/ lib/actions/
git commit -m "feat: implement admin dashboard, post management, and split-view markdown editor"
git push origin main
```

---

### Task 5: Admin Media Library & Supabase Storage Integration

**Files:**
- Create: `app/admin/media/page.tsx`
- Create: `components/admin/MediaUploader.tsx`
- Create: `components/admin/MediaModal.tsx`
- Create: `lib/actions/media.ts`

**Interfaces:**
- Consumes: Supabase Storage bucket `slovlog-media`, `media` table.
- Produces: Drag-and-drop file upload, media gallery grid, URL copying with toast, and Media Picker modal for `PostEditor`.

- [ ] **Step 1: Implement media server actions in `lib/actions/media.ts`**

`uploadMediaFile(formData: FormData)`, `deleteMediaFile(id: string, filePath: string)`.

- [ ] **Step 2: Build `MediaUploader.tsx`**

Drag-and-drop file upload area accepting images (JPEG, PNG, WEBP, AVIF). Shows upload progress and error alerts if storage bucket is missing.

- [ ] **Step 3: Build `app/admin/media/page.tsx`**

Grid display of media with thumbnails, file size, dimensions, "Copy URL" button (copies to clipboard and triggers Sonner toast), and delete button.

- [ ] **Step 4: Build `MediaModal.tsx` for Post Editor integration**

Modal that opens inside the Post Editor, allowing the author to click any uploaded photo and insert `![Caption](url)` at cursor position or select it as the cover image.

- [ ] **Step 5: Verify build and commit**

Run: `npm run build`
Commit:
```bash
git add app/admin/media/ components/admin/Media* lib/actions/media.ts
git commit -m "feat: implement media library with drag-and-drop upload and editor modal"
git push origin main
```

---

### Task 6: Admin Users Management & Super-Admin Protection

**Files:**
- Create: `app/admin/users/page.tsx`
- Create: `lib/actions/users.ts`

**Interfaces:**
- Consumes: `admin_users` table, `INITIAL_ADMIN_EMAIL`.
- Produces: Admin user management with hard lock preventing deletion of `shawn.shiobara@gmail.com`.

- [ ] **Step 1: Implement user management actions in `lib/actions/users.ts`**

`addAdminUser(email: string, role: string)`, `deleteAdminUser(id: string, targetEmail: string)`.
**Hard Constraint:** If `targetEmail.toLowerCase() === 'shawn.shiobara@gmail.com'` or `role === 'owner'`, reject with Error: "Cannot delete or demote the owner super-user."

- [ ] **Step 2: Build `app/admin/users/page.tsx`**

Displays table of admins. Add Admin form with email input. For `shawn.shiobara@gmail.com`, display a protected "Owner" badge with no delete button. For other admins, display "Remove" button with confirmation.

- [ ] **Step 3: Verify build and commit**

Run: `npm run build`
Commit:
```bash
git add app/admin/users/ lib/actions/users.ts
git commit -m "feat: implement admin users management with super-admin protection"
git push origin main
```

---

### Task 7: Public Blog Experience: Home Page, Story Reader & Destinations

**Files:**
- Create: `app/(public)/layout.tsx`
- Create: `app/(public)/page.tsx`
- Create: `app/(public)/posts/[slug]/page.tsx`
- Create: `app/(public)/about/page.tsx`
- Create: `components/public/Header.tsx`, `components/public/Footer.tsx`
- Create: `components/public/PostCard.tsx`, `components/public/Lightbox.tsx`
- Create: `components/public/MarkdownRenderer.tsx`

**Interfaces:**
- Consumes: `posts` table (where `published = true`), `media` table, brand assets.
- Produces: Public blog pages with Slovenian styling, Universa font headers, dragon emblem, destination filters, and photo lightbox.

- [ ] **Step 1: Build Public Header & Footer**

Header: Ljubljana dragon logo, "slovlog" logotype, navigation ("Stories", "Destinations", "About"), Slovenian tricolor accent strip.
Footer: Dragon badge, copyright, "Made with ❤️ for Slovenia", discreet link to `/admin`.

- [ ] **Step 2: Build Home Page (`app/(public)/page.tsx`)**

Hero: "Travels Across Slovenia", dragon emblem, subtitle.
Destination filter pills (Ljubljana, Lake Bled, Soča Valley, Piran, Triglav, Lake Bohinj).
Featured story hero banner + grid of post cards (`PostCard.tsx`) with cover image, location badge, trip date, and reading time.

- [ ] **Step 3: Build Story Reader (`app/(public)/posts/[slug]/page.tsx`)**

Displays post title in Universa font, trip date, location badge.
Rich Markdown content with responsive images and callouts.
Photo Gallery section with interactive `Lightbox.tsx` for high-res photo viewing.
Previous and Next story pagination.
If post is not published and viewer is not admin, returns `notFound()`.

- [ ] **Step 4: Build About Page (`app/(public)/about/page.tsx`)**

Trip itinerary overview, map of stops visited in Slovenia, journey notes.

- [ ] **Step 5: Verify build and commit**

Run: `npm run build`
Commit:
```bash
git add app/\(public\)/ components/public/
git commit -m "feat: implement public blog experience, story reader, and photo lightbox"
git push origin main
```

---

### Task 8: Comprehensive README, GitHub Sync & Vercel Verification

**Files:**
- Create: `README.md`
- Create: Sample seed script or initial demo post in migration

**Interfaces:**
- Produces: Comprehensive documentation reminding the user of the tech stack, Google OAuth setup, Supabase setup, and Vercel hosting.

- [ ] **Step 1: Write comprehensive `README.md`**

Include:
- System overview and tech stack.
- Supabase setup guide (SQL migration, Google OAuth credentials, storage bucket).
- Vercel deployment instructions for `slovlog.com`.
- Admin features and protected super-user notes.
- Local development instructions.

- [ ] **Step 2: Full production build & type check**

Run: `npm run build`
Ensure zero errors or warnings.

- [ ] **Step 3: Final Git push to GitHub**

Push all commits to `origin main` on `https://github.com/max38tech/slovlog`.
