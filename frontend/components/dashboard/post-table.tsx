import Link from "next/link";
import { EditIcon, PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { StatusBadge, VisibilityBadge } from "@/components/common/status-badge";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/types/tekflow";

export function PostTable({ posts, title = "内容列表" }: { posts: Post[]; title?: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{posts.length} items in current view</p>
        </div>
        <Link href="/dashboard/posts/new" className={buttonVariants({ size: "sm" })}>
          <PlusIcon data-icon="inline-start" />
          新建内容
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {posts.length === 0 ? (
          <Empty className="m-4">
            <EmptyTitle>暂无内容</EmptyTitle>
            <EmptyDescription>创建第一篇 Post 后会出现在这里。</EmptyDescription>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">标题</th>
                  <th className="px-3 py-3 font-semibold">类型</th>
                  <th className="px-3 py-3 font-semibold">可见性</th>
                  <th className="px-3 py-3 font-semibold">状态</th>
                  <th className="px-3 py-3 font-semibold">分类</th>
                  <th className="px-3 py-3 font-semibold">更新</th>
                  <th className="px-3 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="max-w-[320px] px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="truncate font-medium">{post.title}</span>
                        <span className="truncate font-mono text-xs text-muted-foreground">/{post.slug}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{post.type}</td>
                    <td className="px-3 py-3">
                      <VisibilityBadge value={post.visibility} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge value={post.status} />
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{post.category?.name ?? "-"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{formatDateTime(post.updatedAt)}</td>
                    <td className="px-3 py-3">
                      <Link href={`/dashboard/posts/${post.id}`} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-semibold text-primary hover:bg-accent">
                        <EditIcon data-icon="inline-start" />
                        编辑
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
