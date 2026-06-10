# Southern Connecticut Volleyball — scvdig.com

Tournament site built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Pages

- **Home** (`/`) — banner, logo, title, links to everything
- **Rules** (`/rules`) — edit the content in `src/content/rules.ts`
- **Golf Scramble** (`/golf-scramble`) — edit the content in `src/content/golf.ts`
- **Free Agent Board** (`/free-agents`) — players pick a tournament date, up to 2 divisions, and post their name/email; anyone can browse and contact them. Posts are checked for a valid email and run through a profanity filter (`src/lib/profanity.ts`).
- **Admin** (`/admin`, linked in the footer) — password-protected page with the tournament list (add/delete dates, add/remove divisions per date) and post moderation. The free agent form only offers the dates and divisions you've added.
- **Register Now** — navbar button linking to VolleyballLife

Site-wide settings (links, divisions list, tagline) live in `src/lib/site.ts`.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add your branding

Drop these files into the `public/` folder (names matter):

- `logo.png` — shows in the navbar and on the home page hero
- `banner.jpg` — shows as the home page banner background

Until they exist, the site uses a volleyball icon and a dark gradient.

## Set up the Free Agent board (Supabase)

1. Create a free account at https://supabase.com and create a new project.
2. In the dashboard, open **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it.
3. Go to **Project Settings → API** and copy the **Project URL**, the
   **anon public** key, and the **service_role** key.
4. Copy `.env.example` to `.env.local`, paste those values in, and set
   `ADMIN_PASSWORD` to a password of your choosing.
5. Restart `npm run dev` — the board and admin page are now live.

## Admin page

Visit `/admin` (there's a small link in the footer) and sign in with your
`ADMIN_PASSWORD`. From there you can:

- **Manage the tournament list**: just add dates. Divisions are applied
  automatically by day of week (Saturday = Men's + Women's, Sunday = Revco);
  the division list lives in `src/lib/site.ts`. The free agent form only
  offers your dates, with that day's divisions.
- **Remove any free agent post** (spam, abuse, or by request).

The login lasts 30 days per browser. Changing `ADMIN_PASSWORD` signs
everyone out.

## Deploy to Vercel (free)

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, and click **Add New → Project**,
   then import the repo. Vercel auto-detects Next.js — no settings needed.
3. Under **Environment Variables**, add the same four values from `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_PASSWORD`.
4. Deploy. Then in the project's **Settings → Domains**, add `scvdig.com` and
   follow the DNS instructions shown (update the records at your domain registrar).

## Editing content later

| What | Where |
|---|---|
| Rules | `src/content/rules.ts` |
| Golf scramble details | `src/content/golf.ts` |
| Links, site name, division list | `src/lib/site.ts` |
| Logo / banner images | `public/logo.png`, `public/banner.jpg` |

After editing, commit and push — Vercel redeploys automatically.
