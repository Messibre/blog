// Central site configuration used across metadata, sitemap, robots, RSS and structured data.

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Meseret Birhanu",
  title: "Meseret Birhanu — Thoughts & Writing",
  description:
    "A personal blog by Meseret Birhanu exploring software engineering, technology, and perspectives on building things that matter.",
  url: normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL || "https://meseretbirhanu.com",
  ),
  author: {
    name: "Meseret Birhanu",
    email: "messibre21@gmail.com",
    github: "https://github.com/Messibre",
    linkedin: "https://linkedin.com/in/meseret-birhanu-nigus",
  },
  locale: "en_US",
  keywords: [
    "Meseret Birhanu",
    "software engineering",
    "technology blog",
    "personal blog",
    "programming",
    "web development",
    "engineering perspectives",
  ],
} as const;

export const siteUrl = siteConfig.url;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = ""): string {
  if (!path) return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Strip common markdown syntax and collapse whitespace into a plain-text excerpt. */
export function getExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}…`;
}
