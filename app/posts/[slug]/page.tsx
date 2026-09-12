"use client";

import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { BlogHeader } from "@/components/blog/header";
import { BlogFooter } from "@/components/blog/footer";
import { PostView } from "@/components/blog/post-view";
import type { Post } from "@/components/blog/post-list";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

const postSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
  date: z.string(),
  content: z.string(),
  slug: z.string(),
});

const fetcher = async (url: string) => {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Network error when fetching the post");
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid response format from server");
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Server returned invalid post data");
  }

  return parsed.data as Post;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;

  const {
    data: post,
    error,
    isLoading,
  } = useSWR<Post>(slug ? `/api/posts/${slug}` : null, fetcher);

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />

      <main className="flex-1 w-full px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto relative">
          <div
            className="absolute left-0 md:-left-8 top-0 bottom-0 w-px bg-notebook-line hidden md:block"
            aria-hidden="true"
          />

          <div className="md:pl-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner className="w-6 h-6 text-muted-foreground" />
              </div>
            ) : error ? (
              <Empty className="py-16">
                <EmptyTitle>Post not found</EmptyTitle>
                <EmptyDescription>{error.message}</EmptyDescription>
              </Empty>
            ) : post ? (
              <PostView
                post={{ ...post, date: formatDate(post.date) }}
                onBack={() => router.push("/")}
              />
            ) : null}
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
