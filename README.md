# 🇸🇮 slovlog — Slovenia Travel Journal

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Storage-emerald?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-white?style=flat&logo=vercel)](https://vercel.com/)
[![Domain](https://img.shields.io/badge/Domain-slovlog.com-005DA4)](https://slovlog.com)

A modern, responsive travel journal built to document a journey across the green heart of Europe. Designed for zero-maintenance hosting on free-tier Vercel and free-tier Supabase.

---

## 🐉 Tech Stack & Identity

* **Framework**: **Next.js 15** (App Router, React 19, TypeScript)
* **Styling**: **Tailwind CSS** with a custom Slovenian national color system:
  * 🌊 **Adriatic / Ljubljanica Blue** (`#005DA4`) — Headers, buttons, and accents
  * 🌲 **Triglav / Alpine Green** (`#2D6A4F` & `#78A22F`) — Location badges and tags (*"I feel SLOVEnia"*)
  * ❄️ **Snow Canvas** (`#FFFFFF` & `#F8FAFC`) — Crisp photography presentation
  * 🛡️ **Coat of Arms Red** (`#C8102E`) — Tricolor accents and badges
* **Typography**:
  * **Universa Sans**: Commissioned Slovenian font loaded locally via `next/font/local` (`public/fonts/universa.otf`) for headlines and brand titles.
  * **Plus Jakarta Sans**: Clean geometric sans fallback for high editorial readability.
* **Logo & Emblem**: **Ljubljana Dragon** (`public/brand/ljubljana-dragon.png`), symbol of courage and guardian of the capital city.
* **Database & Auth**: **Supabase PostgreSQL** with Row-Level Security (RLS) and `@supabase/ssr` Cookie-based sessions.
* **Media Storage**: **Supabase Storage** (`slog-media` bucket) served through global CDN.
* **Hosting**: **Vercel** with custom domain **`slovlog.com`**.

---

## 🌟 Key Functionality

### 1. Public Travel Blog (`slovlog.com`)
* **Hero Banner**: Features the Ljubljana Dragon emblem, journey subtitle, and key travel metrics.
* **Destination Filters**: Quick filter pills to explore stories by region (*Ljubljana*, *Lake Bled*, *Lake Bohinj*, *Soča Valley*, *Piran*, *Triglav National Park*).
* **Featured Journey**: Prominent hero card showcasing the latest highlighted story.
* **Story Reader (`/posts/[slug]`)**:
  * Accurate trip date, location badge, and estimated reading time.
  * Rich Markdown renderer supporting headings, callouts, blockquotes, code, and responsive images.
  * **Interactive Lightbox Photo Gallery**: Click any photo to inspect high-resolution photography full-screen with keyboard controls (`Esc`, `←`, `→`).
  * Story pagination linking to previous and next travel stops.
* **About the Journey (`/about`)**:
  * Interactive 5-stage travel route timeline with summaries.
  * Slovenia travel takeaways (eco-initiatives, vignette regulations, alpine drinking water).

### 2. Protected Administration CMS (`slovlog.com/admin`)
* **Google OAuth Sign-In**:
  * One-click Google authentication at `/admin/login`.
  * Middleware and OAuth callback exchange cookies and check identity against the `slog_admin_users` table.
* **Super-Admin / Owner Protection**:
  * **`shawn.shiobara@gmail.com`** is pre-seeded and permanently locked as the site owner.
  * System rules strictly prohibit deleting or demoting the owner account.
  * Unauthorized Google accounts are immediately signed out and redirected with a clear rejection notice.
* **Dashboard Overview (`/admin`)**:
  * Real-time metrics: Total Stories, Published, Drafts, and Media Assets.
  * Quick-launch buttons and recent stories table.
* **Story Editor (`/admin/posts/new` & `[id]/edit`)**:
  * Split-view Markdown editor with live preview toggle (Editor / Split / Preview).
  * Formatting toolbar for headers, quotes, lists, links, code, and photos.
  * Auto-slug generator with collision resolution (auto-appends `-2`, `-3` if duplicate).
  * Travel date picker, location selector, cover image picker, and photo gallery attachments.
  * Toggle between **Draft** and **Published** status.
* **Media Library (`/admin/media`)**:
  * Drag-and-drop multi-file uploader (JPEG, PNG, WEBP, AVIF, GIF, SVG up to 20MB).
  * Direct upload to Supabase Storage bucket `slog-media`.
  * Visual gallery grid with dimensions, size, and date.
  * **1-Click "Copy Public URL"** button with instant toast notification for pasting into stories.
  * Photo deletion (removes from both storage and database).
* **Collaborator Management (`/admin/users`)**:
  * View authorized administrators.
  * Add collaborator Google accounts by email.
  * Revoke non-owner access at any time.

---

## 🚀 Setup & Deployment Guide

### Step 1: Initialize Database & Storage in Supabase

1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** on the left menu.
3. Open [`supabase/migrations/20260924_init.sql`](./supabase/migrations/20260924_init.sql) from this repository, paste the entire SQL content, and click **Run**.
   * *This creates the `slog_admin_users`, `slog_posts`, and `slog_media` tables (with `slog_` prefix for shared database isolation), enables RLS, creates the `slog-media` storage bucket, and pre-seeds Shawn Shiobara as owner with initial sample stories.*

### Step 2: Configure Dedicated Google OAuth (Direct Next.js Auth)

Because this app shares a Supabase database with WeatherTrack, slovlog uses **Direct Google OAuth** handled in Next.js, completely isolating its authentication and branding from WeatherTrack.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
2. Create an **OAuth 2.0 Client ID** (Application type: *Web application*).
3. Under **Authorized JavaScript origins**, add:
   ```text
   https://slovlog.com
   https://slovlog.vercel.app
   http://localhost:3000
   ```
4. Under **Authorized redirect URIs**, add the direct Next.js auth callback:
   ```text
   https://slovlog.com/api/auth/google/callback
   https://slovlog.vercel.app/api/auth/google/callback
   http://localhost:3000/api/auth/google/callback
   ```
5. Copy your **Client ID** and **Client Secret**.

### Step 3: Deploy to Vercel

1. Push this repository to GitHub (`max38tech/slovlog`).
2. In your [Vercel Project](https://vercel.com/) -> **Settings** -> **Environment Variables**, add:
   ```env
   # Shared Supabase Database & Storage
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

   # Site URL
   NEXT_PUBLIC_SITE_URL=https://slovlog.com

   # Direct Google OAuth (Isolated from WeatherTrack)
   GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>

   # Owner Protection
   INITIAL_ADMIN_EMAIL=shawn.shiobara@gmail.com
   ```
3. Redeploy the project.
4. You can now log into `https://slovlog.com/admin` directly with your Google account!

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/max38tech/slovlog.git
   cd slovlog
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure local environment variables**:
   Create `.env.local` (reference [`.env.example`](./.env.example)):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   INITIAL_ADMIN_EMAIL=shawn.shiobara@gmail.com
   ```

4. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the public blog, and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

5. **Run automated test suite**:
   ```bash
   npm test
   ```
   *Runs unit tests for admin validation, owner protection, slug collision handling, media sanitization, and reading metrics.*

6. **Verify production build**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
slovlog/
├── app/
│   ├── (public)/                 # Public blog pages
│   │   ├── layout.tsx            # Slovenian header with dragon logo, navigation, footer
│   │   ├── page.tsx              # Home: Hero, featured stories, trip timeline & destination filter
│   │   ├── posts/[slug]/page.tsx # Story reader: photo gallery, trip date, location badge, reading view
│   │   └── about/page.tsx        # Trip map overview & itinerary notes
│   ├── admin/                    # Protected admin CMS
│   │   ├── layout.tsx            # Admin dashboard sidebar & session verification
│   │   ├── page.tsx              # Dashboard metrics & recent activity
│   │   ├── login/page.tsx        # Google OAuth sign-in button & authorization alerts
│   │   ├── posts/
│   │   │   ├── page.tsx          # Post management table (status, toggle, edit, delete)
│   │   │   ├── new/page.tsx      # Write new story
│   │   │   └── [id]/edit/page.tsx# Edit existing story
│   │   ├── media/page.tsx        # Supabase Storage photo manager
│   │   └── users/page.tsx        # Manage collaborator admin accounts
│   ├── auth/callback/route.ts    # Supabase OAuth token exchange & admin verification
│   ├── globals.css               # Slovenian palette tokens and tricolor styles
│   └── layout.tsx                # Root layout loading local Universa font
├── components/
│   ├── admin/                    # Admin components (PostEditor, MediaUploader, AdminSidebar)
│   └── public/                   # Public components (Header, Footer, PostCard, Lightbox, MarkdownRenderer)
├── lib/
│   ├── actions/                  # Server actions (posts.ts, media.ts, users.ts)
│   ├── supabase/                 # Supabase client utilities (client.ts, server.ts, middleware.ts)
│   └── utils/                    # Slugifier, media validator, admin protection
├── public/
│   ├── brand/                    # Ljubljana dragon emblems & logos
│   └── fonts/                    # Universa Sans local font file
├── supabase/
│   └── migrations/               # SQL schema for tables, RLS policies, storage bucket & seed data
└── tests/                        # Automated unit tests
```

---

© 2026 Shawn Shiobara. Crafted with ❤️ for Slovenia.
