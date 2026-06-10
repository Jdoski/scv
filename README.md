# Southern Connecticut Volleyball — scvdig.com

Tournament site built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Pages

- **Home** (`/`) — banner, logo, title, links to everything
- **Rules** (`/rules`) — edit the content in `src/content/rules.ts`
- **Golf Scramble** (`/golf-scramble`) — edit the content in `src/content/golf.ts`
- **Free Agent Board** (`/free-agents`) — players post name/email/division/date; anyone can browse and contact them
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
3. Go to **Project Settings → API** and copy the **Project URL** and the
   **anon public** key.
4. Copy `.env.example` to `.env.local` and paste those two values in.
5. Restart `npm run dev` — the board is now live.

To remove a post (moderation), use the Supabase dashboard:
**Table Editor → free_agents → delete the row.**

## Deploy to Vercel (free)

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, and click **Add New → Project**,
   then import the repo. Vercel auto-detects Next.js — no settings needed.
3. Under **Environment Variables**, add the same two values from `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Then in the project's **Settings → Domains**, add `scvdig.com` and
   follow the DNS instructions shown (update the records at your domain registrar).

## Editing content later

| What | Where |
|---|---|
| Rules | `src/content/rules.ts` |
| Golf scramble details | `src/content/golf.ts` |
| Links, divisions, site name | `src/lib/site.ts` |
| Logo / banner images | `public/logo.png`, `public/banner.jpg` |

After editing, commit and push — Vercel redeploys automatically.
