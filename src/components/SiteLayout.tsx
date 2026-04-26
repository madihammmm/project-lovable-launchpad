import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/add-perfume", label: "Add Perfume" },
  { to: "/manage", label: "Manage" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();

  return (
    <div className="dream-bg flex min-h-screen flex-col bg-background text-foreground">
      <div className="sparkle-field" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/25 bg-card/70 text-lg shadow-[var(--shadow-soft)]">
              ✦
            </span>
            <span>
              <span className="block font-serif text-xl font-bold leading-none">DreamScents</span>
              <span className="text-xs text-muted-foreground">Where Fragrance Meets Fantasy</span>
            </span>
          </Link>
          <nav className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {NAV.map((item) => {
              const active = item.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-all hover:-translate-y-0.5",
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="relative z-10 flex-1">{children}</main>
      <footer className="relative z-10 border-t border-border/60 bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground backdrop-blur">
        © {new Date().getFullYear()} DreamScents · React + Vite frontend · Express/MongoDB backend ready
      </footer>
    </div>
  );
}
