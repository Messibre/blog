"use client";

import Link from "next/link";

export interface Post {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  content: string;
  slug: string;
}

interface PostListProps {
  posts: Post[];
}

function getPreview(content: string, maxLength: number = 150): string {
  const plainText = content.replace(/[#*`_~\[\]]/g, "").trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <article key={post._id || post.id || post.slug} className="group">
          <Link href={`/posts/${post.slug}`} className="block text-left w-full">
            <time className="text-sm text-muted-foreground font-mono tracking-wide uppercase">
              {post.date}
            </time>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-foreground leading-tight">
              <span className="highlight-hover">{post.title}</span>
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-2">
              {getPreview(post.content)}
            </p>
          </Link>
        </article>
      ))}
    </div>
  );
}
