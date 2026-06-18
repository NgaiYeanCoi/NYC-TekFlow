import Link from "next/link";
import { ArrowRightIcon, FileTextIcon, GraduationCapIcon, PaperclipIcon, PlusIcon, ShieldCheckIcon, type LucideIcon } from "lucide-react";
import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostTable } from "@/components/dashboard/post-table";
import { getAdminPosts } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const token = session?.accessToken ?? "";
  const posts = await getAdminPosts(token, { page: 1, pageSize: 6 }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 6 }));
  const publicCount = posts.items.filter((post) => post.visibility === "public").length;
  const schoolCount = posts.items.filter((post) => post.visibility === "school").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">管理内容、可见性、学校事项和附件。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className={buttonVariants({ size: "sm" })} href="/dashboard/posts/new">
            <PlusIcon data-icon="inline-start" />
            新建内容
          </Link>
          <Link className={buttonVariants({ size: "sm", variant: "outline" })} href="/dashboard/posts/new?type=school_notice">
            <GraduationCapIcon data-icon="inline-start" />
            School Notice
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="全部内容" value={posts.total} description="后台可见的 Post" icon={FileTextIcon} />
        <StatCard title="公开内容" value={publicCount} description="当前页 public 项" icon={ShieldCheckIcon} />
        <StatCard title="学校事项" value={schoolCount} description="当前页 school 项" icon={GraduationCapIcon} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <PostTable posts={posts.items} title="最近更新" />
        <Card>
          <CardHeader>
            <CardTitle>快捷入口</CardTitle>
            <CardDescription>常用管理路径。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <QuickLink href="/dashboard/posts" icon={FileTextIcon} label="管理全部内容" />
            <QuickLink href="/dashboard/school" icon={GraduationCapIcon} label="查看 School Notice" />
            <QuickLink href="/dashboard/attachments" icon={PaperclipIcon} label="上传附件" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Icon data-icon="inline-start" />
          </span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-5 md:pt-5">
        <div className="font-mono text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-border bg-background px-3 font-semibold transition-colors hover:border-primary/50 hover:text-primary">
      <span className="flex items-center gap-2">
        <Icon data-icon="inline-start" />
        {label}
      </span>
      <ArrowRightIcon data-icon="inline-end" />
    </Link>
  );
}
