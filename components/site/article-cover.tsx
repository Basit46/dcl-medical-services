import Image from "next/image";
import { ArrowUpRight, Building2, Newspaper, UsersRound } from "lucide-react";
import type { Article } from "@/lib/articles";

type ArticleCoverProps = {
  article: Article;
  featured?: boolean;
};

const coverIcons = [Building2, UsersRound, Newspaper];

export function ArticleCover({ article, featured = false }: ArticleCoverProps) {
  const articleIndex = Math.max(
    0,
    [
      "welcome-to-dcl-medical-services",
      "our-ketu-and-iju-ishaga-units",
      "keeping-in-touch-with-the-clinic",
    ].indexOf(article.slug),
  );
  const Icon = coverIcons[articleIndex % coverIcons.length];

  return (
    <div
      aria-hidden="true"
      className={`group/cover relative isolate flex overflow-hidden bg-linear-to-br from-primary-50 via-white to-primary-100 ${featured ? "min-h-[280px] sm:min-h-[360px]" : "min-h-[210px]"}`}
    >
      {article.coverImage ? (
        <Image
          src={article.coverImage.url}
          alt=""
          fill
          unoptimized
          sizes={
            featured
              ? "(max-width: 640px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, 33vw"
          }
          className="object-cover transition-transform duration-700 group-hover/cover:scale-105"
        />
      ) : (
        <>
          <div className="absolute -top-20 -right-12 size-72 rounded-full border border-primary-200/80" />
          <div className="absolute -top-8 -right-0 size-52 rounded-full border border-primary-200/50" />
          <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-primary-100/70 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white,transparent_55%)]" />
          <div className="absolute inset-0 flex items-center justify-center text-primary-600/55 transition-transform duration-700 group-hover/cover:scale-105">
            <Icon
              size={featured ? 116 : 82}
              strokeWidth={0.85}
              className="drop-shadow-[0_12px_18px_rgba(29,106,200,0.12)]"
            />
          </div>
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-primary-700 uppercase shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary-600" />
            DCL Medical Services
          </div>
        </>
      )}
      <div className="absolute right-5 bottom-5 inline-flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/85 text-primary-700 shadow-sm transition-transform duration-300 group-hover/cover:translate-x-1 group-hover/cover:-translate-y-1">
        <ArrowUpRight size={18} />
      </div>
    </div>
  );
}
