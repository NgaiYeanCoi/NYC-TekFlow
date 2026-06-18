import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpenIcon, GraduationCapIcon, LayoutDashboardIcon } from "lucide-react";

const navItems = [
  { href: "/wiki", label: "Wiki", icon: BookOpenIcon },
  { href: "/school", label: "School", icon: GraduationCapIcon },
  { href: "/login", label: "Dashboard", icon: LayoutDashboardIcon },
];

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">T</span>
            <span>TekFlow</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium hover:bg-accent">
                  <Icon data-icon="inline-start" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
