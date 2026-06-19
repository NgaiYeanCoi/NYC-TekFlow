"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpenIcon, GraduationCapIcon, LayoutDashboardIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/wiki", label: "知识库", icon: BookOpenIcon },
  { href: "/school", label: "学校事项", icon: GraduationCapIcon },
  { href: "/login", label: "管理后台", icon: LayoutDashboardIcon },
];

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex min-h-11 items-center gap-3 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-[0_8px_24px_rgba(37,99,235,0.18)]">T</span>
            <span className="flex flex-col leading-tight">
              <span>TekFlow</span>
              <span className="text-xs font-normal text-muted-foreground">个人知识库</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/25",
                    active && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon data-icon="inline-start" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto border-t border-border px-3 py-2 sm:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-muted-foreground",
                  active && "bg-accent text-accent-foreground",
                )}
              >
                <Icon data-icon="inline-start" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
    </div>
  );
}
