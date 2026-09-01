"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clinic } from "@/lib/clinic";

export function Splash() {
  const [phase, setPhase] = useState<"in" | "leaving" | "gone">("in");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback(() => {
    setPhase((current) => {
      if (current !== "in") return current;
      timers.current.push(setTimeout(() => setPhase("gone"), 560));
      return "leaving";
    });
  }, []);

  useEffect(() => {
    timers.current.push(setTimeout(dismiss, 3000));
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, [dismiss]);

  if (phase === "gone") return null;

  return (
    <div
      onClick={dismiss}
      className={`fixed inset-0 z-90 flex cursor-pointer flex-col items-center justify-center bg-forest p-8 text-center text-surface ${
        phase === "leaving" ? "animate-splash-out" : ""
      }`}
    >
      <div className="flex animate-splash-in flex-col items-center gap-[22px]">
        <span className="h-px w-14 bg-gold" />
        <span className="text-[11px] tracking-[0.28em] uppercase text-gold">
          {clinic.legalName}
        </span>
        <h1 className="m-0 max-w-[14ch] font-display text-[46px] leading-[1.08] font-normal tracking-[-0.02em] text-surface">
          {clinic.name}
        </h1>
        <p className="m-0 text-[26px] tracking-[0.03em] text-gold">{clinic.tagline}</p>
        <span className="h-px w-14 bg-white/28" />
      </div>
    </div>
  );
}
