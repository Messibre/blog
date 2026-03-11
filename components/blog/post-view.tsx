"use client";

import { ArrowLeft, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Post {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  content: string;
  slug: string;
  readingTime?: string;
}

interface PostViewProps {
  post: Post;
  onBack: () => void;
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const trimmed = content.trim();
  if (!trimmed) return "1 min";
  const words = trimmed.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

export function PostView({ post, onBack }: PostViewProps) {
  const readingTime = post.readingTime || calculateReadingTime(post.content);

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* top-of-article back control for immediate visibility */}
      <button
        onClick={() => {
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          onBack();
        }}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm">Back to all posts</span>
      </button>

      <header className="mb-12">
        <time className="text-sm text-muted-foreground font-mono tracking-wide uppercase">
          {post.date}
        </time>
        <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{readingTime} read</span>
        </div>
      </header>

      <div className="prose-manuscript text-foreground/90">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-6 leading-relaxed">{children}</p>
            ),
            h1: ({ children }) => (
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl mt-10 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl mt-8 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-[family-name:var(--font-playfair)] text-xl mt-6 mb-2">
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-3 border-accent pl-6 my-8 italic text-muted-foreground">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
              >
                {children}
              </a>
            ),
            code: ({ children }) => (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-muted p-4 rounded overflow-x-auto mb-6 text-sm">
                {children}
              </pre>
            ),
            strong: ({ children }) => (
              <strong className="font-bold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
