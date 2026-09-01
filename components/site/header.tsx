import { clinic, navLinks } from "@/lib/clinic";

function NavLinks() {
  return navLinks.map((link) => (
    <a key={link.href} href={link.href} className="text-slate no-underline">
      {link.label}
    </a>
  ));
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper/95 backdrop-blur-[8px]">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="flex items-center justify-between gap-4 py-3">
          <a
            href="#top"
            className="text-lg font-bold tracking-[0.01em] text-ink no-underline sm:text-[22px]"
          >
            {clinic.name}
          </a>

          <nav className="hidden min-w-0 flex-1 gap-[18px] overflow-x-auto text-[13px] tracking-[0.04em] whitespace-nowrap lg:flex">
            <NavLinks />
          </nav>

          <a
            href="#contact"
            className="inline-flex min-h-11 flex-none items-center border border-pine px-3.5 py-2 text-[15px] font-bold whitespace-nowrap text-pine no-underline hover:bg-pine/10"
          >
            Call us
          </a>
        </div>

        <nav className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-2.5 text-[13px] tracking-[0.04em] whitespace-nowrap [mask-image:linear-gradient(90deg,#000_0,#000_calc(100%-24px),transparent_100%)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
