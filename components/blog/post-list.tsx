"use client"

export interface Post {
  _id?: string
  id?: string
  title: string
  date: string
  content: string
  slug: string
}

interface PostListProps {
  posts: Post[]
  onSelectPost: (post: Post) => void
}

function getPreview(content: string, maxLength: number = 150): string {
  const plainText = content.replace(/[#*`_~\[\]]/g, '').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

export function PostList({ posts, onSelectPost }: PostListProps) {
  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <article key={post._id || post.id} className="group">
          <button
            onClick={() => onSelectPost(post)}
            className="text-left w-full"
          >
            <time className="text-sm text-muted-foreground font-mono tracking-wide uppercase">
              {post.date}
            </time>
            <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-foreground leading-tight">
              <span className="highlight-hover">{post.title}</span>
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-2">
              {getPreview(post.content)}
            </p>
          </button>
        </article>
      ))}
    </div>
  )
}
