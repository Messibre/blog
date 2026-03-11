"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { z } from "zod";
import { BlogHeader } from "@/components/blog/header";
import { BlogFooter } from "@/components/blog/footer";
import { PostList, type Post } from "@/components/blog/post-list";
import { PostView } from "@/components/blog/post-view";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

// validate on client side as well so that malformed data doesn't crash the app silently
const postArraySchema = z.array(
  z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    title: z.string(),
    date: z.string(),
    content: z.string(),
    slug: z.string(),
  }),
);

const fetcher = async (url: string) => {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (networkError: any) {
    throw new Error("Network error when fetching posts");
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch (e) {
    // non-JSON body; whatever the server returned is unexpected
    throw new Error("Invalid response format from server");
  }

  if (!res.ok) {
    const message =
      (data as { error?: string; message?: string } | null)?.error ||
      (data as { message?: string } | null)?.message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  // ensure the array conforms to expected shape
  const parsed = postArraySchema.safeParse(data);
  if (!parsed.success) {
    console.error("Post list validation failed", parsed.error.format());
    throw new Error("Server returned invalid post data");
  }

  return parsed.data as Post[];
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const {
    data: rawPosts,
    error,
    isLoading,
  } = useSWR<Post[]>("/api/posts", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
  });

  // Format dates from MongoDB
  const posts =
    rawPosts?.map((post) => ({
      ...post,
      date: formatDate(post.date),
    })) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />

      <main className="flex-1 w-full px-6 md:px-8 py-8 md:py-12">
        {/* Notebook margin effect container */}
        <div className="max-w-2xl mx-auto relative">
          {/* Left margin line */}
          <div
            className="absolute left-0 md:-left-8 top-0 bottom-0 w-px bg-notebook-line hidden md:block"
            aria-hidden="true"
          />

          {/* Content area */}
          <div className="md:pl-8">
            {selectedPost ? (
              <PostView
                post={selectedPost}
                onBack={() => setSelectedPost(null)}
              />
            ) : (
              <>
                <div className="mb-12">
                  <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-foreground mb-4">
                    Thoughts & Writing
                  </h1>
                  <p className="text-muted-foreground leading-relaxed max-w-lg">
                    Personal reflections on engineering, technology, and
                    building things that matter.
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Spinner className="w-6 h-6 text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">
                      Failed to load posts. {error.message}
                    </p>
                  </div>
                ) : posts.length === 0 ? (
                  <Empty className="py-16">
                    <EmptyTitle>No posts yet</EmptyTitle>
                    <EmptyDescription>
                      The first thought awaits...
                    </EmptyDescription>
                  </Empty>
                ) : (
                  <PostList posts={posts} onSelectPost={setSelectedPost} />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
