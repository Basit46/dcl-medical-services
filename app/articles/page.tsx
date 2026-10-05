import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/sanity/lib/articles";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { ArticleCover } from "@/components/site/article-cover";
import { ChatProvider } from "@/components/site/chat";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import type { Article } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "News, updates, and articles from DCL Medical Services in Ketu and Iju-Ishaga, Lagos.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-primary-700">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays size={14} />
        {formatDate(article.publishedAt)}
      </span>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group overflow-hidden rounded-2xl border border-primary-100 bg-white text-inherit no-underline shadow-plate transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-panel"
    >
      <ArticleCover article={article} />
      <div className="flex min-h-[245px] flex-col p-5 sm:p-6">
        <h2 className="m-0 mb-2 font-display text-[25px] leading-[1.12] font-normal text-primary-900 transition-colors group-hover:text-primary-600">
          {article.title}
        </h2>
        <p className="m-0 mb-5 text-sm leading-[1.7] text-primary-800">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-primary-100 pt-4">
          <ArticleMeta article={article} />
          <ArrowRight
            size={18}
            className="shrink-0 text-primary-600 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  const featuredArticle = articles[0];
  const otherArticles = articles.filter(
    (article) => article.slug !== featuredArticle.slug,
  );

  return (
    <ChatProvider>
      <div className="w-full max-w-full overflow-x-hidden">
        <SiteHeader />
        <main>
          <section className="border-b border-primary-100 bg-white">
            <div className="mx-auto max-w-[1250px] px-5 pt-14 pb-12 sm:pt-20 sm:pb-16">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-2 text-[10px] font-bold tracking-[0.18em] text-primary-700 uppercase">
                <Sparkles size={14} />
                From DCL Medical Services
              </div>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h1 className="m-0 max-w-[12ch] font-display text-[clamp(42px,8vw,72px)] leading-[0.98] font-normal tracking-[-0.035em] text-primary-900">
                    Articles & updates
                  </h1>
                </div>
                <p className="m-0 max-w-[44ch] text-[16px] leading-[1.75] text-primary-800">
                  Clinic news, service updates, and stories from our Ketu and
                  Iju-Ishaga units.
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1250px] px-5 py-12 sm:py-16">
            {featuredArticle && (
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="group mb-12 grid overflow-hidden rounded-3xl border border-primary-100 bg-white text-inherit no-underline shadow-plate transition-all duration-300 hover:border-primary-200 hover:shadow-panel sm:grid-cols-[1fr_0.92fr]"
              >
                <div className="flex flex-col items-start justify-center p-6 sm:p-9 lg:p-12">
                  <span className="mb-5 rounded-full bg-primary-600 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                    Latest article
                  </span>
                  <h2 className="m-0 mb-4 max-w-[15ch] font-display text-[clamp(32px,4vw,48px)] leading-[1.05] font-normal tracking-[-0.025em] text-primary-900 transition-colors group-hover:text-primary-600">
                    {featuredArticle.title}
                  </h2>
                  <p className="m-0 mb-6 max-w-[46ch] text-[15px] leading-[1.75] text-primary-800">
                    {featuredArticle.excerpt}
                  </p>
                  <ArticleMeta article={featuredArticle} />
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary-600">
                    Read the article
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
                <ArticleCover article={featuredArticle} featured />
              </Link>
            )}

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-primary-100 pb-4">
              <div>
                <p className="m-0 mb-1 text-[10px] font-bold tracking-[0.18em] text-primary-600 uppercase">
                  The latest
                </p>
                <h2 className="m-0 font-display text-3xl font-normal text-primary-900">
                  More articles
                </h2>
              </div>
              <span className="text-xs text-primary-700">
                {otherArticles.length} more articles
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </ChatProvider>
  );
}
