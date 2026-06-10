import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";
import VolleyballIcon from "@/components/VolleyballIcon";

const features = [
  {
    href: "/rules",
    title: "Tournament Rules",
    description:
      "Format, scoring, and everything you need to know before you play.",
    external: false,
  },
  {
    href: "/free-agents",
    title: "Free Agent Board",
    description:
      "Looking for a partner or a team? Post here and get picked up.",
    external: false,
  },
  {
    href: "/golf-scramble",
    title: "Golf Scramble",
    description:
      "Our annual off-the-sand outing. Food, prizes, and a great time.",
    external: false,
  },
  {
    href: site.links.volleyballLife,
    title: "Register to Play",
    description: "Sign up for upcoming tournaments on VolleyballLife.",
    external: true,
  },
];

export default function Home() {
  // Drop banner.jpg and logo.png into /public to replace the placeholders.
  const hasLogo = fs.existsSync(path.join(process.cwd(), "public", "logo.png"));

  return (
    <div>
      {/* Hero — banner.jpg shows behind the gradient once added to /public */}
      <section
        className="relative flex min-h-[70vh] items-start justify-center bg-slate-900 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2, 6, 23, 0.15), rgba(2, 6, 23, 0.15)), url('/banner.jpeg')",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 pt-8 pb-6 text-center text-white">
          {hasLogo ? (
            <Image
              src="/logo.png"
              alt={`${site.name} logo`}
              width={96}
              height={96}
              priority
              className="mx-auto rounded-full"
            />
          ) : (
            <VolleyballIcon className="mx-auto h-16 w-16 text-amber-400" />
          )}
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-6xl">
            {site.name}
          </h1>
          <p className="mt-2 text-lg text-slate-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-xl">
            {site.tagline}.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={site.links.volleyballLife}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-amber-400 px-8 py-3 text-base font-semibold text-slate-900 transition-colors hover:bg-amber-300 sm:w-auto"
            >
              Register for a Tournament
            </a>
            <Link
              href="/free-agents"
              className="w-full rounded-lg border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
            >
              Find a Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) =>
            f.external ? (
              <a
                key={f.title}
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600">
                  {f.title} ↗
                </h2>
                <p className="mt-2 text-sm text-slate-600">{f.description}</p>
              </a>
            ) : (
              <Link
                key={f.title}
                href={f.href}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600">
                  {f.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{f.description}</p>
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
