import Link from "next/link";
import { FileTextIcon, GraduationCapIcon, ShieldCheckIcon, type LucideIcon } from "lucide-react";
import { auth } from "@/auth";
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
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">管理内容、可见性、学校事项和附件。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="全部内容" value={posts.total} description="后台可见的 Post" icon={FileTextIcon} />
        <StatCard title="公开内容" value={publicCount} description="当前页 public 项" icon={ShieldCheckIcon} />
        <StatCard title="学校事项" value={schoolCount} description="当前页 school 项" icon={GraduationCapIcon} />
      </div>
      <PostTable posts={posts.items} title="最近更新" />
      <Card>
        <CardHeader>
          <CardTitle>快捷入口</CardTitle>
          <CardDescription>常用管理页面。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Link className="text-primary" href="/dashboard/posts/new">新建内容</Link>
          <Link className="text-primary" href="/dashboard/posts/new?type=school_notice">新建 School Notice</Link>
          <Link className="text-primary" href="/dashboard/attachments">上传附件</Link>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Icon data-icon="inline-start" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
