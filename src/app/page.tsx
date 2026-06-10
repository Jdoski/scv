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
    description: "Format, scoring, and everything you need to know before you play.",
    external: false,
  },
  {
    href: "/free-agents",
    title: "Free Agent Board",
    description: "Looking for a partner or a team? Post here and get picked up.",
    external: false,
  },
  {
    href: "/golf-scramble",
    title: "Golf Scramble",
    description: "Our annual off-the-sand outing. Food, prizes, and a great time.",
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
        className="relative flex min-h-[70vh] items-center justify-center bg-slate-900 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(2, 6, 23, 0.65), rgba(2, 6, 23, 0.8)), url('/banner.jpg')",
        }}
      >
        <div className="mx-auto max-w-4xl px-6 py-20 text-center text-white">
          {hasLogo ? (
            <Image
              src="/logo.png"
              alt={`${site.name} logo`}
              width={140}
              height={140}
              priority
              className="mx-auto rounded-full"
            />
          ) : (
            <VolleyballIcon className="mx-auto h-24 w-24 text-amber-400" />
          )}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            {site.name}
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">{site.tagline}.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
            )
          )}
        </div>
      </section>
    </div>
  );
}
