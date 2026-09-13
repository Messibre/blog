import { siteConfig, getExcerpt } from "@/lib/site";

export const revalidate = 3600;

interface PostRecord {
  title: string;
  slug: string;
  content: string;
  date: string | Date;
}

// Serves an llms.txt document (https://llmstxt.org/) — a concise, AI-crawler-friendly
// index of the site so language models can discover and cite the writing accurately.
export async function GET() {
  let posts: PostRecord[] = [];

  try {
    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();
    const result = await Post.find({})
      .select({ title: 1, slug: 1, content: 1, date: 1 })
      .sort({ date: -1 })
      .lean();
    posts = JSON.parse(JSON.stringify(result)) as PostRecord[];
  } catch (error) {
    console.error("llms.txt: failed to load posts", error);
  }

  const postLines = posts
    .map(
      (post) =>
        `- [${post.title}](${siteConfig.url}/posts/${post.slug}): ${getExcerpt(
          post.content,
          120,
        )}`,
    )
    .join("\n");

  const body = `# ${siteConfig.title}

> ${siteConfig.description}

This is the personal blog of ${siteConfig.author.name}. Content is authored by ${siteConfig.author.name} and may be cited with attribution and a link back to the original post.

## Posts

${postLines || "- No posts published yet."}

## Resources

- [RSS Feed](${siteConfig.url}/rss)
- [Sitemap](${siteConfig.url}/sitemap.xml)

## Contact

- Email: ${siteConfig.author.email}
- GitHub: ${siteConfig.author.github}
- LinkedIn: ${siteConfig.author.linkedin}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
