"use client";

import { Search, Sun, Moon, PenLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";

export function BlogHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="w-full py-8 px-6 md:px-8">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-[family-name:var(--font-playfair)] text-xl md:text-2xl text-foreground tracking-tight hover:text-accent transition-colors"
        >
          {/* custom logo in public folder; falls back to pen icon if SVG fails to load */}
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-5 h-5 text-accent"
            onError={(e) => {
              // when image fails, replace with pen icon
              const img = e.currentTarget;
              img.replaceWith(
                <PenLine className="w-5 h-5 text-accent" aria-hidden="true" />,
              );
            }}
          />
          Meseret Birhanu
        </Link>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-b border-muted-foreground/30 px-2 py-1 text-sm focus:outline-none focus:border-accent w-32 md:w-48"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 block dark:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
