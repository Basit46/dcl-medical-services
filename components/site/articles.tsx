import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { ArticleCover } from "@/components/site/article-cover";
import { getArticles } from "@/sanity/lib/articles";
import type { Article } from "@/lib/articles";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white text-inherit no-underline shadow-plate transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-panel"
    >
      <ArticleCover article={article} />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="m-0 mb-2 font-display text-xl leading-[1.15] font-normal text-primary-900 transition-colors group-hover:text-primary-600">
          {article.title}
        </h3>
        <p className="m-0 mb-4 line-clamp-3 text-sm leading-[1.7] text-primary-800">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-primary-100 pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-primary-700">
            <CalendarDays size={13} />
            {formatDate(article.publishedAt)}
          </span>
          <ArrowRight
            size={16}
            className="shrink-0 text-primary-600 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export async function Articles() {
  const articles = (await getArticles()).slice(0, 3);

  if (!articles.length) return null;

  return (
    <section id="articles" className="border-y border-primary-100 bg-white">
      <div className="mx-auto max-w-[1250px] px-5 py-14 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-primary-700 uppercase">
              <Sparkles size={13} />
              From the clinic
            </span>
            <h2 className="m-0 font-display text-4xl font-normal tracking-[-0.02em] text-primary-900 sm:text-5xl">
              Articles &amp; updates
            </h2>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-bold text-primary-700 no-underline transition-colors hover:bg-primary-600 hover:text-white"
          >
            View all articles
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
