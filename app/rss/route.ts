import { connectToDatabase } from "@/lib/db"
import Post from "@/models/Post"

function getExcerpt(content: string, maxLength: number = 200): string {
  const plainText = content.replace(/[#*`_~\[\]]/g, '').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meseretbirhanu.com"
  
  try {
    await connectToDatabase()
    const posts = await Post.find({ published: true }).sort({ date: -1 }).lean()
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Meseret Birhanu — Thoughts &amp; Writing</title>
    <link>${siteUrl}</link>
    <description>A personal blog exploring engineering, perspectives, and the future of technology.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/post/${post.slug}</link>
      <description>${escapeXml(getExcerpt(post.content))}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/post/${post.slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("RSS feed error:", error)
    return new Response("Error generating RSS feed", { status: 500 })
  }
}
