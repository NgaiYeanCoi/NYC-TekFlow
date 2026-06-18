import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpenIcon,
  FileTextIcon,
  FolderIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  PaperclipIcon,
  SettingsIcon,
  TagsIcon,
  type LucideIcon,
} from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";
import type { UserSummary } from "@/types/tekflow";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/dashboard/posts", label: "Posts", icon: FileTextIcon },
  { href: "/dashboard/school", label: "School", icon: GraduationCapIcon },
  { href: "/dashboard/categories", label: "Categories", icon: FolderIcon },
  { href: "/dashboard/tags", label: "Tags", icon: TagsIcon },
  { href: "/dashboard/projects", label: "Projects", icon: BookOpenIcon },
  { href: "/dashboard/attachments", label: "Attachments", icon: PaperclipIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardShell({ user, children }: { user: UserSummary; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">T</span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">TekFlow</span>
            <span className="text-xs text-muted-foreground">Command Workspace</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
                <Icon data-icon="inline-start" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">@{user.username}</span>
          </div>
          <LogoutButton />
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
