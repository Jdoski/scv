"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import VolleyballIcon from "./VolleyballIcon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "Rules" },
  { href: "/golf-scramble", label: "Golf Scramble" },
  { href: "/free-agents", label: "Free Agents" },
];

export default function Navbar({ hasLogo }: { hasLogo: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {hasLogo ? (
            <Image src="/logo.png" alt={`${site.shortName} logo`} width={40} height={40} className="rounded-full" />
          ) : (
            <VolleyballIcon className="h-9 w-9 text-amber-400" />
          )}
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            {site.shortName}
            <span className="ml-2 hidden font-normal text-slate-300 md:inline">
              {site.name}
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-slate-800 text-amber-400"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={site.links.volleyballLife}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
          >
            Register Now
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-md p-2 text-slate-200 hover:bg-slate-800 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            {open ? (
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-800 px-4 pb-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-base font-medium ${
                pathname === link.href
                  ? "bg-slate-800 text-amber-400"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={site.links.volleyballLife}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-md bg-amber-400 px-3 py-2.5 text-center text-base font-semibold text-slate-900"
          >
            Register Now
          </a>
        </div>
      )}
    </header>
  );
}
