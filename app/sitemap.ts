import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

interface PostRecord {
  slug: string;
  date: string | Date;
  updatedAt?: string | Date;
}

async function getPosts(): Promise<PostRecord[]> {
  try {
    const { default: dbConnect } = await import("@/lib/db");
    const { default: Post } = await import("@/models/Post");

    await dbConnect();
    const posts = await Post.find({})
      .select({ slug: 1, date: 1, updatedAt: 1 })
      .sort({ date: -1 })
      .lean();

    return JSON.parse(JSON.stringify(posts)) as PostRecord[];
  } catch (error) {
    console.error("Sitemap: failed to load posts", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postEntries,
  ];
}
