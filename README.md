# MATHRA WORLD

**කතාන්දරයකින් ලෝකයක් වෙනස් කරමු...**

A Sinhala-first storytelling, digital library and knowledge community. Created by **Denuwan**. Powered by **MATHRA**.

> Status: **Phase 1 of 4.** This phase delivers the project foundation, database schema, homepage, About page and Contact page. Authentication, the reader, the admin dashboard, the writers' area and the reels feed are the next phases. See "Roadmap" below.

---

## Tech stack

- Next.js 15 (App Router) and React 19
- TypeScript
- Tailwind CSS
- Framer Motion (animations, respects reduced motion)
- CSS 3D books and starfield (lightweight, no WebGL needed for the hero)
- Supabase (PostgreSQL, Row Level Security, Auth and Storage, from later phases)

## Project structure

```
app/
  layout.tsx          Root layout, fonts, metadata, loader
  page.tsx            Homepage
  about/page.tsx      About MATHRA WORLD
  contact/page.tsx    Contact page
  actions/contact.ts  Secure contact form server action
  globals.css         Theme, glass cards, 3D books, reduced-motion rules
components/           Navbar, Footer, Hero, Starfield, FloatingBooks, StoryCard, ContactForm, LoadingScreen
data/sample-content.ts  DEMO stories and knowledge categories (clearly marked)
lib/site.ts           Brand name, slogan, creator and official social links
lib/supabase.ts       Public Supabase client (returns null if not configured)
supabase/schema.sql   Full database schema with Row Level Security
```

## Getting started

Requirements: Node.js 20.11 or newer, npm 10 or newer.

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

Build and type-check:

```bash
npm run typecheck
npm run build
npm start
```

## Environment variables

See `.env.example`. Summary:

| Variable | Public? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Anon key, protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **no, server only** | Admin tasks. Never put it in client code or a `NEXT_PUBLIC_` variable |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URL for SEO and sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | yes | Email shown on the Contact page (leave blank if not ready) |

Do not commit `.env.local`. It is listed in `.gitignore`.

## Database setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. In Authentication settings, enable the sign-in methods you want (from Phase 2).
4. Create your first admin: register normally, then in the SQL editor run
   `update public.profiles set role = 'admin' where username = 'your_username';`
   (Only run this yourself, in your own project. Roles cannot be changed from the website.)

## Security notes

- Row Level Security is on for every table. Visitors can read only published content.
- Users cannot change their own role. A database trigger enforces this.
- Contact form has input validation, a honeypot field and a basic rate limit. The rate limit is in-memory, so replace it with a shared store before running several server instances.
- Security headers (frame, content-type, referrer and permissions policies) are set in `next.config.mjs`.
- No private phone numbers or invented contact details are published anywhere on the site.

## Content rules

- All content in `data/sample-content.ts` is **original demonstration material**, marked `DEMO`.
- Do not paste copyrighted novels or other authors' work into the project.
- User-submitted stories will require administrator review before publication (Phase 3).

## Official links

- GitHub: https://github.com/denuvan-akash
- TikTok: https://www.tiktok.com/@mathra_quotes_1

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundation, schema, homepage, About, Contact | This release |
| 2 | Supabase Auth, profiles, reader with chapter navigation, bookmarks, likes, reading progress, search and category filters | Next |
| 3 | Writers' dashboard, submissions and review workflow, admin dashboard, comments and reports, knowledge hub articles | Planned |
| 4 | Photo and video community with vertical feed, uploads with thumbnails, SEO sitemap and robots, backups, deployment guide | Planned |

## Mobile testing

1. Run `npm run dev -- -H 0.0.0.0` and open the printed network address on your phone (same Wi-Fi).
2. Check the mobile menu, the reading layout and the Contact form on a real Android phone and an iPhone.
3. Turn on the phone's "reduce motion" setting and confirm the animations calm down.

## Deployment

Recommended: Vercel, with the same environment variables set in the project settings. Point the domain at the deployment and set `NEXT_PUBLIC_SITE_URL` to that domain. Back up the database from the Supabase dashboard regularly.

## Credits

Created by **Denuwan**. Powered by **MATHRA**.
