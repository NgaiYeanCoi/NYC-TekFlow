"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  FileTextIcon,
  FolderIcon,
  GraduationCapIcon,
  HomeIcon,
  LayoutDashboardIcon,
  PaperclipIcon,
  SettingsIcon,
  TagsIcon,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/layout/logout-button";
import { cn } from "@/lib/utils";
import type { UserSummary } from "@/types/tekflow";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "概览", icon: LayoutDashboardIcon },
  { href: "/dashboard/posts", label: "内容", icon: FileTextIcon },
  { href: "/dashboard/school", label: "学校事项", icon: GraduationCapIcon },
  { href: "/dashboard/categories", label: "分类", icon: FolderIcon },
  { href: "/dashboard/tags", label: "标签", icon: TagsIcon },
  { href: "/dashboard/projects", label: "项目", icon: BookOpenIcon },
  { href: "/dashboard/attachments", label: "附件", icon: PaperclipIcon },
  { href: "/dashboard/settings", label: "设置", icon: SettingsIcon },
];

export function DashboardShell({ user, children }: { user: UserSummary; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex min-h-16 items-center gap-3 border-b border-border px-4">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-[0_8px_24px_rgba(37,99,235,0.18)]">T</span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">TekFlow</span>
            <span className="text-xs text-muted-foreground">管理工作台</span>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/25",
                  active && "bg-accent text-accent-foreground",
                )}
              >
                <Icon data-icon="inline-start" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-border p-4 text-xs leading-5 text-muted-foreground lg:block">
          <div className="rounded-lg bg-muted p-3">
            <div className="font-semibold text-foreground">发布提醒</div>
            <p className="mt-1">公开前确认内容已脱敏；学校事项请补齐日期、截止时间和课程信息。</p>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur lg:px-6">
          <div className="flex min-w-0 flex-col">
            <span className="text-xs font-medium text-muted-foreground">已登录</span>
            <span className="truncate text-sm font-semibold">
              {user.name} <span className="font-normal text-muted-foreground">@{user.username}</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "min-h-11 shrink-0")}>
              <HomeIcon data-icon="inline-start" />
              首页
            </Link>
            <LogoutButton className="min-h-11 shrink-0" />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
