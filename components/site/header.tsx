"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clinic, navLinks } from "@/lib/clinic";

function NavLinks({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href.startsWith("#") ? `/${link.href}` : link.href}
      onClick={onNavigate}
      className={
        mobile
          ? "rounded-lg px-3 py-2.5 text-sm font-medium text-primary-800 no-underline transition-colors hover:bg-white hover:text-primary-600"
          : "rounded-full px-3 py-2 text-[12px] font-semibold tracking-[0.02em] text-primary-800 no-underline transition-colors hover:bg-white hover:text-primary-600 hover:shadow-sm"
      }
    >
      {link.label}
    </Link>
  ));
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-white/95 shadow-sm shadow-primary-900/5 backdrop-blur-xl">
      <div className="mx-auto max-w-[1250px] px-5">
        <div className="flex min-h-[78px] items-center justify-between gap-5 py-3">
          <Link
            href="/#top"
            aria-label={clinic.name}
            className="flex flex-none flex-col items-start no-underline"
          >
            <Image
              src="/dcl-logo.jpg"
              alt={clinic.name}
              width={1200}
              height={200}
              priority
              className="h-auto w-[170px] sm:w-[215px]"
            />
            <span className="ml-1 mt-0.5 text-[9px] font-bold tracking-[0.2em] text-primary-700 uppercase">
              Ketu · Iju-Ishaga
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center rounded-full border border-primary-100 bg-primary-50/70 p-1 lg:flex"
          >
            <NavLinks />
          </nav>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="rounded-full border-primary-100 text-primary-800 lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="grid grid-cols-2 gap-1 border-t border-primary-100 py-3 lg:hidden"
          >
            <NavLinks mobile onNavigate={() => setMobileMenuOpen(false)} />
          </nav>
        )}
      </div>
    </header>
  );
}
