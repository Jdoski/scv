import type { Metadata } from "next";
import { golfEvent } from "@/content/golf";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Golf Scramble",
  description: "Join the SCV community for our annual golf scramble.",
};

export default function GolfScramblePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-emerald-900 to-emerald-700 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {golfEvent.headline}
          </h1>
          <p className="mt-5 text-lg text-emerald-100">
            {golfEvent.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="text-2xl font-bold text-slate-900">Event Details</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {golfEvent.details.map((d) => (
            <div
              key={d.label}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {d.label}
              </dt>
              <dd className="mt-1 font-medium text-slate-900">{d.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 text-2xl font-bold text-slate-900">
          What&apos;s Included
        </h2>
        <ul className="mt-4 space-y-3">
          {golfEvent.includes.map((item) => (
            <li key={item} className="flex gap-3 text-slate-700">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-xl bg-emerald-50 p-6 text-center">
          <h2 className="text-xl font-bold text-emerald-900">Ready to play?</h2>
          <p className="mt-2 text-emerald-800">{golfEvent.signupNote}</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={site.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-700 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Message us on Facebook
            </a>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-emerald-700 px-6 py-2.5 font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              Message us on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
