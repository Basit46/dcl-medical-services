import { defineQuery } from "next-sanity";
import {
  articles as localArticles,
  type Article,
  type ArticleBlock,
} from "@/lib/articles";
import { sanityClient, sanityConfigured } from "./client";

const articleFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "coverImage": coverImage{ "url": asset->url },
  body[]{
    _type,
    style,
    listItem,
    markDefs[]{ _key, _type, href },
    children[]{ _type, text, marks },
    "url": asset->url
  }
`;

const articlesQuery = defineQuery(
  `*[_type == "article" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc){${articleFields}}`,
);
const articleBySlugQuery = defineQuery(
  `*[_type == "article" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{${articleFields}}`,
);

type SanityArticle = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: { url?: string };
  body?: Array<{
    _type?: string;
    style?: string;
    listItem?: string;
    markDefs?: Array<{ _key?: string; _type?: string; href?: string }>;
    children?: Array<{ _type?: string; text?: string; marks?: string[] }>;
    url?: string;
  }>;
};

function mapBody(blocks: SanityArticle["body"] = []): ArticleBlock[] {
  const result: ArticleBlock[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length) result.push({ type: "list", items: listItems });
    listItems = [];
  };

  for (const block of blocks) {
    if (block.listItem) {
      const text = block.children
        ?.map((child) => child.text ?? "")
        .join("")
        .trim();
      if (text) listItems.push(text);
      continue;
    }

    flushList();

    if (block._type === "image" && block.url) {
      result.push({
        type: "image",
        url: block.url,
      });
      continue;
    }

    const text = block.children
      ?.map((child) => child.text ?? "")
      .join("")
      .trim();
    if (!text) continue;

    if (block.style === "h2" || block.style === "h3") {
      result.push({ type: "heading", text });
    } else {
      result.push({ type: "paragraph", text });
    }
  }

  flushList();
  return result;
}

function mapArticle(document: SanityArticle): Article | null {
  if (!document.slug || !document.title || !document.publishedAt) return null;

  return {
    slug: document.slug,
    title: document.title,
    excerpt: document.excerpt ?? "",
    publishedAt: document.publishedAt,
    coverImage: document.coverImage?.url
      ? { url: document.coverImage.url }
      : undefined,
    body: mapBody(document.body),
    portableBody: document.body,
  };
}

export async function getArticles(): Promise<Article[]> {
  if (!sanityConfigured || !sanityClient) return localArticles;

  try {
    const documents = await sanityClient.fetch<SanityArticle[]>(
      articlesQuery,
      {},
      {
        next: { revalidate: 60, tags: ["sanity:articles"] },
      },
    );
    const publishedArticles = documents
      .map(mapArticle)
      .filter((item): item is Article => item !== null);
    return publishedArticles.length ? publishedArticles : localArticles;
  } catch {
    return localArticles;
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (sanityConfigured && sanityClient) {
    try {
      const document = await sanityClient.fetch<SanityArticle | null>(
        articleBySlugQuery,
        { slug },
        {
          next: {
            revalidate: 60,
            tags: ["sanity:articles", `sanity:article:${slug}`],
          },
        },
      );
      const article = document ? mapArticle(document) : null;
      if (article) return article;
    } catch {
      return localArticles.find((article) => article.slug === slug) ?? null;
    }
  }

  return localArticles.find((article) => article.slug === slug) ?? null;
}
