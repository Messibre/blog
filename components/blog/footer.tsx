import Link from "next/link"
import { Mail, Github, Linkedin, Rss } from "lucide-react"

export function BlogFooter() {
  return (
    <footer className="w-full py-10 px-6 md:px-8 mt-16 border-t border-notebook-line bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Social Links Row */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <a
            href="mailto:messibre21@gmail.com"
            className="group relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <span className="absolute inset-0 rounded-full bg-highlight opacity-0 group-hover:opacity-100 transition-opacity" />
            <Mail className="w-4 h-4 relative z-10" />
          </a>
          
          <a
            href="https://github.com/Messibre"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <span className="absolute inset-0 rounded-full bg-highlight opacity-0 group-hover:opacity-100 transition-opacity" />
            <Github className="w-4 h-4 relative z-10" />
          </a>
          
          <a
            href="https://linkedin.com/in/meseret-birhanu-nigus"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <span className="absolute inset-0 rounded-full bg-highlight opacity-0 group-hover:opacity-100 transition-opacity" />
            <Linkedin className="w-4 h-4 relative z-10" />
          </a>
          
          <Link
            href="/rss"
            className="group relative flex items-center gap-1.5 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="absolute inset-0 rounded bg-highlight opacity-0 group-hover:opacity-100 transition-opacity" />
            <Rss className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">RSS Feed</span>
          </Link>
        </div>
        
        {/* Legacy Note */}
        <p className="text-center text-xs text-muted-foreground/70 tracking-wide">
          © 2026 — 2036 | A decade of thoughts.
        </p>
      </div>
    </footer>
  )
}
