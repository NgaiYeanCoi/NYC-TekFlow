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
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Link href="/dashboard/posts/new" className={buttonVariants({ size: "sm" })}>
          <PlusIcon data-icon="inline-start" />
          新建内容
        </Link>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <Empty>
            <EmptyTitle>暂无内容</EmptyTitle>
            <EmptyDescription>创建第一篇 Post 后会出现在这里。</EmptyDescription>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-3 pr-3 font-medium">标题</th>
                  <th className="py-3 pr-3 font-medium">类型</th>
                  <th className="py-3 pr-3 font-medium">可见性</th>
                  <th className="py-3 pr-3 font-medium">状态</th>
                  <th className="py-3 pr-3 font-medium">分类</th>
                  <th className="py-3 pr-3 font-medium">更新</th>
                  <th className="py-3 pr-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0">
                    <td className="max-w-[320px] py-3 pr-3">
                      <div className="flex flex-col gap-1">
                        <span className="truncate font-medium">{post.title}</span>
                        <span className="truncate text-xs text-muted-foreground">/{post.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">{post.type}</td>
                    <td className="py-3 pr-3">
                      <VisibilityBadge value={post.visibility} />
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge value={post.status} />
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">{post.category?.name ?? "-"}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{formatDateTime(post.updatedAt)}</td>
                    <td className="py-3 pr-3">
                      <Link href={`/dashboard/posts/${post.id}`} className="inline-flex items-center gap-1 text-primary">
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

