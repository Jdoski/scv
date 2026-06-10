import Link from "next/link";
import { site } from "@/lib/site";
import VolleyballIcon from "./VolleyballIcon";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-white">
            <VolleyballIcon className="h-6 w-6 text-amber-400" />
            <span className="font-bold">{site.shortName}</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">{site.tagline}.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/rules" className="hover:text-amber-400">Rules</Link></li>
            <li><Link href="/golf-scramble" className="hover:text-amber-400">Golf Scramble</Link></li>
            <li><Link href="/free-agents" className="hover:text-amber-400">Free Agent Board</Link></li>
            <li>
              <a href={site.links.volleyballLife} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
                Register on VolleyballLife
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Follow Us
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={site.links.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
                Facebook
              </a>
            </li>
            <li>
              <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
