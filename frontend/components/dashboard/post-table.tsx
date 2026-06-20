import Link from "next/link";
import type { ReactNode } from "react";
import { EditIcon, ExternalLinkIcon, LinkIcon, PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { StatusBadge, VisibilityBadge } from "@/components/common/status-badge";
import { formatDateTime } from "@/lib/format";
import { postTypeLabels, publicPostHref } from "@/lib/post-display";
import type { Post } from "@/types/tekflow";

export function PostTable({
  posts,
  title = "内容列表",
  emptyTitle = "暂无内容",
  emptyDescription = "创建第一篇内容后会出现在这里。",
  emptyAction,
}: {
  posts: Post[];
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">当前视图 {posts.length} 项</p>
        </div>
        <Link href="/dashboard/posts/new" className={buttonVariants({ size: "sm" })}>
          <PlusIcon data-icon="inline-start" />
          新建内容
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {posts.length === 0 ? (
          <Empty className="m-4">
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
            {emptyAction ?? (
              <Link href="/dashboard/posts/new" className={buttonVariants({ size: "sm" })}>
                <PlusIcon data-icon="inline-start" />
                新建内容
              </Link>
            )}
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
                    <td className="px-3 py-3 text-muted-foreground">{postTypeLabels[post.type]}</td>
                    <td className="px-3 py-3">
                      <VisibilityBadge value={post.visibility} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge value={post.status} />
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{post.category?.name ?? "-"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{formatDateTime(post.updatedAt)}</td>
                    <td className="px-3 py-3">
                      <PostActions post={post} />
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

function PostActions({ post }: { post: Post }) {
  const href = publicPostHref(post);
  return (
    <div className="flex flex-wrap gap-1">
      <Link href={`/dashboard/posts/${post.id}`} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-semibold text-primary hover:bg-accent">
        <EditIcon data-icon="inline-start" />
        编辑
      </Link>
      {href ? (
        <Link href={href} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-semibold text-muted-foreground hover:bg-accent hover:text-foreground">
          <ExternalLinkIcon data-icon="inline-start" />
          查看
        </Link>
      ) : null}
      {post.visibility === "unlisted" && post.status === "published" ? (
        <Link href={`/dashboard/posts/${post.id}#share`} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-semibold text-muted-foreground hover:bg-accent hover:text-foreground">
          <LinkIcon data-icon="inline-start" />
          分享
        </Link>
      ) : null}
    </div>
  );
}
