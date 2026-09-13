import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BlogHeader } from "@/components/blog/header";
import { BlogFooter } from "@/components/blog/footer";
import { PostView } from "@/components/blog/post-view";
import { siteConfig, absoluteUrl, getExcerpt } from "@/lib/site";

interface PostRecord {
  _id?: string;
  title: string;
  content: string;
  slug: string;
  date: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Cached so generateMetadata and the page component share a single DB read per request.
const getPost = cache(async (slug: string): Promise<PostRecord | null> => {
  try {
    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();
    const post = await Post.findOne({ slug: slug.toLowerCase() }).lean();
    if (!post) return null;

    return JSON.parse(JSON.stringify(post)) as PostRecord;
  } catch (error) {
    console.error("Error loading post for slug", slug, error);
    return null;
  }
});

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested post could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const description = getExcerpt(post.content);
  const url = absoluteUrl(`/posts/${post.slug}`);
  const publishedTime = new Date(post.date).toISOString();
  const modifiedTime = new Date(post.updatedAt ?? post.date).toISOString();

  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime,
      modifiedTime,
      authors: [siteConfig.author.name],
      siteName: siteConfig.title,
      images: [
        {
          url: absoluteUrl("/logo.png"),
          width: 640,
          height: 640,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [absoluteUrl("/logo.png")],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const description = getExcerpt(post.content);
  const url = absoluteUrl(`/posts/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updatedAt ?? post.date).toISOString(),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: absoluteUrl("/logo.png"),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHeader />

      <main className="flex-1 w-full px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto relative">
          <div
            className="absolute left-0 md:-left-8 top-0 bottom-0 w-px bg-notebook-line hidden md:block"
            aria-hidden="true"
          />

          <div className="md:pl-8">
            <PostView
              post={{
                _id: post._id,
                title: post.title,
                content: post.content,
                slug: post.slug,
                date: formatDate(post.date),
              }}
              backHref="/"
            />
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
