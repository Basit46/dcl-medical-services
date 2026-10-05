import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCover } from "@/components/site/article-cover";
import { ChatProvider } from "@/components/site/chat";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { articles as localArticles } from "@/lib/articles";
import { clinic } from "@/lib/clinic";
import { getArticle, getArticles } from "@/sanity/lib/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="m-0">{children}</p>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="m-0 pt-2 font-display text-3xl leading-tight font-normal text-primary-900">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="m-0 pt-2 font-display text-2xl leading-tight font-normal text-primary-900">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="m-0 border-l-4 border-primary-300 pl-5 italic text-primary-700">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: ReactNode;
      value?: { href?: string };
    }) => (
      <a
        href={value?.href}
        className="font-semibold text-primary-600 underline underline-offset-4"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: { url?: string } }) =>
      value.url ? (
        <figure className="my-8 overflow-hidden rounded-2xl border border-primary-100">
          <Image
            src={value.url}
            alt=""
            width={1200}
            height={800}
            unoptimized
            className="h-auto w-full object-cover"
          />
        </figure>
      ) : null,
  },
};

export function generateStaticParams() {
  return localArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: new Date(article.publishedAt).toISOString(),
    },
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const allArticles = await getArticles();
  const relatedArticles = allArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 2);

  return (
    <ChatProvider>
      <div className="w-full max-w-full overflow-x-hidden">
        <SiteHeader />
        <main className="bg-white">
          <article>
            <header className="mx-auto max-w-[900px] px-5 pt-10 pb-8 sm:pt-14 sm:pb-10">
              <Link
                href="/articles"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 no-underline transition-colors hover:text-primary-500"
              >
                <ArrowLeft size={17} />
                All articles
              </Link>
              <h1 className="m-0 mb-5 font-display text-[clamp(38px,7vw,66px)] leading-[1.02] font-normal tracking-[-0.03em] text-primary-900">
                {article.title}
              </h1>
              <p className="m-0 mb-6 max-w-[68ch] text-[17px] leading-[1.75] text-primary-800 sm:text-lg">
                {article.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-primary-700">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="font-semibold text-primary-800">
                  {clinic.name}
                </span>
              </div>
            </header>

            <div className="mx-auto max-w-[1100px] px-5">
              <div className="overflow-hidden rounded-3xl border border-primary-100 shadow-plate">
                <ArticleCover article={article} featured />
              </div>
            </div>

            <div className="mx-auto grid max-w-[1100px] gap-10 px-5 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
              <div className="mx-auto w-full max-w-[72ch]">
                <div className="space-y-6 text-[16px] leading-[1.9] text-primary-900/90 sm:text-[17px]">
                  {article.portableBody ? (
                    <PortableText
                      value={article.portableBody as never}
                      components={portableTextComponents}
                    />
                  ) : (
                    article.body.map((block, index) => {
                      if (block.type === "heading") {
                        return (
                          <h2
                            key={`${article.slug}-${index}`}
                            className="m-0 pt-2 font-display text-3xl leading-tight font-normal text-primary-900"
                          >
                            {block.text}
                          </h2>
                        );
                      }

                      if (block.type === "list") {
                        return (
                          <ul
                            key={`${article.slug}-${index}`}
                            className="m-0 flex list-disc flex-col gap-3 pl-6 marker:text-primary-500"
                          >
                            {block.items.map((item) => (
                              <li key={item} className="pl-1">
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      if (block.type === "image") {
                        return (
                          <figure
                            key={`${article.slug}-${index}`}
                            className="my-8 overflow-hidden rounded-2xl border border-primary-100"
                          >
                            <Image
                              src={block.url}
                              alt=""
                              width={1200}
                              height={800}
                              unoptimized
                              className="h-auto w-full object-cover"
                            />
                          </figure>
                        );
                      }

                      return (
                        <p key={`${article.slug}-${index}`} className="m-0">
                          {block.text}
                        </p>
                      );
                    })
                  )}
                </div>
                <div className="mt-10 border-t border-primary-100 pt-6">
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 no-underline hover:text-primary-800"
                  >
                    <ArrowLeft size={17} />
                    Browse all articles
                  </Link>
                </div>
              </div>

              <aside className="self-start rounded-2xl bg-primary-900 p-5 text-white sm:p-6">
                <p className="m-0 mb-2 text-[10px] font-bold tracking-[0.18em] text-primary-200 uppercase">
                  Need to reach us?
                </p>
                <h2 className="m-0 mb-3 font-display text-2xl font-normal">
                  We’re here to help.
                </h2>
                <p className="m-0 mb-5 text-sm leading-[1.7] text-primary-100">
                  Contact the hospital team directly for clinic information.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white no-underline"
                >
                  Contact the clinic
                  <ArrowRight size={16} />
                </Link>
              </aside>
            </div>
          </article>

          {relatedArticles.length > 0 && (
            <section className="border-t border-primary-100 bg-primary-50/60">
              <div className="mx-auto max-w-[1100px] px-5 py-12 sm:py-14">
                <p className="m-0 mb-2 text-[10px] font-bold tracking-[0.18em] text-primary-600 uppercase">
                  Keep reading
                </p>
                <h2 className="m-0 mb-6 font-display text-3xl font-normal text-primary-900">
                  More from DCL
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/articles/${related.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-primary-100 bg-white p-5 text-inherit no-underline transition-colors hover:border-primary-300"
                    >
                      <span>
                        <span className="font-display text-xl text-primary-900 group-hover:text-primary-600">
                          {related.title}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        className="shrink-0 text-primary-600 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
        <SiteFooter />
      </div>
    </ChatProvider>
  );
}
