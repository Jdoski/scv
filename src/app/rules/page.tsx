import type { Metadata } from "next";
import { ruleSections, rulesIntro } from "@/content/rules";

export const metadata: Metadata = {
  title: "Rules",
  description: "Official tournament rules for SCV volleyball events.",
};

// Turns any URL inside a rule into a clickable link.
function renderWithLinks(text: string) {
  return text.split(/(https?:\/\/\S+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-amber-700 underline decoration-amber-400 decoration-2 underline-offset-2 hover:text-amber-600"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        Tournament Rules
      </h1>
      <p className="mt-4 text-lg text-slate-600">{rulesIntro}</p>

      <div className="mt-10 space-y-10">
        {ruleSections.map((section) => (
          <section key={section.title}>
            <h2 className="border-b-2 border-amber-400 pb-2 text-2xl font-bold text-slate-900">
              {section.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {section.rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  <span>{renderWithLinks(rule)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
